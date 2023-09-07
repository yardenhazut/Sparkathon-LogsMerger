package flow.logsmerger.business.logic.config;

import flow.logsmerger.business.logic.config.validator.TimestampsEnumValue;
import flow.logsmerger.business.logic.exceptions.ConvertLogMessageException;
import flow.logsmerger.business.logic.query.broker.QueryTimestamps;
import flow.logsmerger.business.logic.rules.RulesByLogGroup;
import flow.logsmerger.business.logic.rules.Rule;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.validation.Valid;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static flow.logsmerger.business.logic.utils.Utils.ERROR_SEARCH_BEGIN_PERIOD_MISSING;
import static flow.logsmerger.business.logic.utils.Utils.ERROR_RESULT_LIMIT_VALIDATION;
import static flow.logsmerger.business.logic.utils.Utils.ERROR_RULES_VALIDATION;
import static flow.logsmerger.business.logic.utils.Utils.ERROR_SEARCH_END_PERIOD_MISSING;
import static flow.logsmerger.business.logic.utils.Utils.ERROR_SEARCH_LAST_HOURS_MISSING;
import static flow.logsmerger.business.logic.utils.Utils.ERROR_SEARCH_LAST_MINUTES_MISSING;
import static flow.logsmerger.business.logic.utils.Utils.MAXIMUM_LIMIT_RESULT;
import static flow.logsmerger.business.logic.utils.Utils.MINIMUM_LIMIT_RESULT;

@Getter
@Setter
@Builder
public class FlowConfig {
    @NotNull(message = ERROR_SEARCH_LAST_HOURS_MISSING)
    private int searchLastHours;

    @NotNull(message = ERROR_SEARCH_LAST_MINUTES_MISSING)
    private int searchLastMinutes;

    @NotNull(message = ERROR_SEARCH_BEGIN_PERIOD_MISSING)
    private String searchBeginPeriod;

    @NotNull(message = ERROR_SEARCH_END_PERIOD_MISSING)
    private String searchEndPeriod;

    @TimestampsEnumValue(enumClass = QueryTimestamps.class)
    private String searchRange;

    @Min(value = MINIMUM_LIMIT_RESULT, message = ERROR_RESULT_LIMIT_VALIDATION)
    @Max(value = MAXIMUM_LIMIT_RESULT, message = ERROR_RESULT_LIMIT_VALIDATION)
    @NotNull(message = ERROR_RESULT_LIMIT_VALIDATION)
    private int resultLimit;

    @NotNull(message = ERROR_RULES_VALIDATION)
    @Valid
    private List<RulesByLogGroup> rules;

    private Map<String, List<Rule>> flowRules;
    private Set<String> flowComponents;

    private static final Logger logger = LoggerFactory.getLogger(FlowConfig.class);

    public void updateFlowConfigParameters() {
        this.flowRules = new HashMap<>();
        this.flowComponents = new HashSet<>();

        for (RulesByLogGroup logGroupsRules: this.rules) {
            this.flowRules.put(logGroupsRules.getLogGroup(), logGroupsRules.getLogGroupRules());
            updateFlowComponents(logGroupsRules);
        }
    }

    private void updateFlowComponents(RulesByLogGroup logGroupsRules) {
        for (Rule rule: logGroupsRules.getLogGroupRules()) {
            this.flowComponents.add(rule.getSourceComponent());
            this.flowComponents.add(rule.getDestinationComponent());
        }
    }

    public Set<String> getLogGroups() {
        //return this.flowRules.keySet();
        return new HashSet<>(this.rules.stream().map(l->l.getLogGroup()).collect(Collectors.toList()));
    }

    public List<Rule> getLogGroupRules(String logGroup) throws ConvertLogMessageException {
        for (Map.Entry<String, List<Rule>> rule: this.flowRules.entrySet()) {
            if (rule.getKey().contains(logGroup))
                return rule.getValue();
        }

        throw new ConvertLogMessageException(String.format("log group %s doesn't have rules on config file", logGroup));
    }
}
