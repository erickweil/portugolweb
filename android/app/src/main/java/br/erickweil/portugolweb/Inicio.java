package br.erickweil.portugolweb;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.provider.OpenableColumns;
import android.util.Log;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;


import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

public class Inicio extends Activity {

    public static final String SITE_PROTOCOLO = "https://";
    public static final String SITE_DOMINIO = "erickweil.github.io";
    public static final String SITE_INDEX_PATH = "/portugolweb/";
    // Configs teste local
    /*public static final String SITE_PROTOCOLO = "http://";
    public static final String SITE_DOMINIO = "192.168.1.2";
    public static final String SITE_INDEX_PATH = "/";*/

    public static final String SITE_VERSIONCHECK_FILE = "version.json";
    public static final String ANDROID_ASSETS_CACHE_URL = "file:///android_asset/portugolweb/";

    public static final boolean SITE_FAZER_CACHE = true;

    public static final long MAX_FILESIZE = 2000000;
    private WebView webview;
    private WebJSInterface JSinterface;
    private String fileToOpen;
    private int webAppVersion;

    // Se for true não irá tentar atualizar. previne um loop de erros ao abrir o app
    public static boolean falhouCache;

    public static SharedPreferences getPrefs(Context c){
        //https://www.journaldev.com/9412/android-shared-preferences-example-tutorial#targetText=Shared%20Preferences%20allows%20activities%20and,data%2F%7Bapplication%20package%7D%20directory.
        return c.getApplicationContext().getSharedPreferences("SessionData", MODE_PRIVATE); // 0 - for private mode
    }

    public static String getIndex() {
        return SITE_PROTOCOLO+SITE_DOMINIO+SITE_INDEX_PATH;
    }

    public static String getVersionCheck() {
        //return "https://raw.githubusercontent.com/erickweil/portugolweb/develop/"+SITE_VERSIONCHECK_FILE;
        return getIndex() + SITE_VERSIONCHECK_FILE;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_inicio);

        // Get the intent that started this activity
        Intent intent = getIntent();

        if(intent != null) {
            fileToOpen = verifyOpenFile(intent);
        }
        else
        {
            fileToOpen = null;
        }

        String cachePathToOpen = ANDROID_ASSETS_CACHE_URL;

        try {
            SharedPreferences preferences = getPrefs(this);

            int startCount = preferences.getInt("start_count",0);
            int deuNota = preferences.getInt("deu_nota",0);
            String identifier = preferences.getString("identifier", null);

            webAppVersion = preferences.getInt("web_app_version",VersionChecker.VERSAO_ASSETS_WEBAPP);
            cachePathToOpen = preferences.getString("web_app_cache",cachePathToOpen);

            SharedPreferences.Editor prefsEdit = preferences.edit();
            prefsEdit.putInt("start_count",startCount+1);
            if(identifier == null)
            {
                identifier = Utilidades.randomString("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",32);

                prefsEdit.putString("identifier", identifier);
            }
            prefsEdit.apply();// commit??

            Log.d("INICIO","Iniciado "+startCount+" vezes");
            if(startCount == 10 || startCount == 20 || startCount == 40 || (deuNota == 0 && startCount > 50 && startCount % 20 == 0))
            {
                JanelaHelper.AbrirJanelaDarNota(this);
            }
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }


        loaded = 0;
        webview = findViewById(R.id.inicio_webview);

        WebSettings webviewSettings = webview.getSettings();
        webviewSettings.setJavaScriptEnabled(true);
        webviewSettings.setDomStorageEnabled(true);
        //webviewSettings.setAppCachePath(getApplicationContext().getCacheDir().getAbsolutePath());
        webviewSettings.setAllowFileAccess(true);
        //webviewSettings.setAppCacheEnabled(true);
        webviewSettings.setCacheMode(SITE_FAZER_CACHE ? WebSettings.LOAD_DEFAULT : WebSettings.LOAD_NO_CACHE);

        webviewSettings.setDatabaseEnabled(true);
        webviewSettings.setDomStorageEnabled(true);

