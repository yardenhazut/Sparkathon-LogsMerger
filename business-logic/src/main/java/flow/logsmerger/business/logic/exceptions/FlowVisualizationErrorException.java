package flow.logsmerger.business.logic.exceptions;

public class FlowVisualizationErrorException extends Exception {
    public FlowVisualizationErrorException() {
        super("An error occurred during running flow visualization. Please check the tool logs for more information");
    }
    public FlowVisualizationErrorException(String message) {
        super(message);
    }
}
