package br.erickweil.portugolweb;

import android.content.ClipData;
import android.content.ClipDescription;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.util.Log;
import android.webkit.JavascriptInterface;

import java.io.IOException;


public class WebJSInterface {
    Inicio context;
    // package-private: acessado apenas por Inicio no mesmo pacote
    String file_to_save;
    WebJSInterface(Inicio c){
        context = c;
    }

    @JavascriptInterface
    public void save(String file) {
        file_to_save = file;
        context.runOnUiThread(() -> context.saveFileLauncher.launch("programa.por.txt"));
    }
    @JavascriptInterface
    public void load() {
        context.runOnUiThread(() -> context.loadFileLauncher.launch("*/*"));
    }

    @JavascriptInterface
    public void httpget(String endereco, int timeout)
    {
        HttpGetTask<HttpGetTask.TaskText> conn = new HttpGetTask<>(timeout, resposta -> {
            if(resposta == null || resposta.length == 0 || resposta[0] == null || !resposta[0].acao_sucesso)
            {
                context.execJavascriptCode("android_async_return(\"Erro ao processar requisição.\")");
                return;
            }

            String txt = resposta[0].texto;

            if(txt == null){
                txt = "Erro ao ler os dados da conexão";
            }

            context.execJavascriptCode("android_async_return(\""+Utilidades.escapeText(txt)+"\")");
        });
        conn.execute(new HttpGetTask.TaskText(endereco));
    }

    @JavascriptInterface
    public void httpgetcheck(String endereco, int timeout)
    {
        HttpGetTask<HttpGetTask.TaskStatus> conn = new HttpGetTask<>(timeout, resposta -> {
            if(resposta == null || resposta.length == 0 || resposta[0] == null || !resposta[0].acao_sucesso)
            {
                context.execJavascriptCode("android_async_return(false)");
                return;
            }

            int respcode = resposta[0].status;
            boolean respok = respcode >= 200 && respcode <= 299;

            context.execJavascriptCode("android_async_return("+respok+")");
        });
        conn.execute(new HttpGetTask.TaskStatus(endereco));
    }

    @JavascriptInterface
    public boolean setClipboardData(String mime,String data)
    {
        try {
            Object clipboardService = context.getSystemService(Context.CLIPBOARD_SERVICE);
            if (clipboardService == null || !(clipboardService instanceof ClipboardManager)) {
                //Log.d("JS", "setClipboardData:ClipboardService is null or not ClipboardManager:" + clipboardService);
                return false;
            }

            ClipboardManager clipboard = (ClipboardManager) clipboardService;

            ClipDescription clipDescription = new ClipDescription("String", new String[]{ClipDescription.MIMETYPE_TEXT_PLAIN});
            ClipData.Item item = new ClipData.Item(data);
            ClipData newData = new ClipData(clipDescription, item);

            clipboard.setPrimaryClip(newData);
            return true;
        }
        catch (Exception e)
        {
            Log.e("WEBJSINTERFACE", "Erro: " + e, e);
            return false;
        }
    }

    private ClipData.Item getClipboardDataItem()
    {
        try {
            Object clipboardService = context.getSystemService(Context.CLIPBOARD_SERVICE);
            if (clipboardService == null || !(clipboardService instanceof ClipboardManager)) {
                //Log.d("JS", "getClipboardData:ClipboardService is null or not ClipboardManager:" + clipboardService);
                return null;
            }

            ClipboardManager clipboard = (ClipboardManager) clipboardService;
            if (clipboard == null || !clipboard.hasPrimaryClip()) {
                //Log.d("JS", "getClipboardData:clipboard doesn't have pimaryClip:" + clipboard);
                return null;
            }
            ClipData data = clipboard.getPrimaryClip();
            if (data == null || data.getItemCount() < 1) {
                //Log.d("JS", "getClipboardData:data is null or empty:" + data);
                return null;
            }

            ClipDescription description = data.getDescription();
            if(description != null && !description.hasMimeType(ClipDescription.MIMETYPE_TEXT_PLAIN))
            {
                //Log.d("JS", "getClipboardData:description doesn't contain '"+ClipDescription.MIMETYPE_TEXT_PLAIN+"':" + description);
                return null;
            }

            for(int i=0;i<data.getItemCount();i++) {
                ClipData.Item dataItem = data.getItemAt(i);
                if(dataItem == null) continue;

                if(description != null && !description.getMimeType(i).equals(ClipDescription.MIMETYPE_TEXT_PLAIN)) continue;

                return dataItem;
            }

            //Log.d("JS", "getClipboardData:no suitable clipdata found:" + data);
            return null;
        }
        catch (Exception e)
        {
            Log.e("WEBJSINTERFACE", "Erro: " + e, e);
            return null;
        }
    }


    @JavascriptInterface
    public boolean hasClipboardData(String mime) {
        ClipData.Item dataItem = getClipboardDataItem();


        if(dataItem == null){
            //Log.d("JS", "hasClipboardData:FAILED, clipdata found:" + dataItem);
            return false;
        }
        else{
            //Log.d("JS", "hasClipboardData:SUCCESS, clipdata found:" + dataItem.toString());
            return true;
        }
    }

    @JavascriptInterface
    public String getClipboardData(String mime) {
        try {
            ClipData.Item dataItem = getClipboardDataItem();
            if(dataItem == null) return "";
            CharSequence dataItemText = dataItem.getText();
            if(dataItemText == null || dataItemText.length() == 0 || dataItemText.length() > Inicio.MAX_FILESIZE) return "";

            //Log.d("JS", "getClipboardData:SUCCESS, clipdata found:" + dataItemText.toString());
            return dataItemText.toString();
        }
        catch (Exception e)
        {
            Log.e("WEBJSINTERFACE", "Erro: " + e, e);
            return "";
        }
    }

    @JavascriptInterface
    public void openWebsite(String link) {
        try {
            Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(link));
            context.startActivity(browserIntent);
        }
        catch (Exception e)
        {
            Log.e("WEBJSINTERFACE", "Erro: " + e, e);
        }
    }
}
