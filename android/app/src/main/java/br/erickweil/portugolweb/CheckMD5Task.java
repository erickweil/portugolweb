package br.erickweil.portugolweb;


import android.os.AsyncTask;
import android.text.TextUtils;
import android.util.Log;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.ByteOrder;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class CheckMD5Task extends AsyncTask<CheckMD5Task.FileHashEntry,Integer, CheckMD5Task.FileHashEntry[]> {
    private static final String TAG = "MD5";

    public static class FileHashEntry {
        File file;
        String md5_original;

        public FileHashEntry(File f, String m){
            this.file = f;
            this.md5_original =m;
            this.sucess = false;
        }


        String md5_calculated;
        boolean sucess;
    }

    public interface CheckMd5Callback{
        void resposta(CheckMD5Task.FileHashEntry[] resposta);
    }

    private CheckMd5Callback onResponse;

    public CheckMD5Task(CheckMd5Callback callback) {
        this.onResponse = callback;
    }

    @Override
    protected FileHashEntry[] doInBackground(FileHashEntry... tasks) {

        for (int i = 0; i < tasks.length; i++) {
            FileHashEntry t = tasks[i];
            if(t == null) continue;

            try {
                t.sucess = checkMD5(t);
            }
            catch (Exception e) {
                e.printStackTrace();
                t.sucess = false;
            }
        }

        return tasks;
    }

    @Override
    protected void onPostExecute(FileHashEntry[] fileHashEntries) {
        super.onPostExecute(fileHashEntries);
    }

    public static boolean checkMD5(FileHashEntry t) {
        String md5 = t.md5_original;
        File updateFile = t.file;
        if (TextUtils.isEmpty(md5) || updateFile == null) {
            Log.e(TAG, "MD5 string empty or updateFile null");
            return false;
        }

        String calculatedDigest = calculateMD5(updateFile);
        if (calculatedDigest == null) {
            Log.e(TAG, "calculatedDigest null");
            return false;
        }

        Log.v(TAG, "Calculated digest: " + calculatedDigest);
        Log.v(TAG, "Provided digest: " + md5);
        t.md5_calculated = calculatedDigest;
        return calculatedDigest.equalsIgnoreCase(md5);
    }

    public static String calculateMD5(File updateFile) {
        InputStream is;
        try {
            is = new FileInputStream(updateFile);
        } catch (FileNotFoundException e) {
            Log.e(TAG, "Exception while getting FileInputStream", e);
            return null;
        }

        return calculateMD5(is);
    }

    public static String calculateMD5(InputStream is) {
        MessageDigest digest;
        try {
            digest = MessageDigest.getInstance("MD5");
        } catch (NoSuchAlgorithmException e) {
            Log.e(TAG, "Exception while getting digest", e);
            return null;
        }

        byte[] buffer = new byte[8192];
        int read;
        try {
            while ((read = is.read(buffer)) > 0) {
                digest.update(buffer, 0, read);
            }
            byte[] md5sum = digest.digest();
            //BigInteger bigInt = new BigInteger(1, md5sum);
            //String output = bigInt.toString(16);
            // Fill to 32 chars
            //output = String.format("%32s", output).replace(' ', '0');
            return encodeHex(md5sum);
        } catch (IOException e) {
            throw new RuntimeException("Unable to process file for MD5", e);
        } finally {
            try {
                is.close();
            } catch (IOException e) {
                Log.e(TAG, "Exception on closing MD5 input stream", e);
            }
        }
    }

    // https://stackoverflow.com/questions/9655181/how-to-convert-a-byte-array-to-a-hex-string-in-java
    private static final char[] LOOKUP_TABLE_LOWER = new char[]{0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66};
    private static final char[] LOOKUP_TABLE_UPPER = new char[]{0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x41, 0x42, 0x43, 0x44, 0x45, 0x46};

    public static String encodeHex(byte[] byteArray, boolean upperCase, ByteOrder byteOrder) {

        // our output size will be exactly 2x byte-array length
        final char[] buffer = new char[byteArray.length * 2];

        // choose lower or uppercase lookup table
        final char[] lookup = upperCase ? LOOKUP_TABLE_UPPER : LOOKUP_TABLE_LOWER;

        int index;
        for (int i = 0; i < byteArray.length; i++) {
            // for little endian we count from last to first
            index = (byteOrder == ByteOrder.BIG_ENDIAN) ? i : byteArray.length - i - 1;

            // extract the upper 4 bit and look up char (0-A)
            buffer[i << 1] = lookup[(byteArray[index] >> 4) & 0xF];
            // extract the lower 4 bit and look up char (0-A)
            buffer[(i << 1) + 1] = lookup[(byteArray[index] & 0xF)];
        }
        return new String(buffer);
    }

    public static String encodeHex(byte[] byteArray) {
        return encodeHex(byteArray, false, ByteOrder.BIG_ENDIAN);
    }
}