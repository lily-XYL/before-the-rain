package local.beforetherain.game;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.content.res.Configuration;
import android.graphics.Color;
import android.graphics.Insets;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.Toast;
import org.json.JSONObject;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Date;
import java.util.Locale;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public final class MainActivity extends Activity {
    private static final String HOME = "https://appassets.androidplatform.net/game/index.html";
    private static final int EXPORT = 101, IMPORT = 102, MAX_BACKUP = 32 * 1024 * 1024;
    private WebView web;
    private FrameLayout content;
    private boolean immersive = true, picking = false, paused = false;
    private String pendingExport;
    private final ExecutorService files = Executors.newSingleThreadExecutor();

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        if (Build.VERSION.SDK_INT >= 28) {
            WindowManager.LayoutParams params = getWindow().getAttributes();
            params.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
            getWindow().setAttributes(params);
        }
        content = new FrameLayout(this);
        content.setBackgroundColor(Color.rgb(18, 51, 55));
        web = new WebView(this);
        web.setBackgroundColor(Color.rgb(18, 51, 55));
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);
        WebSettings settings = web.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setJavaScriptCanOpenWindowsAutomatically(false);
        settings.setSupportMultipleWindows(false);
        settings.setMediaPlaybackRequiresUserGesture(true);
        settings.setTextZoom(100);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        WebView.setWebContentsDebuggingEnabled(false);
        web.setWebViewClient(new LocalClient());
        web.setWebChromeClient(new WebChromeClient());
        web.addJavascriptInterface(new MobileBridge(), "RainAndroid");
        content.addView(web, new FrameLayout.LayoutParams(-1, -1));
        setContentView(content);
        configureInsets();
        applyFullscreen();
        if (Build.VERSION.SDK_INT >= 33) getOnBackInvokedDispatcher().registerOnBackInvokedCallback(0, this::back);
        web.loadUrl(HOME);
    }

    private void configureInsets() {
        if (Build.VERSION.SDK_INT >= 30) {
            getWindow().setDecorFitsSystemWindows(false);
            content.setOnApplyWindowInsetsListener((view, windowInsets) -> {
                Insets bars = windowInsets.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout());
                int bottom = Math.max(bars.bottom, windowInsets.getInsets(WindowInsets.Type.mandatorySystemGestures()).bottom);
                view.setPadding(bars.left, bars.top, bars.right, bottom);
                return windowInsets;
            });
        } else {
            content.setOnApplyWindowInsetsListener((view, windowInsets) -> {
                int left = windowInsets.getSystemWindowInsetLeft(), top = windowInsets.getSystemWindowInsetTop();
                int right = windowInsets.getSystemWindowInsetRight(), bottom = windowInsets.getSystemWindowInsetBottom();
                if (Build.VERSION.SDK_INT >= 28 && windowInsets.getDisplayCutout() != null) {
                    left = Math.max(left, windowInsets.getDisplayCutout().getSafeInsetLeft());
                    top = Math.max(top, windowInsets.getDisplayCutout().getSafeInsetTop());
                    right = Math.max(right, windowInsets.getDisplayCutout().getSafeInsetRight());
                    bottom = Math.max(bottom, windowInsets.getDisplayCutout().getSafeInsetBottom());
                }
                view.setPadding(left, top, right, bottom);
                return windowInsets;
            });
        }
    }

    private void applyFullscreen() {
        if (Build.VERSION.SDK_INT >= 30) {
            WindowInsetsController controller = getWindow().getInsetsController();
            if (controller != null) {
                controller.setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
                if (immersive) controller.hide(WindowInsets.Type.systemBars());
                else controller.show(WindowInsets.Type.systemBars());
            }
        } else {
            int flags = View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION;
            if (immersive) flags |= View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY;
            getWindow().getDecorView().setSystemUiVisibility(flags);
        }
        content.requestApplyInsets();
    }

    @Override public void onWindowFocusChanged(boolean focus) { super.onWindowFocusChanged(focus); if (focus && web != null) applyFullscreen(); }
    @Override public void onConfigurationChanged(Configuration configuration) { super.onConfigurationChanged(configuration); applyFullscreen(); }
    @Override protected void onPause() {
        paused = true;
        if (web != null) { web.evaluateJavascript("window.RainMobileActivity && RainMobileActivity.pause()", null); web.onPause(); web.pauseTimers(); }
        super.onPause();
    }
    @Override protected void onResume() {
        super.onResume(); paused = false;
        if (web != null) { web.resumeTimers(); web.onResume(); web.evaluateJavascript("window.RainMobileActivity && RainMobileActivity.resume()", null); }
    }
    @Override protected void onDestroy() {
        if (web != null) { web.removeJavascriptInterface("RainAndroid"); content.removeView(web); web.destroy(); web = null; }
        files.shutdown(); super.onDestroy();
    }
    @Override public void onBackPressed() { back(); }
    private void back() {
        if (web == null) { finish(); return; }
        web.evaluateJavascript("window.RainMobile ? RainMobile.back() : 'exit'", result -> {
            if ("\"exit\"".equals(result)) new AlertDialog.Builder(this).setTitle("退出雨停之前？")
                .setMessage("下次打开可以继续当前故事。")
                .setNegativeButton("继续阅读", null).setPositiveButton("退出", (dialog, which) -> finish()).show();
        });
    }
    private void message(String text) { runOnUiThread(() -> { if (!isFinishing()) Toast.makeText(this, text, Toast.LENGTH_LONG).show(); }); }
    private void javascript(String code) { runOnUiThread(() -> { if (web != null && !isFinishing()) web.evaluateJavascript(code, null); }); }

    public final class MobileBridge {
        @JavascriptInterface public void toggleFullscreen() { runOnUiThread(() -> { immersive = !immersive; applyFullscreen(); }); }
        @JavascriptInterface public void importBackup() { runOnUiThread(() -> {
            if (picking) return;
            Intent request = new Intent(Intent.ACTION_OPEN_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE).setType("*/*");
            request.putExtra(Intent.EXTRA_MIME_TYPES, new String[] { "application/json", "text/plain", "application/octet-stream" });
            try { picking = true; startActivityForResult(request, IMPORT); }
            catch (Exception error) { picking = false; message("无法打开文件选择器，请稍后重试。"); }
        }); }
        @JavascriptInterface public void exportBackup(String json) {
            if (json == null || json.length() > MAX_BACKUP) { message("备份文件过大，无法导出。"); return; }
            try {
                JSONObject backup = new JSONObject(json);
                if (!"before-the-rain-backup".equals(backup.optString("format")) || !"rain-chapter-one-v1".equals(backup.optString("storyId"))) throw new IllegalArgumentException();
            } catch (Exception error) { message("故事备份格式不正确。"); return; }
            runOnUiThread(() -> {
                if (picking) return;
                pendingExport = json;
                Intent request = new Intent(Intent.ACTION_CREATE_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE).setType("application/json");
                request.putExtra(Intent.EXTRA_TITLE, "雨停之前_故事备份_" + new SimpleDateFormat("yyyy-MM-dd", Locale.ROOT).format(new Date()) + ".json");
                try { picking = true; startActivityForResult(request, EXPORT); }
                catch (Exception error) { picking = false; pendingExport = null; message("无法打开保存位置，请稍后重试。"); }
            });
        }
    }

    @Override protected void onActivityResult(int request, int result, Intent data) {
        super.onActivityResult(request, result, data);
        if (request != EXPORT && request != IMPORT) return;
        picking = false;
        String exportText = pendingExport; pendingExport = null;
        if (result != RESULT_OK || data == null || data.getData() == null) return;
        Uri document = data.getData();
        if (request == EXPORT && exportText != null) {
            files.execute(() -> {
                try (OutputStream stream = getContentResolver().openOutputStream(document, "wt")) {
                    if (stream == null) throw new IllegalStateException();
                    stream.write(exportText.getBytes(StandardCharsets.UTF_8)); stream.flush(); message("已保存故事备份。");
                } catch (Exception error) { message("备份未能保存，请重新选择位置。"); }
            });
        } else if (request == IMPORT) {
            files.execute(() -> {
                try (InputStream stream = getContentResolver().openInputStream(document); ByteArrayOutputStream buffer = new ByteArrayOutputStream()) {
                    if (stream == null) throw new IllegalStateException();
                    byte[] block = new byte[8192]; int count;
                    while ((count = stream.read(block)) != -1) {
                        if (buffer.size() + count > MAX_BACKUP) { message("备份文件过大，请选择原导出的故事备份。"); return; }
                        buffer.write(block, 0, count);
                    }
                    String json = new String(buffer.toByteArray(), StandardCharsets.UTF_8);
                    javascript("window.RainMobile && RainMobile.receiveBackup(" + JSONObject.quote(json) + ")");
                } catch (Exception error) { message("无法读取这份备份，请重新选择文件。"); }
            });
        }
    }

    private final class LocalClient extends WebViewClient {
        @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) { return !HOME.equals(request.getUrl().toString()); }
        @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
            Uri url = request.getUrl();
            String location = url.getPath();
            if (!"GET".equals(request.getMethod()) || !"https".equals(url.getScheme()) || !"appassets.androidplatform.net".equals(url.getHost()) || location == null || !location.startsWith("/game/") || location.contains("..") || location.contains("\\")) return missing();
            try {
                String name = location.substring(1);
                String type = name.endsWith(".html") ? "text/html" : name.endsWith(".js") ? "application/javascript" : name.endsWith(".css") ? "text/css" : name.endsWith(".png") ? "image/png" : "application/octet-stream";
                return new WebResourceResponse(type, "UTF-8", 200, "OK", Collections.singletonMap("Cache-Control", "no-cache"), getAssets().open(name));
            } catch (Exception error) { return missing(); }
        }
        @Override public void onPageFinished(WebView view, String url) {
            if (paused) view.evaluateJavascript("window.RainMobileActivity && RainMobileActivity.pause()", null);
        }
        private WebResourceResponse missing() { return new WebResourceResponse("text/plain", "UTF-8", 404, "Not Found", Collections.emptyMap(), new ByteArrayInputStream(new byte[0])); }
    }
}
