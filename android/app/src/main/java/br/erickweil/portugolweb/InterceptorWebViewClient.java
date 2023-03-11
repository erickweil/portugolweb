package br.erickweil.portugolweb;

import static br.erickweil.portugolweb.Utilidades.readAllBytes;

import android.app.Activity;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Build;
import android.util.Log;
import android.webkit.MimeTypeMap;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import androidx.annotation.Nullable;

import org.json.JSONObject;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

public class InterceptorWebViewClient extends WebViewClient {

    private final String dominio;
    private final String path;
    private String cache_url;
    private final Activity context;

    public InterceptorWebViewClient(Activity context,String dominio, String path, String cache_url)
    {
        this.context = context;
        this.dominio = dominio;
        this.path = path;
        this.cache_url = cache_url;
    }

    public static final boolean estaDentro(Uri uri, String dominio, String parentPath) {
        if(!uri.getHost().equals(dominio)) return false;

        String path = uri.getPath();
        if(path == null && parentPath == null) return false;
        if(path == null) return false;

        if(path.startsWith(parentPath)) return true;

        return false;
    }

    public static final String combinar(String path, String match_path, String cache_url) {
        String sub_path = path.substring(match_path.length());
        return cache_url+sub_path;
    }

    // https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types#apng_animated_portable_network_graphics
    public static final String MYgetMimeType(String path) {
        if(path.endsWith(".por")|| path.endsWith(".txt")) return "text/plain";

        if(path.endsWith("/") || path.endsWith(".html")  || path.endsWith(".htm") || path.endsWith(".php")) return "text/html";
        if(path.endsWith(".js") || path.endsWith(".cjs") || path.endsWith(".mjs")
            || path.endsWith(".jsx") || path.endsWith(".ts") || path.endsWith(".tsx")
                || path.endsWith(".es6") || path.endsWith(".es")) return "text/javascript";

        if(path.endsWith(".css") || path.endsWith(".scss") ) return "text/css";

        if(path.endsWith(".apng")) return "image/apng";
        if(path.endsWith(".avif")) return "image/avif";
        if(path.endsWith(".bmp")) return "image/bmp";
        if(path.endsWith(".ico")) return "image/vnd.microsoft.icon";
        if(path.endsWith(".png")) return "image/png";
        if(path.endsWith(".gif")) return "image/gif";
        if(path.endsWith(".jpg") || path.endsWith(".jpeg") || path.endsWith(".jpe") || path.endsWith(".jif") || path.endsWith(".jfif")) return "image/jpeg";
        if(path.endsWith(".svg")) return "image/svg+xml";
        if(path.endsWith(".tiff") || path.endsWith(".tif")) return "image/tiff";
        if(path.endsWith(".webp")) return "image/webp";
        if(path.endsWith(".xbm")) return "image/xbm";


        if(path.endsWith(".wav")) return "audio/wav";
        if(path.endsWith(".ogg")) return "application/ogg";
        if(path.endsWith(".webm")) return "audio/webm";

        return null;
    }

