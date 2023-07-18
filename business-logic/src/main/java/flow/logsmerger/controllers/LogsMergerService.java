package flow.logsmerger.controllers;

import flow.logsmerger.business.logic.models.LogsResponse;
import flow.logsmerger.business.logic.models.UploadInputForm;
import flow.logsmerger.business.logic.exceptions.FlowVisualizationErrorException;
import flow.logsmerger.business.logic.exceptions.InvalidRestRequestParamException;
import flow.logsmerger.business.logic.exceptions.LoadFlowConfigException;

import java.io.FileNotFoundException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.function.Function;

public interface LogsMergerService {
    List<LogsResponse> validateFlow(UploadInputForm uploadInput) throws LoadFlowConfigException, InvalidRestRequestParamException, FileNotFoundException, FlowVisualizationErrorException;
    Function<String, Path> getFileNameFromPath = s-> Paths.get(s).getFileName(); // to be used with HttpHeaders.CONTENT_DISPOSITION header in controller (it is currently commented out).
}
