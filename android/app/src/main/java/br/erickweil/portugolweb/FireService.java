package br.erickweil.portugolweb;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.app.TaskStackBuilder;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
//import com.google.firebase.iid.FirebaseInstanceId;
//import com.google.firebase.iid.InstanceIdResult;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import java.util.Map;

public class FireService extends FirebaseMessagingService {
    /**
     * Called when message is received.
     *
     * @param remoteMessage Object representing the message received from Firebase Cloud Messaging.
     */
    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        // [START_EXCLUDE]
        // There are two types of messages data messages and notification messages. Data messages
        // are handled
        // here in onMessageReceived whether the app is in the foreground or background. Data
        // messages are the type
        // traditionally used with GCM. Notification messages are only received here in
        // onMessageReceived when the app
        // is in the foreground. When the app is in the background an automatically generated
        // notification is displayed.
        // When the user taps on the notification they are returned to the app. Messages
        // containing both notification
        // and data payloads are treated as notification messages. The Firebase console always
        // sends notification
        // messages. For more see: https://firebase.google.com/docs/cloud-messaging/concept-options
        // [END_EXCLUDE]

        // TODO(developer): Handle FCM messages here.
        // Not getting messages here? See why this may be: https://goo.gl/39bRNJ
        Log.d("FireService", "From: " + remoteMessage.getFrom());

        // Check if message contains a data payload.
        if (remoteMessage.getData().size() > 0) {
            Log.d("FireService", "Message data payload: " + remoteMessage.getData());



        }

        // Check if message contains a notification payload.
        if (remoteMessage.getNotification() != null) {
            Log.d("FireService", "Message Notification Body: " + remoteMessage.getNotification().getBody());
        }

        // Also if you intend on generating your own notifications as a result of a received FCM
        // message, here is where that should be initiated. See sendNotification method below.
        sendNotification(remoteMessage.getNotification(),remoteMessage.getData());
    }

    /**
     * Create and show a simple notification containing the received FCM message.
     *
     */
    private void sendNotification(RemoteMessage.Notification notification, Map<String,String> data) {
        //PendingIntent pendingIntent = PendingIntent.getActivity(this, 0 /* Request code */, intent,
        //        PendingIntent.FLAG_ONE_SHOT);

        // Create an Intent for the activity you want to start

        // Create the TaskStackBuilder and add the intent, which inflates the back stack
        TaskStackBuilder stackBuilder = manageIntentStackFromData(this,data);

        // Get the PendingIntent containing the entire back stack
        PendingIntent pendingIntent = stackBuilder.getPendingIntent(0, PendingIntent.FLAG_ONE_SHOT);

        String channelId = getString(R.string.default_channel_id);
        Uri defaultSoundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
        NotificationCompat.Builder notificationBuilder =
                new NotificationCompat.Builder(this, channelId)
                        .setSmallIcon(R.mipmap.ic_launcher)
                        .setContentTitle(notification.getTitle())
                        .setContentText(notification.getBody())
                        .setAutoCancel(true)
                        .setSound(defaultSoundUri)
                        .setContentIntent(pendingIntent);

        NotificationManager notificationManager =
                (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

        // Since android Oreo notification channel is needed.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(channelId,
                    "Channel human readable title",
                    NotificationManager.IMPORTANCE_DEFAULT);
            notificationManager.createNotificationChannel(channel);
        }

        notificationManager.notify(0 /* ID of notification */, notificationBuilder.build());
    }
    /**
     * Called if InstanceID token is updated. This may occur if the security of
     * the previous token had been compromised. Note that this is called when the InstanceID token
     * is initially generated so this is where you would retrieve the token.
     */
    @Override
    public void onNewToken(String token) {
        Log.d("FireService", "Refreshed token: " + token);

        // If you want to send messages to this application instance or
        // manage this apps subscriptions on the server side, send the
        // Instance ID token to your app server.
        //sendRegistrationToServer(token);
        saveToken(this,token);
    }

    public static String getCurrentToken(Context ctx,SharedPreferences prefs)
    {
        String token = prefs.getString("firebaseToken",null);
        if(token == null) refreshSavedToken(ctx);

        Log.d("FireService", "Token firebase que estava salvo:'"+token+"'");

        return token;
    }

    public static void refreshSavedToken(final Context ctx)
    {
        // https://stackoverflow.com/questions/38237559/how-do-you-send-a-firebase-notification-to-all-devices-via-curl
        //FirebaseMessaging.getInstance().subscribeToTopic("all");

        /*FirebaseInstanceId.getInstance().getInstanceId()
                .addOnCompleteListener(new OnCompleteListener<InstanceIdResult>() {
                    @Override
                    public void onComplete(@NonNull Task<InstanceIdResult> task) {
                        if (!task.isSuccessful()) {
                            Log.w("FireService", "getInstanceId failed", task.getException());
                            return;
                        }

                        // Get new Instance ID token
                        String token = task.getResult().getToken();
                        saveToken(ctx,token);
                        // Log and toast
                        Log.d("FireService", "Conseguiu o token firebase:'"+token+"'");
                    }
                });*/
    }

    private static void saveToken(Context ctx, String token)
    {
        SharedPreferences prefs = ctx.getApplicationContext().getSharedPreferences("SessionData", MODE_PRIVATE); // 0 - for private mode
        SharedPreferences.Editor prefsEdit = prefs.edit();

        prefsEdit.putString("firebaseToken",token);

        prefsEdit.apply();// commit??
    }

    public static TaskStackBuilder manageIntentStackFromData(Context ctx,Map<String,String> data)
    {
        TaskStackBuilder stackBuilder = TaskStackBuilder.create(ctx);
        stackBuilder.addNextIntentWithParentStack(new Intent(ctx, Inicio.class));

        /*if(data.containsKey("type")){
            if(data.get("type").equals("MSG")) {

                stackBuilder.addNextIntent(new Intent(ctx, Mensagens.class));

                if (data.containsKey("sender_nome") && data.containsKey("sender_email")) {
                    Intent resultIntent = new Intent(ctx, Chat.class);
                    resultIntent.putExtra("EXTRA_USUARIO_EMAIL", data.get("sender_email"));
                    resultIntent.putExtra("EXTRA_USUARIO_NOME", data.get("sender_nome"));
                    stackBuilder.addNextIntent(resultIntent);
                }

            }
            else if(data.get("type").equals("COMMENT")) {
                stackBuilder.addNextIntent(new Intent(ctx, MinhasOfertas.class));

                if (data.containsKey("oferta_id") && data.containsKey("sender_email")) {
                    Intent resultIntent = new Intent(ctx, DetalhesOferta.class);
                    resultIntent.putExtra("EXTRA_IDOFERTA", Integer.parseInt(data.get("oferta_id")));
                    resultIntent.putExtra("EXTRA_COMENTARIO_HIGHLIGHT", data.get("sender_email"));
                    stackBuilder.addNextIntent(resultIntent);
                }
            }
            else if(data.get("type").equals("RENT")) {
                stackBuilder.addNextIntent(new Intent(ctx, MinhasOfertas.class));
            }
        }*/
        return stackBuilder;
    }
}

