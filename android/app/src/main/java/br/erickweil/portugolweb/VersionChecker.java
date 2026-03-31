package br.erickweil.portugolweb;

import android.app.Activity;
import android.content.Context;
import android.util.Log;


import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;


public class VersionChecker {
    // https://stackoverflow.com/questions/198431/how-do-you-compare-two-version-strings-in-java?page=1&tab=scoredesc#tab-top
    public static class Version implements Comparable<Version> {

        private String version;

        public final String get() {
            return this.version;
        }

        public Version(String version) {
            if(version == null)
                throw new IllegalArgumentException("Version can not be null");
            if(!version.matches("[0-9]+(\\.[0-9]+)*"))
                throw new IllegalArgumentException("Invalid version format");
            this.version = version;
        }

        @Override public int compareTo(Version that) {
            if(that == null)
                return 1;
            String[] thisParts = this.get().split("\\.");
            String[] thatParts = that.get().split("\\.");
            int length = Math.max(thisParts.length, thatParts.length);
            for(int i = 0; i < length; i++) {
                int thisPart = i < thisParts.length ?
                        Integer.parseInt(thisParts[i]) : 0;
                int thatPart = i < thatParts.length ?
                        Integer.parseInt(thatParts[i]) : 0;
                if(thisPart < thatPart)
                    return -1;
                if(thisPart > thatPart)
                    return 1;
            }
            return 0;
        }

        @Override public boolean equals(Object that) {
            if(this == that)
                return true;
            if(that == null)
                return false;
            if(this.getClass() != that.getClass())
                return false;
            return this.compareTo((Version) that) == 0;
        }

    }

    public static final int READ_TIMEOUT = 30000;
    public static final int VERSAO_ASSETS_WEBAPP = 4; // Versão do webapp incluso no apk nos assets

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

    public static File getVersionFile(Context ctx) {
        return new File(ctx.getFilesDir(),"version.json");
    }

    public void executar() {
        Log.d("VERSIONCHECKER","Iniciando checagem de versão...");

        HttpGetTask<HttpGetTask.TaskText> conn = new HttpGetTask<>(READ_TIMEOUT, resposta -> {
            if(resposta == null || resposta.length == 0 || resposta[0] == null || !resposta[0].acao_sucesso)
            {
                Log.e("VERSIONCHECKER","Não foi possível checar versão, resposta nula");
                return;
            }

            String text = resposta[0].texto;
            JSONObject obj = null;
            try {
                obj = new JSONObject(text);
            } catch (JSONException e) {
                Log.e("VERSIONCHECKER", "Erro: " + e, e);
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
            String respVersion = resposta.getString("version");
            // Compara mesmo as versões, não reclamando de estar em uma versão MAIS NOVA
            Version versaoAtual = new Version(versaoApp);
            Version versaoResposta = new Version(respVersion);
            if(versaoAtual.compareTo(versaoResposta) < 0)
            {
                JanelaHelper.AbrirJanelaAplicativoDesatualizado(context,versaoApp,respVersion);
            }
            else
            {
                Log.d("VERSIONCHECKER", "App já está na última versão, atual:"+versaoApp+", encontrada:"+respVersion);

                // SÓ VAI TENTAR ATUALIZAR WEB APP SE ESTIVER NA ÚLTIMA VERSÃO DO APP
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
                        Log.d("VERSIONCHECKER","WebApp Já está atualizado! Versão, atual:"+versaoWeb+", encontrada:"+web_app_version);
                    }
                }
            }
            return true;
        } catch (Exception e) {
            Log.e("VERSIONCHECKER", "Erro: " + e, e);
            return false;
        }
    }



}
