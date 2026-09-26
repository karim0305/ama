const {
  withAndroidManifest,
  withDangerousMod,
} = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

function withOverlayManifest(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;
    const application = manifest.application[0];

    if (!application.service) application.service = [];
    if (
      !application.service.some(
        (s) => s.$["android:name"] === ".assistant.VoiceOverlayService",
      )
    ) {
      application.service.push({
        $: {
          "android:name": ".assistant.VoiceOverlayService",
          "android:exported": "false",
          "android:foregroundServiceType": "microphone",
        },
      });
    }

    if (!manifest["uses-permission"]) manifest["uses-permission"] = [];
    const perms = manifest["uses-permission"];
    const ensurePerm = (name) => {
      if (!perms.some((p) => p.$["android:name"] === name)) {
        perms.push({ $: { "android:name": name } });
      }
    };
    ensurePerm("android.permission.SYSTEM_ALERT_WINDOW");
    ensurePerm("android.permission.FOREGROUND_SERVICE");
    ensurePerm("android.permission.FOREGROUND_SERVICE_MICROPHONE");
    ensurePerm("android.permission.POST_NOTIFICATIONS");

    return config;
  });
}

function withOverlayKotlinFile(config) {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const packagePath = config.android.package.replace(/\./g, "/");
      const kotlinDir = path.join(
        config.modRequest.platformProjectRoot,
        `app/src/main/java/${packagePath}/assistant`,
      );
      if (!fs.existsSync(kotlinDir))
        fs.mkdirSync(kotlinDir, { recursive: true });

      const kotlinContent = `package ${config.android.package}.assistant

import android.app.*
import android.content.Intent
import android.graphics.PixelFormat
import android.os.Build
import android.os.IBinder
import android.view.Gravity
import android.view.View
import android.view.WindowManager
import android.widget.ImageButton
import androidx.core.app.NotificationCompat
import expo.modules.androidlauncher.VoiceOverlayBridge

class VoiceOverlayService : Service() {

  private var windowManager: WindowManager? = null
  private var overlayView: View? = null

  companion object {
    const val CHANNEL_ID = "voice_overlay_channel"
    const val NOTIFICATION_ID = 4201
  }

  override fun onCreate() {
    super.onCreate()
    startForegroundWithNotification()
    showOverlay()
  }

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    return START_NOT_STICKY
  }

  override fun onBind(intent: Intent?): IBinder? = null

  private fun startForegroundWithNotification() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val channel = NotificationChannel(
        CHANNEL_ID, "Voice Assistant Active", NotificationManager.IMPORTANCE_LOW
      )
      val manager = getSystemService(NotificationManager::class.java)
      manager.createNotificationChannel(channel)
    }

    val notification = NotificationCompat.Builder(this, CHANNEL_ID)
      .setContentTitle("AMA Assistant listening")
      .setContentText("Tap the floating button to stop")
      .setSmallIcon(android.R.drawable.ic_btn_speak_now)
      .setOngoing(true)
      .build()

    startForeground(NOTIFICATION_ID, notification)
  }

  private fun showOverlay() {
    windowManager = getSystemService(WINDOW_SERVICE) as WindowManager

    val overlayType = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
      WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
    else
      WindowManager.LayoutParams.TYPE_PHONE

    val params = WindowManager.LayoutParams(
      120, 120, overlayType,
      WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
      PixelFormat.TRANSLUCENT
    )
    params.gravity = Gravity.TOP or Gravity.START
    params.x = 40
    params.y = 200

    val button = ImageButton(this)
    button.setImageResource(android.R.drawable.ic_media_pause)
    button.setBackgroundColor(0xFFE4574C.toInt())
    button.setOnClickListener {
      VoiceOverlayBridge.onStop?.invoke()
      stopSelf()
    }

    overlayView = button
    windowManager?.addView(overlayView, params)
  }

  override fun onDestroy() {
    super.onDestroy()
    overlayView?.let { windowManager?.removeView(it) }
    overlayView = null
  }
}
`;
      fs.writeFileSync(
        path.join(kotlinDir, "VoiceOverlayService.kt"),
        kotlinContent,
      );
      return config;
    },
  ]);
}

module.exports = function withVoiceOverlay(config) {
  config = withOverlayManifest(config);
  config = withOverlayKotlinFile(config);
  return config;
};
