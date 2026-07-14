// Remotion render config. JPEG for intermediate frames (faster than PNG, no
// visible difference on dark backgrounds); overwrite output without prompting
// (you iterate a lot).
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
