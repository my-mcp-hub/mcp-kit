import { Config } from '@remotion/cli/config'

Config.setChromiumOpenGlRenderer('angle')
Config.setOverwriteOutput(true)
Config.setVideoImageFormat('jpeg')
Config.setPixelFormat('yuv420p')
Config.setCodec('h264')
Config.setCrf(18)
Config.setConcurrency(2)
Config.setDelayRenderTimeoutInMilliseconds(120_000)
