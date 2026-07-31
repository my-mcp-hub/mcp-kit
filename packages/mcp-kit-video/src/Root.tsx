import {Composition} from 'remotion';
import {McpKitCliWalkthrough} from './McpKitCliWalkthrough';
import {FPS, HEIGHT, TOTAL_FRAMES, WIDTH} from './theme';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="McpKitCliWalkthrough"
      component={McpKitCliWalkthrough}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
