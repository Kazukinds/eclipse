package com.kazuki.fichaeclipse;

import android.annotation.SuppressLint;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowInsets;
import android.view.WindowManager;

import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Window w = getWindow();
        // Barra de status VISÍVEL com fundo cinza; conteúdo abaixo dela (não atrás).
        w.setStatusBarColor(Color.parseColor("#26262B"));
        w.setNavigationBarColor(Color.TRANSPARENT);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            try {
                w.getAttributes().layoutInDisplayCutoutMode =
                        WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
            } catch (Exception ignored) {}
        }
        // Conteúdo reserva espaço da barra de status (fica abaixo). Só a nav bar
        // continua imersiva escondida (ver _enterImmersive).
        WindowCompat.setDecorFitsSystemWindows(w, true);
        _enterImmersive();
    }

    @SuppressLint("InlinedApi")
    private void _enterImmersive() {
        try {
            Window w = getWindow();
            WindowInsetsControllerCompat ctrl = WindowCompat.getInsetsController(w, w.getDecorView());
            if (ctrl != null) {
                ctrl.setSystemBarsBehavior(
                        WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
                // Esconde só a nav bar (de baixo); barra de status fica visível.
                ctrl.hide(WindowInsetsCompat.Type.navigationBars());
            } else {
                // Fallback flags legadas — sem FULLSCREEN, então status bar fica visível.
                w.getDecorView().setSystemUiVisibility(
                        View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                                | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                                | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
            }
        } catch (Exception ignored) {}
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) _enterImmersive();
    }

    @Override
    public void onResume() {
        super.onResume();
        _enterImmersive();
    }
}
