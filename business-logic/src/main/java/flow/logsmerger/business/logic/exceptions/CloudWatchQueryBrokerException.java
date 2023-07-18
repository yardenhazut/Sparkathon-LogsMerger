package flow.logsmerger.business.logic.exceptions;

public class CloudWatchQueryBrokerException extends Exception {
    public CloudWatchQueryBrokerException(String message) {
        super("Cloudwatch Query Exception:  An error occurred during running aws query. message: " + message);
    }
}
