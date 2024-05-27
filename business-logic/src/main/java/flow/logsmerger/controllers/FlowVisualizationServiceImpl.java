package flow.logsmerger.controllers;

import com.amazonaws.services.logs.model.ResultField;
import flow.logsmerger.business.logic.flow.LogFlowHandler;
import flow.logsmerger.business.logic.models.LogsResponse;
import flow.logsmerger.business.logic.models.UploadInputForm;
import flow.logsmerger.business.logic.utils.Utils;
import flow.logsmerger.business.logic.exceptions.FlowVisualizationErrorException;
import flow.logsmerger.business.logic.exceptions.InvalidRestRequestParamException;
import flow.logsmerger.business.logic.exceptions.LoadFlowConfigException;
import flow.logsmerger.business.logic.service.impl.ServiceBase;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.FileNotFoundException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FlowVisualizationServiceImpl extends ServiceBase implements LogsMergerService {
    @Autowired
    private LogFlowHandler logFlowHandler;
    private static final Logger logger = LoggerFactory.getLogger(FlowVisualizationServiceImpl.class);

    public List<LogsResponse> validateFlow(UploadInputForm uploadInput) throws LoadFlowConfigException, InvalidRestRequestParamException, FileNotFoundException, FlowVisualizationErrorException {
        logger.info("validateFlow() - Got user (ui) configuration:" + uploadInput);
        String configFile = "dummy_dev-visualization.json";
        String parameters = uploadInput.getParameters();

        //validateConfigFileParameter(configFile);
        String searchParameters = getSearchParameters(parameters);
        logger.info("validateFlow() -  parameters:" + parameters, ", searchParameters:" + searchParameters);

        List<List<ResultField>> logResults = logFlowHandler.runFlow(configFile, uploadInput, searchParameters);
        return logResults.stream().map(this::getLogResponse).collect(Collectors.toList());
    }

    private LogsResponse getLogResponse(List<ResultField> list){
        LogsResponse logResponse = new LogsResponse();
        logResponse.setTimestamp(list.get(0).getValue());
        String fullLogGroup = list.get(1).getValue();
        logResponse.setLogGroup(fullLogGroup.substring(fullLogGroup.indexOf(":") +1 ));
        logResponse.setMessage(list.get(2).getValue());
        String stream = list.get(3).getValue();
        logResponse.setFgroup(stream.substring(stream.indexOf("/") +1));
        return logResponse;
    }

    private String getSearchParameters(String parameters) throws InvalidRestRequestParamException {
        if (parameters == null ) {
            throw new InvalidRestRequestParamException("Empty parameters provided.");
        }

        String[] splitParameters = parameters.split(Utils.PARAMETERS_SEPARATOR);
        StringBuilder searchParameters = new StringBuilder();

        logger.info("try to get search parameters from the request");
        if (splitParameters.length > Utils.MAX_PARAMETERS || splitParameters.length < Utils.MIN_PARAMETERS) {
            throw new InvalidRestRequestParamException(String.format("number of parameters provided is %d, but should be between %d and %d", splitParameters.length, Utils.MAX_PARAMETERS, Utils.MIN_PARAMETERS));
        }

        for (String param : splitParameters) {
            searchParameters.append(param);
            searchParameters.append(Utils.SEARCH_PARAMETERS_SEPARATOR);
        }
        searchParameters.deleteCharAt(searchParameters.length() - 1);

        logger.info("got all the search parameters from the request");
        return searchParameters.toString();
    }
}
