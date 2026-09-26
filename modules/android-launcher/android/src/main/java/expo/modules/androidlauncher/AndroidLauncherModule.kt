package expo.modules.androidlauncher

import android.content.Intent
import android.net.Uri
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

    Function("hasOverlayPermission") {
      val context = appContext.reactContext ?: return@Function false
      Settings.canDrawOverlays(context)
    }

    Function("requestOverlayPermission") {
      val context = appContext.reactContext ?: return@Function false
      val intent = Intent(
        Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
        Uri.parse("package:${context.packageName}")
      ).apply { addFlags(Intent.FLAG_ACTIVITY_NEW_TASK) }
      context.startActivity(intent)
      true
    }

    Function("startVoiceOverlay") {
      val context = appContext.reactContext ?: return@Function false
      val serviceClass = Class.forName("${context.packageName}.assistant.VoiceOverlayService")
      val intent = Intent(context, serviceClass)
      context.startForegroundService(intent)
      true
    }

    Function("stopVoiceOverlay") {
      val context = appContext.reactContext ?: return@Function false
      val serviceClass = Class.forName("${context.packageName}.assistant.VoiceOverlayService")
      context.stopService(Intent(context, serviceClass))
      true
    }

    Function("getInstalledApps") {
      val context = appContext.reactContext ?: return@Function emptyList<Map<String, String>>()
      val pm = context.packageManager
      val intent = Intent(Intent.ACTION_MAIN, null).apply {
        addCategory(Intent.CATEGORY_LAUNCHER)
      }
      val apps = pm.queryIntentActivities(intent, 0)
      apps.map { resolveInfo ->
        mapOf(
          "packageName" to resolveInfo.activityInfo.packageName,
          "appName" to resolveInfo.loadLabel(pm).toString()
        )
      }
    }

    Function("openPlayStoreSearch") { query: String ->
      val context = appContext.reactContext ?: return@Function false
      try {
        val marketIntent = Intent(
          Intent.ACTION_VIEW,
          Uri.parse("market://search?q=$query&c=apps")
        ).apply { addFlags(Intent.FLAG_ACTIVITY_NEW_TASK) }
        context.startActivity(marketIntent)
      } catch (e: Exception) {
        val webIntent = Intent(
          Intent.ACTION_VIEW,
          Uri.parse("https://play.google.com/store/search?q=$query&c=apps")
        ).apply { addFlags(Intent.FLAG_ACTIVITY_NEW_TASK) }
        context.startActivity(webIntent)
      }
      true
    }
  }
}