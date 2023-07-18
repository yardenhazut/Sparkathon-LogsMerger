package flow.logsmerger.business.logic.exceptions;

public class LoadFlowConfigException extends Exception {
    public LoadFlowConfigException(String configFile) {
        super(String.format("An error occurred during opening flow config file %s. Please check the tool logs for more information", configFile));
    }
}
