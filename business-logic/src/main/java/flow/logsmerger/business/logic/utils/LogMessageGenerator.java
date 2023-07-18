package flow.logsmerger.business.logic.utils;

import flow.logsmerger.business.logic.models.LogMessage;
import flow.logsmerger.business.logic.rules.Rule;
import org.springframework.stereotype.Component;

@Component
public class LogMessageGenerator {
    public LogMessage logMessageGenerator(String message, Rule rule) {
        return LogMessage.builder()
                .sourceComponent(rule.getSourceComponent())
                .destinationComponent(rule.getDestinationComponent())
                .isRequest(rule.getIsRequest())
                .messageBody(message)
                .diagramArrowText(rule.getArrowText())
                .build();
    }
}
