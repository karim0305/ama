const {
  withAndroidManifest,
  withDangerousMod,
} = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

const ACCESSIBILITY_CONFIG_XML = `<?xml version="1.0" encoding="utf-8"?>
<accessibility-service xmlns:android="http://schemas.android.com/apk/res/android"
  android:accessibilityEventTypes="typeWindowStateChanged"
  android:accessibilityFeedbackType="feedbackGeneric"
  android:accessibilityFlags="flagDefault"
  android:canPerformGestures="true"
  android:canRetrieveWindowContent="false"
  android:notificationTimeout="100"
  android:description="@string/accessibility_service_description" />
`;

function withAccessibilityManifest(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;
    const application = manifest.application[0];

    if (!application.service) {
      application.service = [];
    }

    const alreadyAdded = application.service.some(
      (s) => s.$["android:name"] === ".assistant.AssistantAccessibilityService",
    );
    if (alreadyAdded) return config;

    application.service.push({
      $: {
        "android:name": ".assistant.AssistantAccessibilityService",
        "android:label": "AMA Assistant",
        "android:permission": "android.permission.BIND_ACCESSIBILITY_SERVICE",
        "android:exported": "true",
      },
      "intent-filter": [
        {
          action: [
            {
              $: {
                "android:name":
                  "android.accessibilityservice.AccessibilityService",
              },
            },
          ],
        },
      ],
      "meta-data": [
        {
          $: {
            "android:name": "android.accessibilityservice",
            "android:resource": "@xml/accessibility_service_config",
          },
        },
      ],
    });

    return config;
  });
}

function withAccessibilityConfigFile(config) {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      // 1. Write the accessibility service config XML
      const xmlDir = path.join(
        config.modRequest.platformProjectRoot,
        "app/src/main/res/xml",
      );
      if (!fs.existsSync(xmlDir)) fs.mkdirSync(xmlDir, { recursive: true });
      fs.writeFileSync(
        path.join(xmlDir, "accessibility_service_config.xml"),
        ACCESSIBILITY_CONFIG_XML,
      );

      // 2. Write the description string resource
      const valuesDir = path.join(
        config.modRequest.platformProjectRoot,
        "app/src/main/res/values",
      );
      if (!fs.existsSync(valuesDir))
        fs.mkdirSync(valuesDir, { recursive: true });
      fs.writeFileSync(
        path.join(valuesDir, "accessibility_strings.xml"),
        `<?xml version="1.0" encoding="utf-8"?>
<resources>
  <string name="accessibility_service_description">Allows AMA Assistant to perform Go Back and Recent Apps actions when you ask it to.</string>
</resources>
`,
      );

      // 3. Generate and copy the Kotlin AccessibilityService into the
      //    app's own package directory (not the android-launcher module),
      //    so the manifest's relative service name (.assistant.Assistant...)
      //    resolves correctly.
      const packagePath = config.android.package.replace(/\./g, "/");
      const kotlinDir = path.join(
        config.modRequest.platformProjectRoot,
        `app/src/main/java/${packagePath}/assistant`,
      );
      if (!fs.existsSync(kotlinDir))
        fs.mkdirSync(kotlinDir, { recursive: true });

      const kotlinContent = `package ${config.android.package}.assistant

import android.accessibilityservice.AccessibilityService
import android.view.accessibility.AccessibilityEvent
import expo.modules.androidlauncher.AssistantServiceActions
import expo.modules.androidlauncher.AssistantServiceRegistry

class AssistantAccessibilityService : AccessibilityService(), AssistantServiceActions {

  override fun onServiceConnected() {
    super.onServiceConnected()
    AssistantServiceRegistry.current = this
  }

  override fun onDestroy() {
    super.onDestroy()
    AssistantServiceRegistry.current = null
  }

  override fun onAccessibilityEvent(event: AccessibilityEvent?) {}

  override fun onInterrupt() {}

  override fun goBack(): Boolean {
    return performGlobalAction(GLOBAL_ACTION_BACK)
  }

  override fun openRecents(): Boolean {
    return performGlobalAction(GLOBAL_ACTION_RECENTS)
  }
}
`;

      fs.writeFileSync(
        path.join(kotlinDir, "AssistantAccessibilityService.kt"),
        kotlinContent,
      );

      return config;
    },
  ]);
}

module.exports = function withAccessibilityService(config) {
  config = withAccessibilityManifest(config);
  config = withAccessibilityConfigFile(config);
  return config;
};
