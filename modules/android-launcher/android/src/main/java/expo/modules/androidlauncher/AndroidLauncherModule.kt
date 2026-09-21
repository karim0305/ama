package expo.modules.androidlauncher

import android.content.Intent
import android.provider.Settings
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class AndroidLauncherModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("AndroidLauncher")

    Function("openApp") { packageName: String ->
      val context = appContext.reactContext ?: return@Function false
      val pm = context.packageManager
      val launchIntent = pm.getLaunchIntentForPackage(packageName)
        ?: return@Function false
      launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      context.startActivity(launchIntent)
      true
    }

    Function("isAppInstalled") { packageName: String ->
      val context = appContext.reactContext ?: return@Function false
      try {
        context.packageManager.getPackageInfo(packageName, 0)
        true
      } catch (e: Exception) {
        false
      }
    }

    Function("goHome") {
      val context = appContext.reactContext ?: return@Function false
      val homeIntent = Intent(Intent.ACTION_MAIN).apply {
        addCategory(Intent.CATEGORY_HOME)
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      }
      context.startActivity(homeIntent)
      true
    }

    // --- Accessibility Service bridge ---

    Function("isAccessibilityServiceEnabled") {
      val context = appContext.reactContext ?: return@Function false
      val expectedComponent = "${context.packageName}/${context.packageName}.assistant.AssistantAccessibilityService"
      val enabledServices = Settings.Secure.getString(
        context.contentResolver,
        Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
      ) ?: ""
      enabledServices.contains(expectedComponent)
    }

    Function("openAccessibilitySettings") {
      val context = appContext.reactContext ?: return@Function false
      val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS).apply {
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      }
      context.startActivity(intent)
      true
    }

    Function("goBack") {
      AssistantServiceRegistry.current?.goBack() ?: false
    }

    Function("openRecents") {
      AssistantServiceRegistry.current?.openRecents() ?: false
    }
  }
}