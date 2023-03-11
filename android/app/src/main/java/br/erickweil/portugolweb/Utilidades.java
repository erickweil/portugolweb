package br.erickweil.portugolweb;

import android.content.Context;
import android.util.Log;

import org.json.JSONArray;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.Map;
import java.util.Random;
import java.util.TimeZone;


public class Utilidades {
    // faz um POST a um site usando protocolo HTTP, retorna a resposta do site como texto
    public static String httpPost(String endereco, Map<String,String> arguments) throws IOException {
        return httpPost(endereco,arguments,-1,-1);
    }

    public static String httpPost(String endereco, Map<String,String> arguments,int connectTimeout,int readTimeout) throws IOException {

        String reqline = "";
        for (Map.Entry<String, String> entry : arguments.entrySet()) {
            reqline += URLEncoder.encode(entry.getKey(), "UTF-8") + "=" + URLEncoder.encode(entry.getValue(), "UTF-8");
            reqline += "&";
        }
        reqline = reqline.substring(0, reqline.length() - 1);

        Log.d("Utilidades.httpPost", reqline.substring(0,Math.min(reqline.length(),100)));
        //String reqline = "email="+URLEncoder.encode(email, "UTF-8")+ "&senha=" + URLEncoder.encode(senha, "UTF-8");

        byte[] out = reqline.getBytes(Charset.forName("UTF-8"));
        int length = out.length;

        URL url = new URL(endereco);
        URLConnection con = url.openConnection();
        HttpURLConnection http = (HttpURLConnection) con;
        if(connectTimeout > 0) http.setConnectTimeout(connectTimeout);
        if(readTimeout > 0) http.setReadTimeout(readTimeout);

        Log.d("Utilidades.httpPost", "timeouts --> conn:"+http.getConnectTimeout()+", read:"+http.getReadTimeout());

        http.setRequestMethod("POST"); // PUT is another valid option
        http.setDoOutput(true);

        http.setFixedLengthStreamingMode(length);
        http.setRequestProperty("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");

        http.connect();
        OutputStream os = http.getOutputStream();

        os.write(out);
        os.flush();

        os.close();


        BufferedReader input = new BufferedReader(new InputStreamReader(http.getInputStream(), Charset.forName("UTF-8")));

        StringBuilder content = new StringBuilder();
        for (String s = input.readLine(); s != null && !s.isEmpty(); s = input.readLine()) {
            //Log.i("Utilidades.httpPost", "READING -> '" + s + "'");
            content.append(s);
            content.append("\n");
        }

        return content.toString();
    }

    /** Lê o texto de uma input stream (codificado como utf-8)<BR/>
     *  A input stream NÃO É FECHADA! <BR/>
     *  ATENÇÃO ESTE MÉTODO CONVERTE AS QUEBRAS DE LINHA PARA '\n' <BR/>
     */
    public static String readAllText(InputStream stream) throws IOException {
        BufferedReader input = new BufferedReader(new InputStreamReader(stream, StandardCharsets.UTF_8));

        StringBuilder content = new StringBuilder();
        for (String s = input.readLine(); s != null; s = input.readLine()) {
            //Log.i("Utilidades.httpPost", "READING -> '" + s + "'");
            content.append(s);
            content.append("\n");
        }
        String contentText = content.toString();

        return contentText;
    }

    /** Lê bytes de uma input stream, indique -1 no tamanho para ler até achar o fim <BR/>
     *  A input stream NÃO É FECHADA! <BR/>
     *  Utilize file.length() para determinar o tamanho que deverá ler
     *
     *  Exemplo de chamada: readAllBytes(new FileInputStream(file),(int)file.size())
     */
    public static byte[] readAllBytes(InputStream stream,int size) throws IOException {
        if(size > 0) {
            byte[] bytes = new byte[size];

            BufferedInputStream buf = new BufferedInputStream(stream);
            buf.read(bytes, 0, bytes.length);
            return bytes;
        } else {
            ByteArrayOutputStream output = new ByteArrayOutputStream(8192);
            byte[] buffer = new byte[8192];
            int read;

            while ((read = stream.read(buffer)) > 0) {
                output.write(buffer, 0, read);
            }

            return output.toByteArray();
        }
    }

    public static class GetResp {
        int status;
        InputStream stream;
        boolean fechouStream;

        public GetResp(int status,InputStream stream) {
            this.status = status;
            this.stream = stream;
            this.fechouStream = false;
        }

        public String getText() throws IOException {
            String contentText = readAllText(stream);

            closeStream();

            return contentText;
        }

        // Copy an InputStream to a File.
        // https://stackoverflow.com/questions/10854211/android-store-inputstream-in-file
        public long saveToFile(File file) {
            OutputStream out = null;
            long byteswrited = 0;
            try {
                if(!file.exists())
                    file.createNewFile();

                out = new FileOutputStream(file);
                byte[] buf = new byte[1024];
                int len;

                while((len=stream.read(buf))>0){
                    out.write(buf,0,len);
                    byteswrited += len;
                }
                return byteswrited;
            }
            catch (Exception e) {
                e.printStackTrace();
                return byteswrited;
            }
            finally {
                // Ensure that the InputStreams are closed even if there's an exception.
                try {
                    if ( out != null ) {
                        out.close();
                    }

                    // If you want to close the "in" InputStream yourself then remove this
                    // from here but ensure that you close it yourself eventually.
                    closeStream();
                }
                catch ( IOException e ) {
                    e.printStackTrace();
                }
            }
        }

