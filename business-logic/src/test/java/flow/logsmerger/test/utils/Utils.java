package flow.logsmerger.test.utils;

import com.amazonaws.services.logs.model.GetQueryResultsResult;
import com.amazonaws.services.logs.model.ResultField;
import flow.logsmerger.business.logic.models.LogMessage;
import flow.logsmerger.business.logic.models.RangeType;
import flow.logsmerger.business.logic.models.UploadInputForm;
import org.springframework.util.LinkedMultiValueMap;

import java.io.IOException;
import java.lang.reflect.Field;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Utils {
    public static final String CONFIG_FILE_PERIOD_SEARCH_QUERY = "test-config-period-search-query.json";
    public static final String RESOURCES_FOLDER_PATH = "src/test/java/flow/visualization/test/configuration/files/";
    public static final String CONFIG_FOLDER_PATH = "src/test/java/flow/visualization/test/configuration/";
    public static final String PARAMETERS_FILES_REST_HTTP_REQUEST = "parameters";
    public static final String PARAM_NAME_CONFIG_FILE = "configFileName";
    public static final String CONFIG_FILE_FILES_REST_HTTP_REQUEST = "test-config-last-hours-search-query.json";
    public static final String FLOW_DIAGRAM_FILE_FULL_PATH = "src/test/java/flow/visualization/test/configuration/files/output/flowDiagram_dummy_text1.png";
    public static final String CONFIG_FILE_LAST_HOURS_SEARCH_QUERY = "test-config-last-hours-search-query.json";

    public static final String CONFIG_FILE_THROW_EXCEPTION = "test-config-throw-exception.json";
    public static final String NOT_EXISTING_CONFIG_FILE = "dummy-config.json";
    public static final String LOG_GROUP_DUMMY_1 = "log-group-dummy-1";
    public static final String LOG_GROUP_DUMMY_2 = "log-group-dummy-2";
    public static final String DUMMY_LOG_MESSAGE = "dummy_log_message";
    public static final String DUMMY_BEGIN_PERIOD_TIME_QUERY_SEARCH = "02/08/2023 12:00:00";
    public static final String DUMMY_PERIOD_TIME_QUERY_SEARCH_WITHOUT_TIME = "02/08/2023";
    public static final String DUMMY_PERIOD_TIME_QUERY_SEARCH_WITHOUT_DATE = "12:00:00";
    public static final String DUMMY_PERIOD_TIME_QUERY_SEARCH_WITH_WRONG_FORMAT = "02.08.2023 12:00:00";
    public static final String DUMMY_END_PERIOD_TIME_QUERY_SEARCH = "03/08/2023 15:00:00";
    public static final String DUMMY_LOG_MESSAGE_WITHOUT_RULES = "no_rules";
    public static final boolean DUMMY_LOG_IS_REQUEST_TRUE = true;
    public static final boolean DUMMY_LOG_IS_REQUEST_FALSE = false;
    public static final String DUMMY_LOG_ARROW_TEST = "dummy_text";
    public static final String DUMMY_SOURCE_COMPONENT = "dummy_source_component";
    public static final String DUMMY_DESTINATION_COMPONENT = "dummy_destination_component";
    public static final String REQUEST_PARAMETERS_1 = "dummy_text1";
    public static final String REQUEST_PARAMETERS_2 = "dummy_text2";
    public static final String REQUEST_PARAMETERS_3 = "dummy_text3";
    public static final String REQUEST_PARAMETERS_4 = "dummy_text4";
//    public static final String FLOW_VISUALIZATION_URL = "/flow/visualization";
    public static final String FLOW_VISUALIZATION_URL = "/flow-visualization/search";
    public static final Integer LAST_HOURS_SEARCH_QUERY = 72;
    public static final Integer MAX_QUERY_RESULT = 10000;
    public static final String PERIOD_SEARCH_QUERY_BEGIN = "02/08/2023 12:00:00";
    public static final String PERIOD_SEARCH_QUERY_END = "02/08/2023 17:00:00";
    public static final Integer RESULT_LIMIT = 1;
    public static final String AWS_PROFILE = "cxca-dev-assume";
    public static final String AWS_REGION = "us-west-2";
    private static final String TIMESTAMP_FIELD_NAME = "@timestamp";
    private static final String DUMMY_TIMESTAMP_FIELD_VALUE = "dummy_timestamp";
    private static final String LOG_FIELD_NAME = "@log";
    private static final String MESSAGE_FIELD_NAME = "@message";
    private static final String PTR_FIELD_NAME = "@ptr";
    private static final String DUMMY_PTR_FIELD_VALUE = "dummy_ptr";
    private static final int TIMESTAMP_FIELD_INDEX = 0;
    private static final int LOG_FIELD_INDEX = 1;
    private static final int MESSAGE_FIELD_INDEX = 2;
    private static final int PTR_FIELD_INDEX = 3;
    public static final String DUMMY_SEARCH_PATTERN_2_PARAMETERS = String.format("%s|%s", REQUEST_PARAMETERS_1, REQUEST_PARAMETERS_2);
    public static final String DUMMY_SEARCH_PATTERN_3_PARAMETERS = String.format("%s|%s|%s", REQUEST_PARAMETERS_1, REQUEST_PARAMETERS_2, REQUEST_PARAMETERS_3);
    public static final String DUMMY_SEARCH_PATTERN_4_PARAMETERS = String.format("%s|%s|%s|%s", REQUEST_PARAMETERS_1, REQUEST_PARAMETERS_2, REQUEST_PARAMETERS_3, REQUEST_PARAMETERS_4);
    public static final String DUMMY_1_PARAMETERS = String.format("%s", REQUEST_PARAMETERS_1);
    public static final String DUMMY_2_PARAMETERS = String.format("%s,%s", REQUEST_PARAMETERS_1, REQUEST_PARAMETERS_2);
    public static final String DUMMY_3_PARAMETERS = String.format("%s,%s,%s", REQUEST_PARAMETERS_1, REQUEST_PARAMETERS_2, REQUEST_PARAMETERS_3);
    public static final String DUMMY_DIAGRAM_UML_TXT_FILE_NAME = RESOURCES_FOLDER_PATH + "dummy_diagram_uml_test.txt";
    public static final String DUMMY_DIAGRAM_PNG_FILE_NAME = String.format("flowDiagram_%s.png", REQUEST_PARAMETERS_1);
    private static final int NUMBER_EMPTY_VALUE = 0;
    private static final String STRING_EMPTY_VALUE = "";

    public static GetQueryResultsResult createGetQueryResultsResult() {
        GetQueryResultsResult getQueryResultsResult = new GetQueryResultsResult();

        getQueryResultsResult.setResults(Collections.singleton(createListOfResultField()));
        return getQueryResultsResult;
    }

    public static List<ResultField> createListOfResultField() {
        List<ResultField> resultFieldList = new ArrayList<>();

        ResultField resultFieldTimestamp = new ResultField();
        resultFieldTimestamp.setField(TIMESTAMP_FIELD_NAME);
        resultFieldTimestamp.setValue(DUMMY_TIMESTAMP_FIELD_VALUE);
        ResultField resultFieldLogSteam = new ResultField();
        resultFieldLogSteam.setField(LOG_FIELD_NAME);
        resultFieldLogSteam.setValue(LOG_GROUP_DUMMY_1);
        ResultField resultFieldMessage = new ResultField();
        resultFieldMessage.setField(MESSAGE_FIELD_NAME);
        resultFieldMessage.setValue(DUMMY_LOG_MESSAGE);
        ResultField resultFieldPtr = new ResultField();
        resultFieldPtr.setField(PTR_FIELD_NAME);
        resultFieldPtr.setValue(DUMMY_PTR_FIELD_VALUE);

        resultFieldList.add(TIMESTAMP_FIELD_INDEX, resultFieldTimestamp);
        resultFieldList.add(LOG_FIELD_INDEX, resultFieldLogSteam);
        resultFieldList.add(MESSAGE_FIELD_INDEX, resultFieldMessage);
        resultFieldList.add(PTR_FIELD_INDEX, resultFieldPtr);

        return  resultFieldList;
    }

    public static List<LogMessage> createLogMessageList() {
        List<LogMessage> logMessages = new ArrayList<>();
        logMessages.add(createValidRequestLogMessage());
        return logMessages;
    }

    public static LogMessage createValidRequestLogMessage() {
        return LogMessage.builder()
                .sourceComponent(DUMMY_SOURCE_COMPONENT)
                .destinationComponent(DUMMY_DESTINATION_COMPONENT)
                .isRequest(DUMMY_LOG_IS_REQUEST_TRUE)
                .messageBody(DUMMY_LOG_MESSAGE)
                .diagramArrowText(DUMMY_LOG_ARROW_TEST)
                .build();
    }

    public static LogMessage createValidResponseLogMessage() {
        return LogMessage.builder()
                .sourceComponent(DUMMY_SOURCE_COMPONENT)
                .destinationComponent(DUMMY_DESTINATION_COMPONENT)
                .isRequest(DUMMY_LOG_IS_REQUEST_FALSE)
                .messageBody(DUMMY_LOG_MESSAGE)
                .diagramArrowText(DUMMY_LOG_ARROW_TEST)
                .build();
    }

    public static LogMessage createInvalidLogMessage() {
        return LogMessage.builder()
                .sourceComponent(DUMMY_SOURCE_COMPONENT)
                .destinationComponent(DUMMY_DESTINATION_COMPONENT)
                .isRequest(DUMMY_LOG_IS_REQUEST_TRUE)
                .messageBody(null)
                .diagramArrowText(null)
                .build();
    }

    public static boolean compereFileContext(String dummyDiagramUmlFileForTestPath, String fileContext) throws IOException {
        List<String> dummyFileContent = Files.readAllLines(Paths.get(dummyDiagramUmlFileForTestPath));
        String[] fileContextAsArray = fileContext.split("\\n");

        return compereStrings(dummyFileContent, fileContextAsArray);
    }

    private static boolean compereStrings(List<String> dummyFileContent, String[] fileContextAsArray) {
        if (dummyFileContent.size() == fileContextAsArray.length) {
            for (int i = 0; i < dummyFileContent.size(); i++) {
                if (!dummyFileContent.get(i).equals(fileContextAsArray[i])) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }
    public static UploadInputForm prepareUploadInputForm(RangeType rangeType){
        return UploadInputForm.builder()
                .configFileName("dummy-config.json")
                .parameters("001811AF6469B23A")
                .searchRange(rangeType == null ? RangeType.LASTHOURS : rangeType)
                .searchLastHours(LAST_HOURS_SEARCH_QUERY)
                .searchBeginPeriod(PERIOD_SEARCH_QUERY_BEGIN) // date format is: MM/dd/yyyy HH:mm:ss
                .searchEndPeriod  (PERIOD_SEARCH_QUERY_END)
                .resultLimit(1)
                .build();
    }

    public static UploadInputForm prepareUploadInputFormWithMissingField(RangeType rangeType, String missingFieldName) throws NoSuchFieldException, IllegalAccessException {
        UploadInputForm uploadInputForm = prepareUploadInputForm(rangeType);
        if (missingFieldName == null){
            return uploadInputForm;
        }
        Field field = UploadInputForm.class.getDeclaredField(missingFieldName);
        field.setAccessible(true);

        if (field.getType().isAssignableFrom(Number.class)){
            field.set(uploadInputForm, NUMBER_EMPTY_VALUE);
        }
        if (field.getType().isAssignableFrom(String.class)){
            field.set(uploadInputForm, STRING_EMPTY_VALUE);
        }
        return uploadInputForm;
    }

    public static LinkedMultiValueMap<String, String> createUploadInputFormParam() {
        LinkedMultiValueMap<String, String> requestParams = new LinkedMultiValueMap<>();
        requestParams.add("configFileName", CONFIG_FILE_FILES_REST_HTTP_REQUEST); //"dummy-config.json");
        requestParams.add("parameters", DUMMY_3_PARAMETERS); //"001811AF6469B23A");
        requestParams.add("searchRange", RangeType.LASTHOURS.toString());
        requestParams.add("searchLastHours", String.valueOf(LAST_HOURS_SEARCH_QUERY));
        requestParams.add("searchBeginPeriod", PERIOD_SEARCH_QUERY_BEGIN);
        requestParams.add("searchEndPeriod", PERIOD_SEARCH_QUERY_END);
        requestParams.add("resultLimit", "1");
        requestParams.add("awsProfile", "cxca-dev-assume");
        requestParams.add("awsRegion", "us-west-2");
        return requestParams;
    }
}