        webview.setWebChromeClient(new WebChromeClient());
        final WebViewClient client = new InterceptorWebViewClient(
                this,
                SITE_FAZER_CACHE ? SITE_DOMINIO : null,
                SITE_FAZER_CACHE ? SITE_INDEX_PATH : null,
                SITE_FAZER_CACHE ? cachePathToOpen : null
        )
        {
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                onWebViewPageFinished(view,url);
            }
        };

        webview.setWebViewClient(client);

        webviewSettings.setAllowFileAccessFromFileURLs(true); //Maybe you don't need this rule
        webviewSettings.setAllowUniversalAccessFromFileURLs(true);



        Log.d("INICIO","Iniciando App, Página salva no cache:"+cachePathToOpen);

        webview.loadUrl(getIndex());

        JSinterface = new WebJSInterface(this);
        webview.addJavascriptInterface(JSinterface,"Android");
    }

    public int loaded = 0;
    public void onWebViewPageFinished(WebView webview, String url) {
        if(loaded == 0)
        {
            if(fileToOpen != null)
            {
                // fileToOpen is escaped for double quotes already.
                String code = "android_loaded(\""+fileToOpen+"\")";
                //Log.d("INICIO",script);
                execJavascriptCode(code);
            }

            if(!falhouCache && SITE_FAZER_CACHE) {
                // É para que não atrapalhe o carregamento da página.
                new Handler().postDelayed(() -> checkLatestVersion(webAppVersion), 750);
            }
        }
        loaded++;
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);

        // Checks the orientation of the screen
        if (newConfig.orientation == Configuration.ORIENTATION_LANDSCAPE) {
            //Toast.makeText(this, "landscape", Toast.LENGTH_SHORT).show();

        }
        else if (newConfig.orientation == Configuration.ORIENTATION_PORTRAIT) {
            //Toast.makeText(this, "portrait", Toast.LENGTH_SHORT).show();
        }
    }

    public void checkLatestVersion(int webAppVersion)
    {
        Context context = getApplicationContext(); // or activity.getApplicationContext()
        PackageManager packageManager = context.getPackageManager();
        String packageName = context.getPackageName();

        String myVersionName = "not available"; // initialize String

        try {
            myVersionName = packageManager.getPackageInfo(packageName, 0).versionName;
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }

        VersionChecker checker = new VersionChecker(getVersionCheck(),myVersionName,webAppVersion,this);
        //        checker.execute("A");
        checker.executar();
    }

    public String readEscapedTextFromURI(Uri uri)
    {
        try {
            if(uri != null) {
                InputStream in = getContentResolver().openInputStream(uri);

                BufferedReader input = new BufferedReader(new InputStreamReader(in, StandardCharsets.UTF_8));

                StringBuilder result = new StringBuilder();
                String line;
                while((line = input.readLine()) != null)
                {
                    line = line.replace("\\","\\\\");
                    line = line.replace("\"","\\\"");
                    //line = line.replace("\n","\\n");
                    line = line.replace("\t","\\t");
                    result.append(line);
                    result.append("\\n");
                }

                String fileText = result.toString();

                input.close();
                return fileText;
            } else return null;
        }
        catch(IOException e) {
            e.printStackTrace();
            Toast.makeText(this, "Problemas ao carregar:"+e.getMessage(), Toast.LENGTH_SHORT).show();
            return null;
        }
    }

    public String verifyOpenFile(Intent intent)
    {
        Uri uri = intent.getData();
        if(uri != null) {
            long fileSize = getURISize(uri);
            if (fileSize < MAX_FILESIZE) {
                return readEscapedTextFromURI(uri);
            } else {
                Toast.makeText(this, "O arquivo é grande demais:" + fileSize + " bytes!", Toast.LENGTH_LONG).show();
                return null;
            }
        } else return null;
    }

    public long getURISize(Uri uri)
    {

        //java.net.URI juri = new java.net.URI(uri.toString());
        ///File mediaFile = new File(juri.getPath());
        //if(mediaFile != null && mediaFile.exists())
        //return mediaFile.length();
        //else return -1;
        /*
         * Get the file's content URI from the incoming Intent,
         * then query the server app to get the file's display name
         * and size.
         */
        try(Cursor returnCursor =
                getContentResolver().query(uri, null, null, null, null)) {
            /*
             * Get the column indexes of the data in the Cursor,
             * move to the first row in the Cursor, get the data,
             * and display it.
             */
            //int nameIndex = returnCursor.getColumnIndex(OpenableColumns.DISPLAY_NAME);
            int sizeIndex = returnCursor.getColumnIndex(OpenableColumns.SIZE);
            returnCursor.moveToFirst();
            return returnCursor.getLong(sizeIndex);
        } catch (Exception e) {
            e.printStackTrace();
            return -1;
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode,resultCode,data);
        if(requestCode == WebJSInterface.CODE_SAVE && resultCode == Activity.RESULT_OK) {
            Uri uri = data.getData();

            //just as an example, I am writing a String to the Uri I received from the user:

            try {
                if(JSinterface.file_to_save != null && uri != null) {
                    OutputStream output = getContentResolver().openOutputStream(uri);
                    if(output != null) {
                        output.write(JSinterface.file_to_save.getBytes(StandardCharsets.UTF_8));
                        output.flush();
                        output.close();
                    }
                }
            }
            catch(IOException e) {
                e.printStackTrace();
                Toast.makeText(this, "Problemas ao salvar:"+e.getMessage(), Toast.LENGTH_SHORT).show();
            }
        }

        if(requestCode == WebJSInterface.CODE_LOAD && resultCode == Activity.RESULT_OK) {
            Uri uri = data.getData();

            //just as an example, I am writing a String to the Uri I received from the user:

            long fileSize = getURISize(uri);
            
            if(fileSize < MAX_FILESIZE)
            {
                String fileEscapedText = readEscapedTextFromURI(uri);
                if(fileEscapedText != null)
                    execJavascriptCode("android_loaded(\""+fileEscapedText+"\")");
            }
            else
            {
                Toast.makeText(this,"O arquivo é grande demais:"+fileSize+" bytes!",Toast.LENGTH_LONG).show();
            }
        }
    }

    public void execJavascriptCode(String code)
    {
        if(code == null || code.isEmpty()) return;

        //webview.loadUrl("javascript:"+code);
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.KITKAT) {
            webview.evaluateJavascript(code, null); // this don't reload the page, should worry about?
        } else {
            webview.loadUrl("javascript:"+code); // NUNCA VAI EXECUTAR MAS OK
        }
    }
}
