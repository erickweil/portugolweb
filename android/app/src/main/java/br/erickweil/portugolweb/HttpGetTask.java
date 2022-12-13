package br.erickweil.portugolweb;

import android.os.AsyncTask;
import android.text.TextUtils;
import android.util.Log;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.nio.charset.StandardCharsets;

public class HttpGetTask<T extends HttpGetTask.TaskStatus> extends AsyncTask<T,Integer, T[]> {
    public static final int SEND_RETRY = 3;

    public int CONNECT_TIMEOUT;
    public int READ_TIMEOUT;


    public static final int ACAO_NADA = 0;
    public static final int ACAO_DOWNLOAD_TEXTO = 1;
    public static final int ACAO_DOWNLOAD_BYTES = 2;
    public static final int ACAO_DOWNLOAD_ARQUIVO = 3;

    public static class TaskStatus {
        String endereco;
        int acao;

        private TaskStatus(String endereco,int acao){
            this.acao = acao;
            this.endereco = endereco;
            this.acao_sucesso = false;
        }

        public TaskStatus(String endereco)
        {
            this.acao = ACAO_NADA;
            this.endereco = endereco;
            this.acao_sucesso = false;
        }

        int status;
        boolean acao_sucesso;
        public void execute(Utilidades.GetResp ret) throws IOException {
            ret.closeStream();
            acao_sucesso = true;
        }
    }

    public static class TaskDownloadFile extends TaskStatus {
        File arquivo;
        String md5_original;
        String md5_calculated;
        public TaskDownloadFile(String endereco, File arquivo, String md5)
        {
            super(endereco,ACAO_DOWNLOAD_ARQUIVO);
            this.arquivo = arquivo;
            this.md5_original = md5;
        }

        public void execute(Utilidades.GetResp ret) throws IOException {
            if(ret.status != 200) {
                Log.e("GETTASK", "Status não é 200:"+ret.status);
                ret.closeStream();
                this.acao_sucesso = false;
                return;
            }
            Log.d("GETTASK", "Baixando arquivo... " + arquivo.toString());
            long byteswrited = ret.saveToFile(arquivo);
            acao_sucesso = arquivo.exists() && byteswrited > 0;
            if(!acao_sucesso) {
                Log.e("GETTASK", "Erro ao criar arquivo.");
                return;
            }

            if(md5_original != null && !TextUtils.isEmpty(md5_original))
            {
                md5_calculated = CheckMD5Task.calculateMD5(arquivo);
                if (md5_calculated == null) {
                    Log.e("GETTASK", "Erro ao calcular o hash.");
                    acao_sucesso = false;
                    return;
                }

                acao_sucesso = md5_calculated.equalsIgnoreCase(md5_original);
                if(acao_sucesso)
                    Log.d("GETTASK", md5_original+" == " + md5_calculated+".");
                else
                    Log.e("GETTASK", md5_original+" != " + md5_calculated+" <-- HASH DIFERENTE");
            }


        }
    }

    public static class TaskText extends TaskStatus {
        String texto;
        public TaskText(String endereco)
        {
            super(endereco,ACAO_DOWNLOAD_TEXTO);
        }

        public void execute(Utilidades.GetResp ret) throws IOException {
            texto = ret.getText();
            acao_sucesso = texto != null;
            if(!acao_sucesso) {
                Log.e("GETTASK", "Texto nulo.");
                return;
            }
        }
    }


    public static interface HttpGetResposta<T>{
        public void resposta(T[] resposta);
    }

    private HttpGetResposta<T> onResponse;

    public HttpGetTask(int timeout, HttpGetResposta<T> onResponse) {
        this.CONNECT_TIMEOUT = timeout/3;
        this.READ_TIMEOUT = timeout;

        this.onResponse = onResponse;
    }


    @Override
    protected T[] doInBackground(T... tasks) {

        for (int i = 0; i < tasks.length; i++) {
            HttpGetTask.TaskStatus t = tasks[i];
            String endereco = t.endereco;
            if(endereco == null)
            {
                Log.e("GETTASK","Endereço nulo...");
                continue;
            }
            Utilidades.GetResp ret = null;
            for (int k = 0; k < SEND_RETRY; k++) {
                Utilidades.GetResp resp = trySendMsg(endereco, k);
                if (resp != null) {
                    ret = resp;
                    break;
                }
            }
            try {
                t.status = ret.status;
                t.execute(ret);
            } catch (Exception e) {
                e.printStackTrace();
                ret.closeStream();
                t.acao_sucesso = false;
            }
        }

        return tasks;
    }

    private Utilidades.GetResp trySendMsg(String endereco, int attempt) {
        String msg = null;
        try {

            int multiplier = (attempt + 1) * (attempt + 1);
            Utilidades.GetResp web_response = Utilidades.httpGet(endereco, CONNECT_TIMEOUT * multiplier, READ_TIMEOUT * multiplier);

            return web_response;
        } catch (MalformedURLException e) {
            e.printStackTrace();
            msg = "URL com problemas:" + e.getMessage();
        } catch (UnknownHostException e) // Sem Internet
        {
            e.printStackTrace();
            msg = "Não foi possível se conectar ao servidor:" + e.getMessage();
        } catch (SocketException e) // Caiu a Internet
        {
            e.printStackTrace();
            if (attempt + 1 < SEND_RETRY) return null;
            msg = "A conexão foi interrompida:" + e.getMessage();
        } catch (IOException e) { // Qualquer outro erro
            e.printStackTrace();
            if (attempt + 1 < SEND_RETRY) return null;
            msg = e.getMessage() + e.getCause();
            if (msg.startsWith("unexpected end of stream")) {
                msg = "Não houve resposta do servidor";
            }
        }

        return new Utilidades.GetResp(0,new ByteArrayInputStream(msg.getBytes(StandardCharsets.UTF_8)));
    }

    @Override
    protected void onPostExecute(T[] resposta) {
        try {
            onResponse.resposta(resposta);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}