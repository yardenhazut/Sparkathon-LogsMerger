package flow.logsmerger.test.components.test;

import com.amazonaws.services.logs.AWSLogs;
import com.amazonaws.services.logs.model.StartQueryResult;
import flow.logsmerger.business.logic.flow.LogFlowHandler;
import flow.logsmerger.business.logic.query.broker.CloudWatchQueryBrokerUtils;
import flow.logsmerger.business.logic.utils.LogMessageGenerator;
import flow.logsmerger.business.logic.utils.QueryConvertor;
import flow.logsmerger.test.configuration.TestConfiguration;
import flow.logsmerger.business.logic.diagrams.SequenceDiagramGenerator;
import flow.logsmerger.controllers.LogsMergerController;
import flow.logsmerger.controllers.FlowVisualizationServiceImpl;
import org.junit.jupiter.api.*;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.util.LinkedMultiValueMap;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import static flow.logsmerger.test.utils.Utils.*;
import static org.junit.Assert.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

@SpringBootTest(classes = TestConfiguration.class, properties = "spring.profiles.active=tests")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@Import({FlowVisualizationServiceImpl.class, LogsMergerController.class, LogFlowHandler.class, QueryConvertor.class, LogMessageGenerator.class})
public class ComponentTest {
    @Autowired
    private LogsMergerController flowVisualizationController;

    @Autowired
    private AWSLogs awsLogsMock;

    @Autowired
    private SequenceDiagramGenerator sequenceDiagramGenerator;

    CloudWatchQueryBrokerUtils cloudWatchQueryBrokerUtils;
    MockedStatic<CloudWatchQueryBrokerUtils> cloudWatchQueryBrokerUtilsMockedStatic;
    private MockMvc mockMvc;
    private static LinkedMultiValueMap<String, String> requestParams;

    @BeforeAll
    public static void before(){
        requestParams = createUploadInputFormParam();
    }

    @BeforeEach
    public void init() {
        mockMvc = MockMvcBuilders.standaloneSetup(flowVisualizationController).build();
        cloudWatchQueryBrokerUtils = Mockito.mock(CloudWatchQueryBrokerUtils.class);
        cloudWatchQueryBrokerUtilsMockedStatic = Mockito.mockStatic(CloudWatchQueryBrokerUtils.class);

        when(CloudWatchQueryBrokerUtils.createAwsLogsClient()).thenReturn(awsLogsMock);
        when(awsLogsMock.startQuery(any())).thenReturn(new StartQueryResult());
        when(awsLogsMock.getQueryResults(any())).thenReturn(createGetQueryResultsResult());
    }

    @Test
    public void flowVisualizationWithQuerySearchLastHoursTimeTest() throws Exception {
        requestParams.set(PARAMETERS_FILES_REST_HTTP_REQUEST, DUMMY_3_PARAMETERS);
        requestParams.set(CONFIG_FILE_FILES_REST_HTTP_REQUEST, CONFIG_FILE_LAST_HOURS_SEARCH_QUERY);

        //act
        MvcResult mvcResult = mockMvc.perform(post(FLOW_VISUALIZATION_URL)
                                     .params(requestParams)).andReturn();
        String uml = sequenceDiagramGenerator.getUmlBuilder().toString();
        Path diagramFile = Paths.get(sequenceDiagramGenerator.getOutputFolderPath() + DUMMY_DIAGRAM_PNG_FILE_NAME);
        HttpStatus httpStatus = HttpStatus.valueOf(mvcResult.getResponse().getStatus());

        //assert
        assertTrue(httpStatus.is2xxSuccessful());
        assertTrue(Files.exists(diagramFile));
        assertTrue(Files.size(diagramFile) > 0);
        assertTrue(compereFileContext(DUMMY_DIAGRAM_UML_TXT_FILE_NAME, uml));
    }

    @Test
    public void flowVisualizationWithQuerySearchPeriodTimeTest() throws Exception {
        requestParams.set(PARAMETERS_FILES_REST_HTTP_REQUEST, DUMMY_3_PARAMETERS);
        requestParams.set(CONFIG_FILE_FILES_REST_HTTP_REQUEST, CONFIG_FILE_PERIOD_SEARCH_QUERY);

        //act
        MvcResult mvcResult = mockMvc.perform(post(FLOW_VISUALIZATION_URL)
                                     .params(requestParams)).andReturn();
        String uml = sequenceDiagramGenerator.getUmlBuilder().toString();
        Path diagramFile = Paths.get(sequenceDiagramGenerator.getOutputFolderPath() + DUMMY_DIAGRAM_PNG_FILE_NAME);
        HttpStatus httpStatus = HttpStatus.valueOf(mvcResult.getResponse().getStatus());

        //assert
        assertTrue(httpStatus.is2xxSuccessful());
        assertTrue(Files.exists(diagramFile));
        assertTrue(Files.size(diagramFile) > 0);
        assertTrue(compereFileContext(DUMMY_DIAGRAM_UML_TXT_FILE_NAME, uml));
    }

    @AfterEach
    public void reset() {
        cloudWatchQueryBrokerUtilsMockedStatic.close();
    }
}
