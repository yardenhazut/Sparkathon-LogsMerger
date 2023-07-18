package flow.logsmerger.business.logic.exceptions;

public class DiagramGenerationException extends Exception {
    public DiagramGenerationException(String errorMessage) {
        super("An error occurred during generation the diagram. " + errorMessage);
    }
}
