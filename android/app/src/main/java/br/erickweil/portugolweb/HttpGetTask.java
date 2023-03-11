package br.erickweil.portugolweb;

import android.os.AsyncTask;
import android.text.TextUtils;
import android.util.Log;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.nio.charset.StandardCharsets;

public class HttpGetTask<T extends HttpGetTask.TaskStatus> extends AsyncTask<T,Integer, T[]> {
    public static final int SEND_RETRY = 3;

    public int CONNECT_TIMEOUT;
    public int READ_TIMEOUT;

    /**
     * Task base. falha se houver erro, como timeouts e conexão interrompida.
     * NÃO FALHA EM CÓDIGOS HTTP, DÁ SUCESSO MESMO EM HTTP 3XX, 4XX, 5XX ETC...
     *
     * Só pode ser a primeira Task
     */
    public static class TaskStatus {
        String endereco;
        TaskStatus next;

        private TaskStatus(){
            this.acao_sucesso = false;
        }

        public TaskStatus(String endereco){
            this.endereco = endereco;
            this.acao_sucesso = false;
        }

        /**
         * Agenda a próxima tarefa a ser executada ainda em background
         * Após esta tarefa ter sido completada e com sucesso.
         */
        public TaskStatus then(TaskStatus nextTask) {
            if(this.next == null)
                this.next = nextTask;
            else
                this.next.then(nextTask);

            return this;
        }

        int status;
        boolean acao_sucesso;
        public void execute(Utilidades.GetResp ret) throws IOException {
            ret.closeStream();
            acao_sucesso = true;
        }

        public void execute(TaskStatus prevTask) throws IOException {
            acao_sucesso = true;
        }
    }

    /**
     * Faz o download do arquivo
     *
     * Só pode ser a primeira Task
     */
    public static class TaskDownloadFile extends TaskStatus {
        File arquivo;
        public TaskDownloadFile(String endereco, File arquivo) {
            super(endereco);
            this.arquivo = arquivo;
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
        }
    }

    /**
     * Verifica o hash md5 do arquivo
     *
     * Pode ser chamado após uma TaskDownloadFile
     */
    public static class TaskCheckMD5 extends TaskStatus {
        String md5_original;
        String md5_calculated;
        public TaskCheckMD5(String md5) {
            this.md5_original = md5;
        }

        @Override
        public void execute(TaskStatus prev) throws IOException {
            if(!(prev instanceof TaskDownloadFile))
                throw new IOException("Só pode executar TaskCheckMD5 após uma task DownloadFile");
            TaskDownloadFile tprev = (TaskDownloadFile) prev;
            File arquivo = tprev.arquivo;

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

    /**
     * Retorna como texto.
     *
     * Pode ser a primeira Task
     * Pode ser chamado após uma TaskDownloadFile
     */
    public static class TaskText extends TaskStatus {
        String texto;
        public TaskText(String endereco)
        {
            super(endereco);
        }

        public void execute(Utilidades.GetResp ret) throws IOException {
            texto = ret.getText();
            acao_sucesso = texto != null;
            if(!acao_sucesso) {
                Log.e("GETTASK", "Texto nulo.");
                return;
            }
        }

        public void execute(TaskStatus prev) throws IOException {
            if(!(prev instanceof TaskDownloadFile))
                throw new IOException("Só pode executar TaskText após uma task DownloadFile");

            TaskDownloadFile tprev = (TaskDownloadFile) prev;
            File arquivo = tprev.arquivo;
            FileInputStream fin = new FileInputStream(arquivo);

            texto = Utilidades.readAllText(fin);
            fin.close();

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
                TaskStatus taskNow = t;
                TaskStatus taskNext = t.next;
                while(taskNow.acao_sucesso && taskNext != null){
                    taskNext.execute(taskNow);

                    taskNow = taskNext;
                    taskNext = taskNow.next;
                }
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