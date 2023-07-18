package flow.logsmerger.business.logic.utils;

import flow.logsmerger.business.logic.config.FlowConfig;
import flow.logsmerger.business.logic.models.LogMessage;
import flow.logsmerger.business.logic.exceptions.ConvertLogMessageException;
import flow.logsmerger.business.logic.rules.Rule;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class QueryConvertor {
    @Autowired
    private LogMessageGenerator logMessageGenerator;

    private static final Logger logger = LoggerFactory.getLogger(QueryConvertor.class);

    private String getLogGroup(String logField, FlowConfig flowConfig) throws ConvertLogMessageException {
        for (String logGroups: flowConfig.getLogGroups()) {
            if (logField.contains(logGroups)) {
                return logGroups;
            }
        }
        throw new ConvertLogMessageException("Log field value does not match any of the log groups of the configuration file");
    }

    public void convertQueryResultToLogMessage(FlowConfig flowConfig, String logField, String messageResult, List<LogMessage> logMessages) {
        try {
            String logGroup = getLogGroup(logField, flowConfig);
            List<Rule> rules = flowConfig.getLogGroupRules(logGroup);

            for (Rule rule: rules) {
               if (ruleApplyOnMessage(messageResult, rule)) {
                   logMessages.add(logMessageGenerator.logMessageGenerator(messageResult, rule));
               }
            }
        } catch (ConvertLogMessageException e) {
            logger.error(e.getMessage());
        }
    }

    private boolean ruleApplyOnMessage(String message, Rule rule) {
        try {
            for (String messageInclude : rule.getMessageIncludes()) {
                if (!message.contains(messageInclude)) {
                    return false;
                }
            }

            return true;
        } catch (Exception e) {
            logger.error("An exception occurred during check if rule apply on message");
            return false;
        }
    }
}
