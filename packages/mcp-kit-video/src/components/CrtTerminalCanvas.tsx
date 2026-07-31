import {useCallback, useRef} from 'react';
import {
  HtmlInCanvas,
  type HtmlInCanvasOnInit,
  type HtmlInCanvasOnPaint,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {COLORS} from '../theme';

type GlState = {
  gl: WebGL2RenderingContext;
  program: WebGLProgram;
  texture: WebGLTexture;
  vao: WebGLVertexArrayObject;
  buffer: WebGLBuffer;
  uTexture: WebGLUniformLocation | null;
  uTime: WebGLUniformLocation | null;
  uResolution: WebGLUniformLocation | null;
  uRipple: WebGLUniformLocation | null;
};

type CrtTerminalCanvasProps = {
  width: number;
  height: number;
  children: React.ReactNode;
  frameOverride?: number;
  syncRipple?: number;
};

const VERTEX_SHADER = `#version 300 es
in vec2 a_position;
in vec2 a_uv;
out vec2 v_uv;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_uv = a_uv;
}`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

uniform sampler2D u_texture;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_ripple;

in vec2 v_uv;
out vec4 outputColor;

float hash21(vec2 point) {
  point = fract(point * vec2(123.34, 456.21));
  point += dot(point, point + 45.32);
  return fract(point.x * point.y);
}

void main() {
  vec2 centered = v_uv - 0.5;
  float radiusSquared = dot(centered, centered);

  // 1.4% maximum corner displacement: restrained barrel curvature.
  vec2 uv = 0.5 + centered * (1.0 + 0.055 * radiusSquared);

  float rippleCenter = 0.5 + 0.13 * sin(u_time * 2.7);
  float rippleBand = exp(-pow((uv.y - rippleCenter) / 0.055, 2.0));
  uv.x += u_ripple * rippleBand * sin(uv.y * 260.0 + u_time * 18.0) * 0.006;

  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
    outputColor = vec4(0.002, 0.006, 0.015, 1.0);
    return;
  }

  vec2 separation = centered * radiusSquared * 0.0022;
  float red = texture(u_texture, uv + separation).r;
  float green = texture(u_texture, uv).g;
  float blue = texture(u_texture, uv - separation).b;
  float alpha = texture(u_texture, uv).a;
  vec3 color = vec3(red, green, blue);

  vec2 bloomOffset = vec2(1.35) / u_resolution;
  vec3 bloom =
    texture(u_texture, uv + vec2(bloomOffset.x, 0.0)).rgb +
    texture(u_texture, uv - vec2(bloomOffset.x, 0.0)).rgb +
    texture(u_texture, uv + vec2(0.0, bloomOffset.y)).rgb +
    texture(u_texture, uv - vec2(0.0, bloomOffset.y)).rgb;
  color += bloom * 0.018;

  float scanline = 0.982 + 0.018 * sin(uv.y * u_resolution.y * 3.14159265);
  float grain = hash21(floor(uv * u_resolution * 0.68) + floor(u_time * 30.0));
  float flicker = 1.0 + 0.0105 * sin(u_time * 16.7) + (grain - 0.5) * 0.008;
  color *= scanline * flicker;
  color += (grain - 0.5) * 0.008;

  float vignette = 1.0 - smoothstep(0.36, 0.73, length(centered * vec2(1.05, 0.94))) * 0.5;
  color *= vignette;

  outputColor = vec4(color, alpha);
}`;

const QUAD = new Float32Array([
  -1, -1, 0, 0,
  1, -1, 1, 0,
  -1, 1, 0, 1,
  -1, 1, 0, 1,
  1, -1, 1, 0,
  1, 1, 1, 1,
]);

const compileShader = (
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
) => {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error('Unable to create CRT shader');
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) ?? 'Unknown shader error';
    gl.deleteShader(shader);
    throw new Error(`Unable to compile CRT shader: ${message}`);
  }
  return shader;
};

const createProgram = (gl: WebGL2RenderingContext) => {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = gl.createProgram();
  if (!program) {
    throw new Error('Unable to create CRT program');
  }
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program) ?? 'Unknown link error';
    gl.deleteProgram(program);
    throw new Error(`Unable to link CRT program: ${message}`);
  }
  return program;
};

const CrtFallback: React.FC<
  CrtTerminalCanvasProps & {resolvedFrame: number}
> = ({width, height, children, resolvedFrame}) => {
  const grainX = ((resolvedFrame * 17) % 43) - 21;
  const grainY = ((resolvedFrame * 29) % 37) - 18;
  const flicker = 1 + Math.sin(resolvedFrame * 0.53) * 0.009;

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        overflow: 'hidden',
        background: COLORS.backgroundDeep,
        filter: `brightness(${flicker})`,
      }}
    >
      {children}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.1,
          transform: `translate(${grainX}px, ${grainY}px) scale(1.08)`,
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%270 0 180 180%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.84%27 numOctaves=%272%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27 opacity=%270.45%27/%3E%3C/svg%3E")',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0, rgba(0,0,0,0.12) 1px, transparent 1px, transparent 3px), radial-gradient(circle at center, transparent 50%, rgba(0,0,0,0.52) 100%)',
        }}
      />
    </div>
  );
};

export const CrtTerminalCanvas: React.FC<CrtTerminalCanvasProps> = ({
  width,
  height,
  children,
  frameOverride,
  syncRipple = 0,
}) => {
  const currentFrame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const frame = frameOverride ?? currentFrame;
  const gpuRef = useRef<GlState | null>(null);

  const onInit: HtmlInCanvasOnInit = useCallback(({canvas}) => {
    const gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      premultipliedAlpha: true,
    });
    if (!gl) {
      throw new Error(
        'WebGL2 is unavailable. Render with the ANGLE OpenGL backend.',
      );
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    const program = createProgram(gl);
    const texture = gl.createTexture();
    const vao = gl.createVertexArray();
    const buffer = gl.createBuffer();
    if (!texture || !vao || !buffer) {
      throw new Error('Unable to allocate CRT WebGL resources');
    }

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, QUAD, gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, 'a_position');
    const uv = gl.getAttribLocation(program, 'a_uv');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(uv);
    gl.vertexAttribPointer(uv, 2, gl.FLOAT, false, 16, 8);

    gpuRef.current = {
      gl,
      program,
      texture,
      vao,
      buffer,
      uTexture: gl.getUniformLocation(program, 'u_texture'),
      uTime: gl.getUniformLocation(program, 'u_time'),
      uResolution: gl.getUniformLocation(program, 'u_resolution'),
      uRipple: gl.getUniformLocation(program, 'u_ripple'),
    };

    return () => {
      gl.deleteProgram(program);
      gl.deleteTexture(texture);
      gl.deleteVertexArray(vao);
      gl.deleteBuffer(buffer);
      gpuRef.current = null;
    };
  }, []);

  const onPaint: HtmlInCanvasOnPaint = useCallback(
    ({elementImage}) => {
      const gpu = gpuRef.current;
      if (!gpu) {
        return;
      }
      const {gl} = gpu;
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.useProgram(gpu.program);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, gpu.texture);
      gl.texElementImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        elementImage,
      );
      gl.uniform1i(gpu.uTexture, 0);
      gl.uniform1f(gpu.uTime, frame / fps);
      gl.uniform2f(
        gpu.uResolution,
        gl.drawingBufferWidth,
        gl.drawingBufferHeight,
      );
      gl.uniform1f(gpu.uRipple, syncRipple);
      gl.bindVertexArray(gpu.vao);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    },
    [fps, frame, syncRipple],
  );

  if (!HtmlInCanvas.isSupported()) {
    return (
      <CrtFallback
        width={width}
        height={height}
        resolvedFrame={frame}
        syncRipple={syncRipple}
      >
        {children}
      </CrtFallback>
    );
  }

  return (
    <HtmlInCanvas
      width={width}
      height={height}
      pixelDensity={1}
      onInit={onInit}
      onPaint={onPaint}
    >
      {children}
    </HtmlInCanvas>
  );
};
