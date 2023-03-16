package br.erickweil.portugolweb;

import android.app.Activity;
import android.content.Context;
import android.util.Log;


import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
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

    /*
    DESATIVADO CHECAGEM MD5 A CADA ACESSO, ISTO CAUSA MAIS PROBLEMAS DO QUE RESOLVE
    LOOPS INFINITOS DE CRASH, ERROS NO MEIO DA ATUALIZAÇÃO POR MD5 DIFERENTE
    UTILIZAÇÃO DE PROCESSAMENTO E MEMÓRIA DESNECESSÁRIO, ETC...

    PORQUE VERIFICAR A INTEGRIDADE DE CADA ARQUIVO AO ACESSÁLO NO DISCO
    SE AO ATUALIZAR O APP JÁ É FEITA ESSA VERIFICAÇÃO?

    NÃO BASTA VERIFICAR QUE O ARQUIVO EXISTE? QUAL O PROBLEMA QUE PODE ACONTECER?

    CONTINUARÁ CONFIANDO QUE SE O ARQUIVO DO CACHE EXISTE ELE ESTÁ COMO SEMPRE ESTEVE
    A VERIFICAÇÃO MD5 SÓ ACONTECE NO ATO DO DOWNLOAD.


    // SINGLETON PARA IMPEDIR LEITURAS NO DISCO DESNECESSÁRIAS E TAMBÉM SINCRONIZAR ACESSO A ESTE ARQUIVO
    public static JSONObject versionJson;


    // NÃO DEVERIA SER CHAMADO NA UI THREAD POIS PODE SER QUE LEIA DO DISCO
    public static synchronized JSONObject getVersionJson(Context ctx) {
        if(versionJson != null) return versionJson;

        try {
            File versonFile = getVersionFile(ctx);
            if (!versonFile.exists()) return null;

            FileInputStream fin = new FileInputStream(versonFile);

            String jsonReaded = Utilidades.readAllText(fin);
            fin.close();

            JSONObject obj = null;
            try {
                obj = new JSONObject(jsonReaded);
            } catch (JSONException e) {
                e.printStackTrace();
            }

            versionJson = obj;

            return versionJson;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private static synchronized void updateVersionJson(JSONObject obj) {
        versionJson = obj;
    }

     //Retorna falso se falhar a checagem md5
    public static boolean doFileIntegrityCheck(byte[] file, String fileNamePath, JSONObject versionJson) {
        try {
            JSONArray files = versionJson.getJSONArray("web_app_files");
            for(int i=0;i<files.length();i++) {
                JSONObject fileEntry = files.getJSONObject(i);

                if (!fileEntry.has("file"))
                    throw new JSONException("Json deveria ter a chave 'file' ");

                String jsonFile = fileEntry.getString("file");
                if(!fileNamePath.endsWith(jsonFile)) continue;

                // pode ser nulo, irá pular a verificação.
                if (!fileEntry.has("md5"))
                    return true;

                String md5 = fileEntry.getString("md5");
                String file_md5 = CheckMD5Task.calculateMD5(new ByteArrayInputStream(file));

                if(md5.equals(file_md5)){
                    Log.d("VERSIONCHECKER",jsonFile+" "+md5+" == "+file_md5);
                    return  true;
                }
                else
                {
                    Log.e("VERSIONCHECKER",jsonFile+" "+md5+" != "+file_md5);
                    return false;
                }
            }

            Log.d("VERSIONCHECKER","Arquivo "+fileNamePath+" não estava na lista de arquivos para verificar integridade");
            return true;
        }
        catch (JSONException e) {
            e.printStackTrace();
            return true;
        }

    }
    */

    public void executar() {
        Log.d("VERSIONCHECKER","Iniciando checagem de versão...");

        HttpGetTask<HttpGetTask.TaskText> conn = new HttpGetTask<>(READ_TIMEOUT, resposta -> {
            if(resposta == null || resposta.length == 0 || resposta[0] == null || !resposta[0].acao_sucesso)
            {
                Log.e("VERSIONCHECKER","Não foi possível checar versão, resposta nula");
                return;
            }

            //HttpGetTask.TaskDownloadFile t0 = (HttpGetTask.TaskDownloadFile) resposta[0];

            //int respcode = t0.status;
            //boolean respok = respcode >= 200 && respcode <= 299;
            //if (!respok) {
            //    Log.e("VERSIONCHECKER", "Não foi possível checar versão, HTTP resp code:" + respcode);
            //    return;
            //}

            //HttpGetTask.TaskText task_texto = (HttpGetTask.TaskText) t0.next;

            //if(task_texto == null || !task_texto.acao_sucesso)
            //{
            //    Log.e("VERSIONCHECKER","Não foi possível checar versão, erro ao ler o texto");
            //    return;
            //}

            //String text = task_texto.texto;
            String text = resposta[0].texto;
            JSONObject obj = null;
            try {
                obj = new JSONObject(text);
            } catch (JSONException e) {
                e.printStackTrace();
            }
            // Atualiza o cache singleton
            //updateVersionJson(obj);

            if (obj == null) {
                Log.e("VERSIONCHECKER", "Não foi possível checar versão, erro ao decodificar json:" + text);
                return;
            }

            if (!processarJsonVersao(obj)) {
                Log.e("VERSIONCHECKER", "Não foi possível checar versão, erro ao processar json:" + text);
                return;
            }
        });
        final File versionFilePath = getVersionFile(context);
        conn.execute(
         //       new HttpGetTask.TaskDownloadFile(endereco,versionFilePath).then(
                // não precisa salvar o arquivo
                new HttpGetTask.TaskText(endereco)
        );
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
                    Log.d("VERSIONCHECKER","WebApp Já está atualizado! Versão, atual:"+versaoWeb+", encontrada:"+web_app_version);
                }
            }

            String respVersion = resposta.getString("version");
            //if(!respVersion.equals(versaoApp))

            // Compara mesmo as versões, não reclamando de estar em uma versão MAIS NOVA
            Version versaoAtual = new Version(versaoApp);
            Version versaoResposta = new Version(respVersion);
            if(versaoAtual.compareTo(versaoResposta) < 0)
            {
                //Utilidades.msgpopup(this,"Atualize seu aplicativo, há uma versão nova para download");
                JanelaHelper.AbrirJanelaAplicativoDesatualizado(context,versaoApp,respVersion);
            }
            else
            {
                Log.d("VersionChecker", "App já está na última versão, atual:"+versaoApp+", encontrada:"+respVersion);
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }



}
