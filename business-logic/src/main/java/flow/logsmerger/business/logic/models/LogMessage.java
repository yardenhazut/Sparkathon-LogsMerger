package flow.logsmerger.business.logic.models;

import lombok.Builder;
import lombok.Getter;

import java.util.Objects;

@Getter
@Builder
public class LogMessage {
    private String sourceComponent;
    private String destinationComponent;
    private String diagramArrowText;
    private String messageBody;
    private boolean isRequest;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LogMessage that = (LogMessage) o;
        return isRequest == that.isRequest && sourceComponent.equals(that.sourceComponent) && destinationComponent.equals(that.destinationComponent) && diagramArrowText.equals(that.diagramArrowText) && messageBody.equals(that.messageBody);
    }

    @Override
    public int hashCode() {
        return Objects.hash(sourceComponent, destinationComponent, diagramArrowText, messageBody, isRequest);
    }
}
