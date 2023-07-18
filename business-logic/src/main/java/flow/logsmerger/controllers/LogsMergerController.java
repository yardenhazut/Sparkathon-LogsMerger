package flow.logsmerger.controllers;

import flow.logsmerger.business.logic.exceptions.FlowVisualizationErrorException;
import flow.logsmerger.business.logic.exceptions.InvalidRestRequestParamException;
import flow.logsmerger.business.logic.exceptions.LoadFlowConfigException;
import flow.logsmerger.business.logic.models.Request;
import flow.logsmerger.business.logic.models.UploadInputForm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.FileNotFoundException;
import java.util.List;


@RestController
@RequestMapping("/flow-visualization")
public class LogsMergerController {

    @Autowired
    private LogsMergerService logsMergerService;
    private static final Logger logger = LoggerFactory.getLogger(LogsMergerController.class);

    @PostMapping("/search")
    @CrossOrigin(origins = "*")
    public ResponseEntity<LogResults> validateFlow(@RequestBody UploadInputForm uploadInput) {
        try {
            LogResults result = new LogResults(logsMergerService.validateFlow(uploadInput));

            return ResponseEntity.ok().body(result);

        } catch (LoadFlowConfigException e) {
            e.printStackTrace();
        } catch (InvalidRestRequestParamException e) {
            e.printStackTrace();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (FlowVisualizationErrorException e) {
            e.printStackTrace();
        }
        return null;
    }
}
