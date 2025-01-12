const fs = require('fs');
const path = require('path');
const os = require('os'); // Use os.tmpdir() for a guaranteed writable directory

module.exports = {
  expo: {
    name: "CoGlider",
    slug: "CoGlider",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.muz4mmil.pairglide",
      googleServicesFile: path.join(os.tmpdir(), 'google-services.json'), // Use temp directory
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      [
        "expo-notifications",
        {
          icon: "./assets/images/icon.png",
          color: "#ffffff",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: "bf42f6d8-936a-43a5-a196-c8832235ba88",
      },
    },
  },
};

// Dynamically create the google-services.json file in the temp directory
if (process.env.GOOGLE_SERVICES_JSON) {
  const googleServicesPath = path.join(os.tmpdir(), 'google-services.json'); // Safe location
  fs.writeFileSync(googleServicesPath, Buffer.from(process.env.GOOGLE_SERVICES_JSON, 'base64'));
}
