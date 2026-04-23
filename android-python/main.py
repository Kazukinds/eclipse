"""
Eclipse — wrapper Python/Kivy pra WebView Android.
Carrega index.html bundled em assets/www/. Funciona offline.
"""
from kivy.app import App
from kivy.uix.widget import Widget
from kivy.clock import Clock
from kivy.utils import platform


class EclipseApp(App):
    title = "Eclipse"

    def build(self):
        # Placeholder root — WebView injetada via jnius após on_start
        return Widget()

    def on_start(self):
        if platform == "android":
            Clock.schedule_once(self._mount_webview, 0)

    def _mount_webview(self, *_):
        from jnius import autoclass, cast
        from android.runnable import run_on_ui_thread  # type: ignore

        PythonActivity = autoclass("org.kivy.android.PythonActivity")
        WebView = autoclass("android.webkit.WebView")
        WebViewClient = autoclass("android.webkit.WebViewClient")
        LayoutParams = autoclass("android.view.ViewGroup$LayoutParams")
        Color = autoclass("android.graphics.Color")
        CookieManager = autoclass("android.webkit.CookieManager")
        WebSettings = autoclass("android.webkit.WebSettings")

        activity = PythonActivity.mActivity

        @run_on_ui_thread
        def _create():
            wv = WebView(activity)
            wv.setBackgroundColor(Color.parseColor("#09090B"))
            s = wv.getSettings()
            s.setJavaScriptEnabled(True)
            s.setDomStorageEnabled(True)
            s.setDatabaseEnabled(True)
            s.setAllowFileAccess(True)
            s.setAllowContentAccess(True)
            s.setLoadsImagesAutomatically(True)
            s.setUseWideViewPort(True)
            s.setLoadWithOverviewMode(True)
            s.setMediaPlaybackRequiresUserGesture(False)
            s.setMixedContentMode(WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE)
            s.setSupportZoom(True)
            s.setBuiltInZoomControls(False)
            s.setDisplayZoomControls(False)
            CookieManager.getInstance().setAcceptCookie(True)
            CookieManager.getInstance().setAcceptThirdPartyCookies(wv, True)

            wv.setWebViewClient(WebViewClient())
            wv.loadUrl("file:///android_asset/www/index.html")

            params = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
            activity.setContentView(wv, params)

        _create()


if __name__ == "__main__":
    EclipseApp().run()
