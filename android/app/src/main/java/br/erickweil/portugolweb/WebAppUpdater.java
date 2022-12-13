package br.erickweil.portugolweb;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

public class WebAppUpdater {
    public static final int READ_TIMEOUT = 60000;
    private final JSONArray web_app_files;
    private final int web_app_version;
    private final String updateUrl;
    private final int old_version;

    private Activity context;
    public WebAppUpdater(String updateUrl,JSONArray web_app_files,int old_version, int web_app_version, Activity context)
    {
        this.updateUrl = updateUrl;
        this.web_app_files = web_app_files;
        this.old_version = old_version;
        this.web_app_version = web_app_version;
        this.context = context;
    }

    public void registrarAppCacheNasPrefs(File filesDir){
        Log.i("UPDATER","ATUALIZANDO CACHE DAS PREFS");
        SharedPreferences preferences = Inicio.getPrefs(context);

        SharedPreferences.Editor prefsEdit = preferences.edit();

        String path_cache = filesDir.toURI().toString();

        prefsEdit.putInt("web_app_version",web_app_version);
        prefsEdit.putString("web_app_cache",path_cache);

        Log.i("UPDATER","VERSÃO:"+web_app_version+" PATH:"+path_cache);
        prefsEdit.apply();// commit??
    }


    public void invalidarPrefsCache(){
        Log.e("INICIO","INVALIDANDO O CACHE DAS PREFS");
        SharedPreferences preferences = Inicio.getPrefs(context);

        SharedPreferences.Editor prefsEdit = preferences.edit();

        prefsEdit.putInt("web_app_version",0);
        prefsEdit.putString("web_app_cache",null);

        prefsEdit.apply();// commit??
    }

    public void executar() {
        // https://stackoverflow.com/questions/54996665/how-to-save-downloaded-file-in-internal-storage-in-android-studio
        final File filesDir = new File(context.getFilesDir(),"portugolweb");
        if(!filesDir.exists()){
            filesDir.mkdir();
        }
        final HttpGetTask.TaskDownloadFile[] tasks = new HttpGetTask.TaskDownloadFile[web_app_files.length()];
        try {
            for(int i=0;i<web_app_files.length();i++)
            {
                JSONObject fileEntry = web_app_files.getJSONObject(i);
                String md5 = null;

                if(!fileEntry.has("file"))
                    throw new JSONException("Json deveria ter a chave 'file'");

                // pode ser nulo, irá pular a verificação.
                if(fileEntry.has("md5"))
                    md5 = fileEntry.getString("md5");

                String fileName = fileEntry.getString("file");

                String endereco = updateUrl+fileName;
                File dest = new File(filesDir,fileName);

                File parent = dest.getParentFile();
                if(parent != null)
                    parent.mkdirs();

                tasks[i] = new HttpGetTask.TaskDownloadFile(
                    endereco, dest, md5
                );
            }
        } catch (JSONException e) {
            e.printStackTrace();
            Log.e("UPDATER","Não foi possível atualizar, erro ao iniciar as tarefas. json malformado");
            return;
        }

        HttpGetTask<HttpGetTask.TaskDownloadFile> conn = new HttpGetTask<>(READ_TIMEOUT, resposta -> {
                onDownloadFinished(filesDir,resposta);
            }
        );
        conn.execute(tasks);
    }

    public void onDownloadFinished(File filesDir,HttpGetTask.TaskDownloadFile[] resposta) {
        if(resposta == null || resposta.length == 0)
        {
            Log.e("UPDATER","Não foi possível atualizar, erro no download");
            return;
        }

        int falhas = 0;
        for(int i=0;i<resposta.length;i++) {
            HttpGetTask.TaskDownloadFile t = resposta[i];
            // Se QUALQUER UM tiver falhado, não foi um sucesso.
            if(!t.acao_sucesso) {
                falhas++;
            }
        }

        if(falhas == 0)
        {
            onSucessoAtualizacao(filesDir);
        }
        else {
            Log.e("UPDATER","FALHOU NO DOWNLOAD DE "+falhas+" ARQUIVOS! VAI TENTAR NOVAMENTE QUANDO ABRIR O APP");
            invalidarPrefsCache();
        }
    }

    public void onSucessoAtualizacao(File filesDir)
    {
        registrarAppCacheNasPrefs(filesDir);
        Log.i("UPDATER","ATUALIZADO CACHE DAS PREFS COM SUCESSO!");
        JanelaHelper.abrirJanelaAtualizaoComSucesso(context,old_version,web_app_version);
    }

    /**
     * VERIFICAR INTEGRIDADE, AO INICIAR O APP E JÁ ESTIVER NA ÚLTIMA VERSÃO
     *
     * Só será executado se tiver internet e já estiver na última versão
     * Ou se não tiver internet.
     *
     * A ideia garantir que o web app esteja como deveria estar
     */
    public void doIntegrityCheck(File filesDir) {
        final List<CheckMD5Task.FileHashEntry> tasks = new ArrayList<CheckMD5Task.FileHashEntry>();
        try {
            for(int i=0;i<web_app_files.length();i++) {
                JSONObject fileEntry = web_app_files.getJSONObject(i);

                if(!fileEntry.has("file"))
                    throw new JSONException("Json deveria ter a chave 'file'");

                if(!fileEntry.has("md5"))
                    continue;

                String fileName = fileEntry.getString("file");
                String md5 = fileEntry.getString("md5");

                File dest = new File(filesDir,fileName);

                tasks.add(new CheckMD5Task.FileHashEntry(
                        dest, md5
                ));
            }
        } catch (JSONException e) {
            e.printStackTrace();
            Log.e("UPDATER","NÃO É POSSÍVEL VERIFICAR INTEGRIDADE. JSON MALFORMADO");
            return;
        }

        CheckMD5Task conn = new CheckMD5Task(resposta -> onHashCheckCompleted(filesDir,resposta));

        if(tasks.size() == 0)
        {
            Log.w("UPDATER","NÃO É POSSÍVEL VERIFICAR INTEGRIDADE POIS NÃO HÁ HASH MD5 NO JSON");
            onSucessoAtualizacao(filesDir);
        }

        CheckMD5Task.FileHashEntry[] tasks_arr = new CheckMD5Task.FileHashEntry[tasks.size()];
        tasks_arr = tasks.toArray(tasks_arr);
        conn.execute(tasks_arr);
    }

    public void onHashCheckCompleted(File filesDir,CheckMD5Task.FileHashEntry[] resposta) {
        if(resposta == null || resposta.length == 0)
        {
            Log.e("UPDATER","Não foi possível atualizar, erro ao checar hash");
            return;
        }

        int falhas = 0;
        for(int i=0;i<resposta.length;i++) {
            CheckMD5Task.FileHashEntry t = resposta[i];
            if(t == null) continue;
            // Se QUALQUER UM tiver falhado, não foi um sucesso.
            if(!t.sucess) {
                falhas++;
            }
        }
        if(falhas == 0) {
            // OK
        }
        else {
            Log.e("UPDATER","FALHOU NA CHECAGEM DA INTEGRIDADE DE "+falhas+" ARQUIVOS! VAI TENTAR NOVAMENTE QUANDO ABRIR O APP");
            invalidarPrefsCache();
        }
    }
}
