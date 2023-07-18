package flow.logsmerger.business.logic.diagrams;

import flow.logsmerger.business.logic.exceptions.DiagramGenerationException;
import flow.logsmerger.business.logic.models.LogMessage;

import java.util.List;
public interface DiagramGenerator {
    String generateDiagram(List<LogMessage> messages, String parameters) throws DiagramGenerationException;
}
