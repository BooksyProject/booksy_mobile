const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Thêm định dạng file tùy chỉnh (nếu bạn cần .epub, .pdf)
config.resolver.assetExts.push("epub", "pdf");

module.exports = withNativeWind(config, {
  input: "./global.css",
});
