package flow.logsmerger.business.logic.rules;

import flow.logsmerger.business.logic.utils.Utils;
import lombok.Builder;
import lombok.Getter;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Getter
@Builder
public class RulesByLogGroup {
    @NotNull(message = Utils.ERROR_LOG_GROUP_VALIDATION)
    private String logGroup;

    @NotNull(message = Utils.ERROR_LOG_GROUP_RULES_VALIDATION)
    @Valid
    private final List<Rule> logGroupRules = new ArrayList<>();

    public RulesByLogGroup(String logGroup) {
        this.logGroup = logGroup;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RulesByLogGroup that = (RulesByLogGroup) o;
        return Objects.equals(logGroup, that.logGroup) && Objects.equals(logGroupRules, that.logGroupRules);
    }

    @Override
    public int hashCode() {
        return Objects.hash(logGroup, logGroupRules);
    }
}
