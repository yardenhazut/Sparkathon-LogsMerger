package flow.logsmerger.business.logic.exceptions;

import flow.logsmerger.business.logic.models.LogMessage;

public class GenerateUmlRowException extends Exception{
    public GenerateUmlRowException(LogMessage logMessage) {
        super(String.format("Unable to generate uml row - the rule that apply on the message: %s does not have arrow test", logMessage.getMessageBody()));
    }
}
