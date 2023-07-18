package flow.logsmerger.business.logic.exceptions;

public class GetQueryBrokerException extends Exception {
    public GetQueryBrokerException(String platform) {
        super(String.format("An error occurred during trying to get query broker for the %s logs platform", platform));
    }
}
