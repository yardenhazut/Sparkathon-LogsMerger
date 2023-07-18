package flow.logsmerger.business.logic.flow;

import com.amazonaws.services.logs.model.GetQueryResultsResult;
import com.amazonaws.services.logs.model.ResultField;
import flow.logsmerger.business.logic.config.ConfigLoader;
import flow.logsmerger.business.logic.config.FlowConfig;
import flow.logsmerger.business.logic.models.UploadInputForm;
import flow.logsmerger.business.logic.query.broker.QueryBroker;
import flow.logsmerger.business.logic.query.broker.QueryBrokerFactory;
import flow.logsmerger.business.logic.utils.QueryConvertor;
import flow.logsmerger.business.logic.utils.Utils;
import flow.logsmerger.business.logic.exceptions.AwsClientLoginException;
import flow.logsmerger.business.logic.exceptions.CloudWatchQueryBrokerException;
import flow.logsmerger.business.logic.exceptions.FlowVisualizationErrorException;
import flow.logsmerger.business.logic.exceptions.GetQueryBrokerException;
import flow.logsmerger.business.logic.diagrams.DiagramGenerator;
import flow.logsmerger.business.logic.exceptions.ValidateFlowConfigException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LogFlowHandler {
    @Autowired
    private ConfigLoader configLoader;

    @Autowired
    private DiagramGenerator diagramGenerator;

    @Autowired
    private QueryConvertor queryConvertor;

    private static final Logger logger = LoggerFactory.getLogger(LogFlowHandler.class);

    public List<List<ResultField>> runFlow(String configFile, UploadInputForm uploadInput, String searchParameters) throws FlowVisualizationErrorException {
        try {
            logger.info("runFlow() - configFile:" + configFile + ", uploadInput:" + uploadInput + ", searchParameters:" + searchParameters);
            FlowConfig flowConfig = this.configLoader.loadConfig(configFile, uploadInput);
            QueryBroker queryBroker = QueryBrokerFactory.getQueryBroker(Utils.AWS_LOGS_PLATFORM, flowConfig, queryConvertor);
            GetQueryResultsResult getQueryResultsResult = queryBroker.runQuery(searchParameters);
            return getQueryResultsResult.getResults();
//            List<String> stringLogMessages = logsMessages.get().stream().map(LogMessage::getMessageBody).collect(Collectors.toList());
//            if (logsMessages.isPresent()) {
//                return stringLogMessages;
//            } else {
//                String msg = "runFlow() - no log messages that match the config file rules and input parameters were found while running AWS query";
//                logger.error(msg);
//                throw new FlowVisualizationErrorException(msg);
//            }
        } catch (GetQueryBrokerException | ValidateFlowConfigException | CloudWatchQueryBrokerException | AwsClientLoginException e) {
            logger.error(e.getMessage());
            throw new FlowVisualizationErrorException(e.getMessage());
        }
    }
}
