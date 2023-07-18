package flow.logsmerger.business.logic.utils;

import flow.logsmerger.business.logic.exceptions.ValidateFlowConfigException;
import lombok.Getter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@Getter
public class Utils {

    private static final Logger logger = LoggerFactory.getLogger(Utils.class);

    private Utils() {}
    public static final Integer MAX_PARAMETERS = 3;
    public static final Integer MIN_PARAMETERS = 1;
    public static final String UNFINISHED_QUERY_RESULT_STATUS = "Running";
    public static final String LOG_PARAMETERS_SEPARATOR = "\\|";
    public static final String PARAMETERS_SEPARATOR = ",";
    public static final String SEARCH_PARAMETERS_SEPARATOR = "|";
    public static final String AWS_LOGS_PLATFORM = "AWS Cloudwatch";
    public static final String ERROR_LAST_HOURS_QUERY_SEARCH_VALIDATION = "last hours search query must be a positive number that is greater than 1";
    public static final String ERROR_SEARCH_RANGE_VALIDATION = "flow search range must be 'LastHours' or 'Period'";
    public static final String ERROR_SEARCH_PERIOD_PATTERN_VALIDATION = "flow search period must be of pattern 'MM/dd/yyyy HH:mm:SS'";
    public static final int MINIMUM_FLOW_DURATION = 1;
    public static final int MINIMUM_LIMIT_RESULT = 1;
    public static final int MAXIMUM_LIMIT_RESULT = 10000;
    public static final String ERROR_RESULT_LIMIT_VALIDATION = "limit result must be more then 1 and less then 10000";
    public static final String ERROR_AWS_PROFILE_VALIDATION = "aws profile can not be missing";
    public static final String ERROR_AWS_REGION_VALIDATION = "aws region can not be missing";
    public static final String ERROR_RULES_VALIDATION = "rules can not be missing";
    public static final String ERROR_LOG_GROUP_VALIDATION = "log group can not be missing";
    public static final String ERROR_LOG_GROUP_RULES_VALIDATION = "rules of log group can not be missing";
    public static final String ERROR_MESSAGE_INCLUDES_VALIDATION = "The \"message includes\" field of a rule can not be missing";
    public static final String ERROR_IS_REQUEST_VALIDATION = "The \"is request\" field of a rule can not be missing";
    public static final String ERROR_ARROW_TEXT_VALIDATION = "The \"arrow text\" field of a rule can not be missing";
    public static final String ERROR_SOURCE_COMPONENT_VALIDATION = "The \"source component\" field of a rule can not be missing";
    public static final String ERROR_DESTINATION_COMPONENT_VALIDATION = "The \"destination component\" field of a rule can not be missing";
    public static final String ERROR_SEARCH_LAST_HOURS_MISSING = "The \"search Last Hours\" field of configuration file can not be missing";
    public static final String ERROR_SEARCH_BEGIN_PERIOD_MISSING = "The \"search Begin Period\" field of configuration file can not be missing";
    public static final String ERROR_SEARCH_END_PERIOD_MISSING = "The \"search End Period\" field of configuration file can not be missing";
    public static final String AWS_LOGS_LOG_FIELD_NAME = "@log";
    public static final String AWS_LOGS_MESSAGE_FIELD_NAME = "@message";
    public static final String QUERY_TIMESTAMPS_PATTERN = "MM/dd/yyyy HH:mm:ss";

    public static String getFile(String configurationFolderPath ,String resourceName) throws ValidateFlowConfigException {
        try {
            byte[] fileContent = Files.readAllBytes(Paths.get(configurationFolderPath + resourceName));
            return new String(fileContent);
        } catch (IOException e) {
            logger.error(e.getMessage());
            throw new ValidateFlowConfigException(resourceName);
        }
    }
}
