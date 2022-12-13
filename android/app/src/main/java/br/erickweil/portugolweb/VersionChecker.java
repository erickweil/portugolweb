package br.erickweil.portugolweb;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.os.AsyncTask;
import android.util.Log;


import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.SocketException;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.net.UnknownHostException;
import java.nio.charset.Charset;
import java.util.HashMap;
import java.util.Map;

import javax.net.ssl.HttpsURLConnection;

public class VersionChecker {
    public static final int READ_TIMEOUT = 30000;
    public static final int VERSAO_ASSETS_WEBAPP = 2; // Versão do webapp incluso no apk nos assets

    public String endereco;
    public String versaoApp;
    public int versaoWeb;
    private Activity context;
    public VersionChecker(String endereco,String versaoApp, int versaoWeb, Activity context)
    {
        this.endereco = endereco;
        this.versaoApp = versaoApp;
        this.versaoWeb = versaoWeb;
        this.context = context;
    }

    public void executar() {
        HttpGetTask<HttpGetTask.TaskText> conn = new HttpGetTask<>(READ_TIMEOUT, resposta -> {
            if(resposta == null || resposta.length == 0 || resposta[0] == null || !resposta[0].acao_sucesso)
            {
                Log.e("VERSIONCHECKER","Não foi possível checar versão, resposta nula");
                return;
            }

            int respcode = resposta[0].status;
            String text = resposta[0].texto;

            boolean respok = respcode >= 200 && respcode <= 299;
            if (!respok) {
                Log.e("VERSIONCHECKER", "Não foi possível checar versão, HTTP resp code:" + respcode);
                return;
            }

            JSONObject obj = null;
            try {
                obj = new JSONObject(text);
            } catch (JSONException e) {
                e.printStackTrace();
            }

            if (obj == null) {
                Log.e("VERSIONCHECKER", "Não foi possível checar versão, erro ao decodificar json:" + text);
                return;
            }

            if (!processarJsonVersao(obj)) {
                Log.e("VERSIONCHECKER", "Não foi possível checar versão, erro ao processar json:" + text);
                return;
            }
        });
        conn.execute(new HttpGetTask.TaskText(endereco));
    }

    public boolean processarJsonVersao(JSONObject resposta)
    {
        if(resposta == null) return false;
        if(!resposta.has("version")) return false;

        try {
            //String respVersion = "A";

            if(resposta.has("web_app_version") && resposta.has("web_app_files")) {
                int web_app_version = resposta.getInt("web_app_version");
                if(web_app_version > versaoWeb)
                {
                    Log.d("VERSIONCHECKER","Detectado nova versão do webapp, Baixando...");
                    WebAppUpdater updater = new WebAppUpdater(Inicio.getIndex(),resposta.getJSONArray("web_app_files"),versaoWeb,web_app_version,context);
                    updater.executar();
                }
                else
                {
                    Log.d("VERSIONCHECKER","WebApp Já está atualizado:"+versaoWeb);
                }
            }

            String respVersion = resposta.getString("version");
            if(!respVersion.equals(versaoApp))
            {
                //Utilidades.msgpopup(this,"Atualize seu aplicativo, há uma versão nova para download");
                JanelaHelper.AbrirJanelaAplicativoDesatualizado(context,versaoApp,respVersion);
            }
            else
            {
                Log.d("VersionChecker", "App já está na última versão:"+respVersion);
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }



}
