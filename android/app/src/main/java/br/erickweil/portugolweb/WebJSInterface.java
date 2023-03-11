package br.erickweil.portugolweb;

import android.app.Activity;
import android.content.ClipData;
import android.content.ClipDescription;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.webkit.JavascriptInterface;

import java.io.IOException;


public class WebJSInterface {
    public static final int CODE_SAVE = 666;
    public static final int CODE_LOAD = 999;

    public static final int CODE_HTTPGET = 537;

    Inicio context;
    public String file_to_save;
    WebJSInterface(Inicio c){
        context = c;
    }

    @JavascriptInterface
    public void save(String file)
    {
        file_to_save = file;
        //send an ACTION_CREATE_DOCUMENT intent to the system. It will open a dialog where the user can choose a location and a filename

        Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("text/plain"); //isso faz com que seja possível abrir o arquivo depois
        intent.putExtra(Intent.EXTRA_TITLE, "programa.por.txt"); // .txt para que o android reconheça e seja mais fácil achar
        context.startActivityForResult(intent, CODE_SAVE);
    }
    @JavascriptInterface
    public void load()
    {
        Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("*/*"); //not needed, but maybe usefull
        context.startActivityForResult(intent, CODE_LOAD);
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
            e.printStackTrace();
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
            e.printStackTrace();
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
            e.printStackTrace();
            return "";
        }
    }
}
