package flow.logsmerger.business.logic.config;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import flow.logsmerger.business.logic.exceptions.ValidateFlowConfigException;
import flow.logsmerger.business.logic.models.UploadInputForm;
import flow.logsmerger.business.logic.query.broker.QueryTimestamps;
import flow.logsmerger.business.logic.rules.RulesByLogGroup;
import flow.logsmerger.business.logic.utils.Utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static flow.logsmerger.business.logic.utils.Utils.*;

public class ConfigLoader {
    private final Gson gson;
    private final String configFolderPath;

    public ConfigLoader(Gson gson, String configFolderPath) {
        this.gson = gson;
        this.configFolderPath = configFolderPath;
    }
    private static final Logger logger = LoggerFactory.getLogger(ConfigLoader.class);

    public FlowConfig loadConfig(String configFile, UploadInputForm uploadInput) throws ValidateFlowConfigException {
        FlowConfig flowConfig = loadConfigFile(configFile);

        if (uploadInput != null){
            completeFromOnlineParameters(configFile, uploadInput, flowConfig);
            logger.info("loadConfig() - completed uploadInput:" + uploadInput + " from UI and configFile:" + configFile);
        }else{
            logger.info("loadConfig() - no user (ui) input provided.");
        }

        return flowConfig;
    }

    private void completeFromOnlineParameters(String configFile, UploadInputForm uploadInput, FlowConfig flowConfig) throws ValidateFlowConfigException {
//        switch(uploadInput.getSearchRange()){
//            case PERIOD:
//                flowConfig.setSearchLastHours(0);
//                flowConfig.setSearchBeginPeriod(uploadInput.getSearchBeginPeriod());
//                flowConfig.setSearchEndPeriod(uploadInput.getSearchEndPeriod());
//                break;
//            case LASTHOURS:
                if(uploadInput.getSearchLastMinutes()>0){
                    flowConfig.setSearchLastMinutes(uploadInput.getSearchLastMinutes());
                    flowConfig.setSearchRange("LastMinutes");
                }else {
                    flowConfig.setSearchLastHours(uploadInput.getSearchLastHours());
                    flowConfig.setSearchRange("LastHours");
                }
                flowConfig.setSearchBeginPeriod("");
                flowConfig.setSearchEndPeriod("");
//                break;
//        }
        //flowConfig.setSearchRange(uploadInput.getSearchRange().toString());
        flowConfig.setResultLimit(uploadInput.getResultLimit());

        validateConfigFile(flowConfig, configFile);
        flowConfig.updateFlowConfigParameters();
        flowConfig.setRules(uploadInput.getLogGroups().stream().map(lg -> new RulesByLogGroup(lg)).collect(Collectors.toList()));
    }

    public FlowConfig loadConfigFile(String configFile) throws ValidateFlowConfigException {
        try {
            logger.info("loadConfigFile() - Reading config file. configFolderPath:[" + this.configFolderPath + "], configFile:[" + configFile + "]");
            String configJson = Utils.getFile(this.configFolderPath, configFile);
            FlowConfig flowConfig = this.gson.fromJson(configJson, FlowConfig.class);
            return flowConfig;
        } catch (JsonSyntaxException e) {
            logger.error("loadConfigFile() - Error Reading config file. configFolderPath:[" + this.configFolderPath + "], configFile:[" + configFile + "]");
            logger.error(e.getMessage());
            throw new ValidateFlowConfigException(configFile);
        }
    }

    private void validateConfigFile(FlowConfig flowConfig, String configFile) throws ValidateFlowConfigException {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        Set<ConstraintViolation<FlowConfig>> violations = validator.validate(flowConfig);

        if (!violations.isEmpty()) {
            List<String> validationErrorsMessages = new ArrayList<>();
            for(ConstraintViolation<FlowConfig> error: violations) {
                logger.error("Input param validation: " + error.getMessageTemplate());
                validationErrorsMessages.add(error.getMessageTemplate());
            }
            throw new ValidateFlowConfigException(configFile, validationErrorsMessages);
        }

        validateConfigurationSearchQueryRange(flowConfig, configFile);
    }

    private void validateConfigurationSearchQueryRange(FlowConfig flowConfig, String configFile) throws ValidateFlowConfigException {
        flowConfig.setSearchRange(flowConfig.getSearchRange().toUpperCase());
        if (flowConfig.getSearchRange().equals(QueryTimestamps.PERIOD.toString())) {
            validatePeriodSearchQuery(flowConfig, configFile);
        } else {
            validateLastHoursSearchQuery(flowConfig, configFile);
        }
    }

    private void validatePeriodSearchQuery(FlowConfig flowConfig, String configFile) throws ValidateFlowConfigException {
        try {
            new SimpleDateFormat(QUERY_TIMESTAMPS_PATTERN).parse(flowConfig.getSearchBeginPeriod());
            new SimpleDateFormat(QUERY_TIMESTAMPS_PATTERN).parse(flowConfig.getSearchEndPeriod());
        } catch (ParseException e) {
            logger.error(ERROR_SEARCH_PERIOD_PATTERN_VALIDATION);
            throw new ValidateFlowConfigException(configFile);
        }
    }

    private void validateLastHoursSearchQuery(FlowConfig flowConfig, String configFile) throws ValidateFlowConfigException {
        if (flowConfig.getSearchLastHours() < MINIMUM_FLOW_DURATION)
        {
            logger.error(ERROR_LAST_HOURS_QUERY_SEARCH_VALIDATION);
            throw new ValidateFlowConfigException(configFile);
        }
    }
}
