package flow.logsmerger.business.logic.exceptions;

import java.util.List;
import java.util.stream.Collectors;

public class ValidateFlowConfigException extends Exception {
    private List<String> validationErrorsMessages;

    public ValidateFlowConfigException() {
        super(String.format("An error occurred during reading flow config file"));
    }

    public ValidateFlowConfigException(String configFile) {
        super(String.format("An error occurred during reading flow config file from %s", configFile));
    }
    public ValidateFlowConfigException(String configFile, List<String> validationErrorsMessages) {
        this(configFile);
        this.validationErrorsMessages = validationErrorsMessages;
    }
    @Override
    public String getMessage() {
        return "Errors:" + super.getMessage() + (validationErrorsMessages != null ? "\nInput Validation Errors:\n" + validationErrorsMessages.stream().collect(Collectors.joining("\n")) : "");
    }
}
