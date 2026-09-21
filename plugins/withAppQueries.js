const { withAndroidManifest } = require("@expo/config-plugins");

const PACKAGES_TO_QUERY = [
  "com.whatsapp",
  "com.whatsapp.w4b",
  "com.google.android.youtube",
  "com.android.chrome",
  "com.google.android.gm",
  "com.google.android.apps.maps",
  "com.facebook.katana",
  "com.instagram.android",
  "com.android.dialer",
  "com.google.android.dialer",
  "com.android.contacts",
  "com.google.android.contacts",
  "com.android.camera2",
  "com.google.android.GoogleCamera",
  "com.oppo.camera",
  "com.sec.android.app.camera",
  "com.android.settings",
];

module.exports = function withAppQueries(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;

    if (!manifest.queries) {
      manifest.queries = [];
    }

    const packageQueries = {
      package: PACKAGES_TO_QUERY.map((pkg) => ({
        $: { "android:name": pkg },
      })),
    };

    manifest.queries.push(packageQueries);

    return config;
  });
};
