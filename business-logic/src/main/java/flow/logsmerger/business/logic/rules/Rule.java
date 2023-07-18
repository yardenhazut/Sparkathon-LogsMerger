package flow.logsmerger.business.logic.rules;

import flow.logsmerger.business.logic.utils.Utils;
import lombok.Builder;
import lombok.Getter;

import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Objects;

@Getter
@Builder
public class Rule {
    @NotNull(message = Utils.ERROR_MESSAGE_INCLUDES_VALIDATION)
    private List<String> messageIncludes;
    @NotNull(message = Utils.ERROR_IS_REQUEST_VALIDATION)
    private Boolean isRequest;
    @NotNull(message = Utils.ERROR_ARROW_TEXT_VALIDATION)
    private String arrowText;
    @NotNull(message = Utils.ERROR_SOURCE_COMPONENT_VALIDATION)
    private String sourceComponent;
    @NotNull(message = Utils.ERROR_DESTINATION_COMPONENT_VALIDATION)
    private String destinationComponent;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Rule rule = (Rule) o;
        return isRequest == rule.isRequest && Objects.equals(messageIncludes, rule.messageIncludes) && Objects.equals(arrowText, rule.arrowText) && Objects.equals(sourceComponent, rule.sourceComponent) && Objects.equals(destinationComponent, rule.destinationComponent);
    }

    @Override
    public int hashCode() {
        return Objects.hash(messageIncludes, isRequest, arrowText, sourceComponent, destinationComponent);
    }
}
