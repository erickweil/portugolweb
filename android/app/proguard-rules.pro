# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# ── WebView + JavaScript Interface ──────────────────────────────────
# Manter todos os métodos anotados com @JavascriptInterface (chamados pelo JS no WebView)
-keep class br.erickweil.portugolweb.WebJSInterface
-keepclassmembers class br.erickweil.portugolweb.WebJSInterface {
    @android.webkit.JavascriptInterface public *;
}

# Manter a classe InterceptorWebViewClient (usada como WebViewClient customizado)
-keep class br.erickweil.portugolweb.InterceptorWebViewClient { *; }

# ── Stack traces legíveis ───────────────────────────────────────────
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# ── Firebase ────────────────────────────────────────────────────────
# As regras do Firebase são incluídas automaticamente via consumer proguard rules
# das dependências. Mas garantir que serialização JSON não quebre:
-keepattributes Signature
-keepattributes *Annotation*