    // url = file path or whatever suitable URL you want.
    public static String getMimeType(String url) {
        String type = null;
        String extension = MimeTypeMap.getFileExtensionFromUrl(url);
        if (extension != null) {
            type = MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension);
        }
        return type;
    }

    @Nullable
    @Override
    public WebResourceResponse shouldInterceptRequest(WebView view,
                                                      WebResourceRequest request) {
        if(dominio != null && cache_url != null && path != null) {
            WebResourceResponse r = tentarInterceptar(request);

            if (r != null) return r;
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            Log.w("INICIO", "NÃO INTERCEPTAR:" + request.getUrl());
        }
        return super.shouldInterceptRequest(view, request);
    }

    public void invalidarPrefsCache(){
        Log.e("INICIO","INVALIDANDO O CACHE DAS PREFS");
        SharedPreferences preferences = Inicio.getPrefs(context);

        SharedPreferences.Editor prefsEdit = preferences.edit();

        prefsEdit.remove("web_app_version");
        prefsEdit.remove("web_app_cache");

        // Para que não dê o crash 10x devido a requisições pendentes em paralelo
        this.cache_url = Inicio.ANDROID_ASSETS_CACHE_URL;

        prefsEdit.apply();// commit??
    }

    public WebResourceResponse tentarInterceptar(WebResourceRequest request) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                // https://stackoverflow.com/questions/8273991/webview-shouldinterceptrequest-example
                if(estaDentro(request.getUrl(),this.dominio,this.path))
                {
                    String uri_path = request.getUrl().getPath();

                    String mimeType = getMimeType(request.getUrl().toString());
                    if(mimeType == null)
                    {
                        mimeType = MYgetMimeType(uri_path);

                        if(mimeType == null) {
                            Log.e("INICIO", "NÃO INTERCEPTAR:" + request.getUrl() + " PORQUE NÃO SABE O MIME TYPE");
                            return null;
                        }
                    }

                    String novoUrl = combinar(uri_path,path,cache_url);
                    if(novoUrl.endsWith("/")) novoUrl = novoUrl+"index.html";

                    Uri resultUri = Uri.parse(novoUrl);
                    InputStream fileToRead = null;
                    //boolean isAsset = false;
                    if (resultUri.getScheme().equals("file") && resultUri.getPath().startsWith("/android_asset/")) {
                        String path = resultUri.getPath().replace("/android_asset/", ""); // TODO: should be at start only
                        fileToRead = context.getAssets().open(path);
                        //isAsset = true;
                    }
                    else {
                        // E se for /../../../com.whatsapp/ ?
                        fileToRead = context.getContentResolver().openInputStream(resultUri);
                        //isAsset = false;
                    }

                    if (fileToRead == null) throw new IOException("Erro ao ler arquivo do cache, InputStream null");

                    // A ideia é que quando não é um arquivo dos Assets, será realizada uma verificação
                    // de integridade, baseado no arquivo version.json que é baixado a cada vez que abre o app.
                    // SO QUE NÃO SERÁ FEITO PORQUE CONFIAMOS QUE AO BAIXAR JÁ FEZ ESSA VERIFICAÇÃO
                    /*
                    if(!isAsset) {
                        JSONObject versionJson = VersionChecker.getVersionJson(context);
                        if (versionJson != null) {
                            byte[] fileBytes;
                            try {
                                fileBytes = readAllBytes(fileToRead, -1);
                            }
                            finally {
                                fileToRead.close();
                            }

                            if(!VersionChecker.doFileIntegrityCheck(fileBytes,novoUrl,versionJson))
                            {
                                throw new IOException("Não está correto o arquivo do cache. Erro na verificação de integridade");
                            }

                            fileToRead = new ByteArrayInputStream(fileBytes);
                        } else {
                            Log.e("INICIO","Version Json null, não é possível verificar a versão");
                        }
                    }*/

                    Log.w("INICIO", "INTERCEPTAR:" + request.getUrl() + " --> " + resultUri + " " + mimeType);

                    return new WebResourceResponse(mimeType, "UTF-8", fileToRead);
                }
                else return null;
            }
            else return null;
        } catch (Exception e) {
            e.printStackTrace();

            // Precisa invalidar o cache pq falhou na abertura de um arquivo
            // Irá no próximo reinício abrir dos Assets que não tem como falhar
            invalidarPrefsCache();

            // Não atualizar agora. só quando fechar e abrir o app denovo.
            // PREVINE POSSÍVEIS LOOPS DE CRASH QUE PODEM ACONTECER COM O SISTEMA DE ATUALIZAÇÃO AUTOMÁTICA
            Inicio.falhouCache = true;

            Log.e("INICIO", "INTERCEPTAR:" + request.getUrl() + " FALHOU!! REINICIANDO A ACTIVITY");

            // Recomeça a Activity para recarregar o webview com o url correto
            context.runOnUiThread(() -> context.recreate());

            return null;
        }
    }

    public InputStream openAssetUri(String fileuri,Activity context) throws IOException {
        return context.getAssets().open(fileuri);
    }

    public WebResourceResponse gerarRedirect(String newUrl) {
        String content = "<script>location.href = '" + newUrl + "'</script>";
        WebResourceResponse redirectRes = new WebResourceResponse("text/html", "utf-8", new ByteArrayInputStream(content.getBytes()));
        return redirectRes;
    }
}
