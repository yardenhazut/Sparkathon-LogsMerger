package flow.logsmerger.business.logic.models;

import flow.logsmerger.business.logic.exceptions.GenerateUmlRowException;
import lombok.Getter;
import lombok.NoArgsConstructor;

import static flow.logsmerger.business.logic.diagrams.SequenceDiagramUtils.UML_MESSAGE_REQ_BLUE;
import static flow.logsmerger.business.logic.diagrams.SequenceDiagramUtils.UML_MESSAGE_REQ_DEFAULT;
import static flow.logsmerger.business.logic.diagrams.SequenceDiagramUtils.UML_MESSAGE_REQ_GREEN;
import static flow.logsmerger.business.logic.diagrams.SequenceDiagramUtils.UML_MESSAGE_REQ_RED;
import static flow.logsmerger.business.logic.diagrams.SequenceDiagramUtils.UML_MESSAGE_RES_BLUE;
import static flow.logsmerger.business.logic.diagrams.SequenceDiagramUtils.UML_MESSAGE_RES_DEFAULT;
import static flow.logsmerger.business.logic.diagrams.SequenceDiagramUtils.UML_MESSAGE_RES_GREEN;
import static flow.logsmerger.business.logic.diagrams.SequenceDiagramUtils.UML_MESSAGE_RES_RED;

@Getter
@NoArgsConstructor
public class UmlRow {
    private String requestUmlPattern = UML_MESSAGE_REQ_DEFAULT;
    private String responseUmlPattern = UML_MESSAGE_RES_DEFAULT;

    public void setUmlArrowsColors(LogMessage message, String[] parameters) {
        String messageBody =  message.getMessageBody();

        if (messageBody != null && !messageBody.isEmpty()) {
            if (messageBody.contains(parameters[0])) {
                requestUmlPattern = UML_MESSAGE_REQ_GREEN;
                responseUmlPattern = UML_MESSAGE_RES_GREEN;
            }
            if (parameters.length > 1 && messageBody.contains(parameters[1])) {
                requestUmlPattern = UML_MESSAGE_REQ_RED;
                responseUmlPattern = UML_MESSAGE_RES_RED;
            }
            if (parameters.length > 2 && messageBody.contains(parameters[2])) {
                requestUmlPattern = UML_MESSAGE_REQ_BLUE;
                responseUmlPattern = UML_MESSAGE_RES_BLUE;
            }
        }
    }

    public String generateUmlRow(LogMessage logMessage) throws GenerateUmlRowException {
        if (logMessage.getDiagramArrowText() != null) {
            if (logMessage.isRequest()) {
                return String.format(requestUmlPattern, logMessage.getSourceComponent(), logMessage.getDestinationComponent(), logMessage.getDiagramArrowText());
            } else {
                return String.format(responseUmlPattern, logMessage.getSourceComponent(), logMessage.getDestinationComponent(), logMessage.getDiagramArrowText());
            }
        } else {
            throw new GenerateUmlRowException(logMessage);
        }
    }
}
