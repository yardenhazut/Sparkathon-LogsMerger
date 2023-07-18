package flow.logsmerger.business.logic.exceptions;

import flow.logsmerger.business.logic.utils.Utils;

public class InvalidRestRequestParamException extends Exception {
    public InvalidRestRequestParamException(String message) {
        super(String.format("Invalid number of parameters. The allowed number of parameters should be between %s to %s - %s", Utils.MIN_PARAMETERS, Utils.MAX_PARAMETERS, message));
    }
}
