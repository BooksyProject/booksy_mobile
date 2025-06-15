const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    assetExts: [...defaultConfig.resolver.assetExts, "epub", "pdf"],
  },
};

module.exports = mergeConfig(defaultConfig, config);

module.exports = withNativeWind(config, { input: "./global.css" });
