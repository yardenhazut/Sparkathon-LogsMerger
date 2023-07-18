package flow.logsmerger.business.logic.exceptions;

public class AwsClientLoginException extends Exception {
    public AwsClientLoginException(String message) {
        super("An error occurred during create aws log client. Message: " + message);
    }
}
