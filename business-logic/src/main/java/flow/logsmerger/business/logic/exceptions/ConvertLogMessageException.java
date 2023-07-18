package flow.logsmerger.business.logic.exceptions;

public class ConvertLogMessageException extends Exception {
    public ConvertLogMessageException(String logMessage) {
        super("An error occurred during converting result to log message. result: \n" + logMessage);
    }
}
