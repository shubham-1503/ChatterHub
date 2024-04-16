package org.example;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.sns.SnsClient;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import software.amazon.awssdk.services.sns.model.PublishRequest;
import software.amazon.awssdk.services.sns.model.SnsException;
import software.amazon.awssdk.services.sns.model.SubscribeRequest;
import software.amazon.awssdk.services.sns.model.SubscribeResponse;

public class EmailPublish implements RequestHandler<SnsRequest, String> {

    @Override
    /*
     * Takes in an InputRecord, which contains two integers and a String.
     * Logs the String, then returns the sum of the two Integers.
     */
    public String handleRequest(SnsRequest event, Context context)
    {
        LambdaLogger logger = context.getLogger();
        logger.log("String found: " + event.message());
        subEmail(event.topic(),"parthkarkhanis@gmail.com");
        sendSns(event.message(),"Items Posted",event.topic());
        return "success";
    }

    public boolean sendSns(String message, String subject,String topic) {
        try {
            SnsClient snsClient = SnsClient.builder().region(Region.US_EAST_1).build();
            PublishRequest request = PublishRequest.builder()
                    .topicArn(topic)
                    .message(message)
                    .subject(subject)
                    .build();
            snsClient.publish(request);
            System.out.println("Notification sent successfully.");
            return true;
        } catch (Exception e) {
            System.out.println("Error occurred while publishing notification: " + e.getMessage());
            return false;
        }
    }

    public static void subEmail(String topicArn, String email) {
        try {
            SnsClient snsClient = SnsClient.builder().region(Region.US_EAST_1).build();
            SubscribeRequest request = SubscribeRequest.builder()
                    .protocol("email")
                    .endpoint(email)
                    .returnSubscriptionArn(true)
                    .topicArn(topicArn)
                    .build();

            SubscribeResponse result = snsClient.subscribe(request);
            System.out.println("Subscription ARN: " + result.subscriptionArn() + "\n\n Status is "
                    + result.sdkHttpResponse().statusCode());

        } catch (SnsException e) {
            System.err.println(e.awsErrorDetails().errorMessage());
            System.exit(1);
        }
    }
}
record SnsRequest(String message, String topic) {
}
