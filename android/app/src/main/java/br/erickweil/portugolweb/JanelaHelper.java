package br.erickweil.portugolweb;

import android.app.Activity;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.util.Log;

import com.google.android.material.dialog.MaterialAlertDialogBuilder;

import java.util.Random;

public class JanelaHelper {
    public static void AbrirJanelaAplicativoDesatualizado(final Context context,String versaoApp, String respVersion) {
        MaterialAlertDialogBuilder builder = new MaterialAlertDialogBuilder(context);
        builder.setTitle(R.string.app_name);
        builder.setMessage(context.getString(R.string.dialog_msg_app_desatualizado, respVersion, versaoApp));
        builder.setIcon(R.drawable.ic_launcher_foreground);
        builder.setPositiveButton(R.string.dialog_btn_atualizar, new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int id) {
                dialog.dismiss();
                abirAppNaLoja(context);
            }
        });
        builder.setNegativeButton(R.string.dialog_btn_continuar_desatualizado, new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int id) {
                dialog.dismiss();
            }
        });
        builder.show();
    }

    public static void abirAppNaLoja(final Context ctx)
    {
        final String appPackageName = ctx.getPackageName(); // getPackageName() from Context or Activity object
        try {
            ctx.startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=" + appPackageName)));
        } catch (android.content.ActivityNotFoundException anfe) {
            ctx.startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse("https://play.google.com/store/apps/details?id=" + appPackageName)));
        }
    }

    public static void AbrirJanelaDarNota(final Context context) {
        MaterialAlertDialogBuilder builder = new MaterialAlertDialogBuilder(context);
        builder.setTitle(R.string.app_name);
        Random random = new Random();
        int messageN = random.nextInt(10);
        String[] msgsNota = context.getResources().getStringArray(R.array.dialog_msgs_nota);
        if (messageN < msgsNota.length) {
            builder.setMessage(msgsNota[messageN]);
        } else {
            builder.setMessage(R.string.dialog_msg_nota_default);
        }
        builder.setIcon(R.drawable.ic_launcher_foreground);
        if(messageN < 5) {
            builder.setPositiveButton(R.string.dialog_btn_abrir_projeto, new DialogInterface.OnClickListener() {
                public void onClick(DialogInterface dialog, int id) {
                    dialog.dismiss();

                    try {
                        Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse("https://github.com/erickweil/portugolweb"));
                        context.startActivity(browserIntent);
                    }
                    catch (Exception e)
                    {
                        Log.e("JANELAHELPER", "Erro: " + e, e);
                    }
                }
            });
        } else {
            builder.setPositiveButton(R.string.dialog_btn_dar_nota, new DialogInterface.OnClickListener() {
                public void onClick(DialogInterface dialog, int id) {
                    dialog.dismiss();

                    try {
                        SharedPreferences preferences = Inicio.getPrefs(context);
                        int deuNota = preferences.getInt("deu_nota", 0);
                        SharedPreferences.Editor prefsEdit = preferences.edit();
                        prefsEdit.putInt("deu_nota", deuNota + 1);
                        prefsEdit.apply();// commit??
                    } catch (Exception e) {
                        Log.e("JANELAHELPER", "Erro: " + e, e);
                    }

                    abirAppNaLoja(context);
                }
            });
        }
        builder.setNegativeButton(R.string.dialog_btn_depois, new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int id) {
                dialog.dismiss();
            }
        });
        builder.show();
    }

    public static void abrirJanelaAtualizaoComSucesso(final Activity context, int versaoAntiga, int versaoAtual) {
        MaterialAlertDialogBuilder builder = new MaterialAlertDialogBuilder(context);
        builder.setTitle(R.string.app_name);
        builder.setMessage(context.getString(R.string.dialog_msg_webapp_atualizado, versaoAtual, versaoAntiga));
        builder.setIcon(R.drawable.ic_launcher_foreground);
        builder.setPositiveButton(R.string.dialog_btn_reiniciar, new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int id) {
                dialog.dismiss();

                // Recomeça a Activity para recarregar o webview com o url correto
                context.recreate();
            }
        });
        builder.setNegativeButton(R.string.dialog_btn_depois, new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int id) {
                dialog.dismiss();
            }
        });

        builder.show();
    }
}