        public void closeStream() {
            if(this.fechouStream) return;
            try {
                // If you want to close the "in" InputStream yourself then remove this
                // from here but ensure that you close it yourself eventually.
                if(stream != null)
                    stream.close();

                this.fechouStream = true;
            }
            catch ( IOException e ) {
                e.printStackTrace();
            }
        }
    }

    /**
     * LEMBRAR DE CHAMAR CLOSESTREAM SE NÃO FOR LER OS DADOS!!
    * */
    public static GetResp httpGet(String endereco,int connectTimeout,int readTimeout) throws IOException {
        Log.d("Utilidades.httpGET", "endereco:"+endereco);

        URL url = new URL(endereco);
        URLConnection con = url.openConnection();
        HttpURLConnection http = (HttpURLConnection) con;
        if(connectTimeout > 0) http.setConnectTimeout(connectTimeout);
        if(readTimeout > 0) http.setReadTimeout(readTimeout);


        http.setRequestMethod("GET"); // PUT is another valid option
        http.addRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.95 Safari/537.11");
        http.setRequestProperty("Accept","*/*");
        // NÃO PODE SER TRUE https://stackoverflow.com/questions/16255823/httpurlconnection-java-io-filenotfoundexception/17619519
        //http.setDoOutput(true);

        //http.setFixedLengthStreamingMode(length);
        //http.setRequestProperty("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");

        http.connect();
        //OutputStream os = http.getOutputStream();
        //os.write(out);
        //os.flush();
        //os.close();

        int respCode = http.getResponseCode();
        Log.i("Utilidades.httpPost", "RESP CODE -> '" + respCode + "'");

        InputStream respStream;

        if(respCode >= 400)
        {
            respStream = http.getErrorStream();
        }
        else
        {
            respStream = http.getInputStream();
        }

        return new GetResp(respCode,respStream);
    }

    public static String escapeText(String text)
    {
        StringBuilder result = new StringBuilder();
        text = text.replace("\r\n","\n");
        String[] lines = text.split("\n");
        for(int i=0;i<lines.length;i++)
        {
            String line = lines[i];
            line = line.replace("\\","\\\\");
            line = line.replace("\"","\\\"");
            //line = line.replace("\n","\\n");
            line = line.replace("\t","\\t");
            result.append(line);
            result.append("\\n");
        }

        return result.toString();
    }

    public static long UTCMillis_FromDate(Date date) throws ParseException {
        String ddMMyyyy = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault()).format(date);

        DateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault());
        simpleDateFormat.setTimeZone(TimeZone.getTimeZone("GMT"));

        return simpleDateFormat.parse(ddMMyyyy).getTime();
    }

    public static String randomString(String alphabet,int length) {
        Random random = new Random();
        StringBuilder buffer = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            int ch = random.nextInt(alphabet.length());
            buffer.append(alphabet.charAt(ch));
        }
        String generatedString = buffer.toString();

        return generatedString;
    }
    public static File getCacheDir(Context ctx)
    {
        File dir = null;
        try {
            dir = ctx.getExternalCacheDir();
            if (dir == null)
                dir = ctx.getCacheDir();
            if (dir == null)
                dir = ctx.getFilesDir();
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
        return  dir;
    }

    public static void saveJsonOnCache(File cacheDir, String name, JSONArray object) {
        try {
            File data = new File(cacheDir, name+".json");
            if (!data.createNewFile()) {
                data.delete();
                data.createNewFile();
            }
            BufferedWriter bw = new BufferedWriter(new FileWriter(data));

            bw.write(object.toString());
            bw.flush();
            bw.close();

            Log.d("UTILIDADES","Salvou "+name+" no Cache:"+object.length()+" linhas "+data.length()+" bytes");
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
    }

    public static JSONArray loadJsonFromCache(File cacheDir, String name){
        JSONArray object = null;
        try {
            File data = new File(cacheDir,name+".json");
            if(data.exists()) {
                FileReader fReader = new FileReader(data);
                BufferedReader bReader = new BufferedReader(fReader);

                /** Reading the contents of the file , line by line */
                StringBuilder text = new StringBuilder();
                String strLine = null;
                while( (strLine=bReader.readLine()) != null  ){
                    text.append(strLine);
                    text.append("\n");
                }
                //Log.d("UTILIDADES",text.toString());
                object = new JSONArray(text.toString());
                Log.d("UTILIDADES","Carregou "+name+" do Cache:"+object.length()+" linhas "+data.length()+" bytes");
            }
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
        return object;
    }
    /**
     * Convert byte array to hex string
     * @param bytes toConvert
     * @return hexValue
     */
    public static String bytesToHex(byte[] bytes) {
        StringBuilder sbuf = new StringBuilder();
        for(int idx=0; idx < bytes.length; idx++) {
            int intVal = bytes[idx] & 0xff;
            if (intVal < 0x10) sbuf.append("0");
            sbuf.append(Integer.toHexString(intVal).toUpperCase());
        }
        return sbuf.toString();
    }

    /**
     * Get utf8 byte array.
     * @param str which to be converted
     * @return  array of NULL if error was found
     */
    public static byte[] getUTF8Bytes(String str) {
        try { return str.getBytes("UTF-8"); } catch (Exception ex) { return null; }
    }

}
