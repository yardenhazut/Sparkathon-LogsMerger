package flow.logsmerger.controllers;

import com.amazonaws.services.logs.model.ResultField;
import flow.logsmerger.business.logic.exceptions.FlowVisualizationErrorException;
import flow.logsmerger.business.logic.exceptions.InvalidRestRequestParamException;
import flow.logsmerger.business.logic.exceptions.LoadFlowConfigException;
import flow.logsmerger.business.logic.models.LogsResponse;
import flow.logsmerger.business.logic.models.UploadInputForm;
import org.apache.catalina.authenticator.SavedRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.FileNotFoundException;
import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/flow-visualization")
public class LogsMergerController {

    @Autowired
    private FileConversionService fileConversionService;

    @Autowired
    private LogsMergerService logsMergerService;
    private static final Logger logger = LoggerFactory.getLogger(LogsMergerController.class);

    @PostMapping("/search")
    @CrossOrigin(origins = "*")
    public ResponseEntity<List<LogsResponse>> validateFlow(@RequestBody UploadInputForm uploadInput) {
        try {
         //   LogResults result = new LogResults(logsMergerService.validateFlow(uploadInput));

            return ResponseEntity.ok().body(logsMergerService.validateFlow(uploadInput));

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

    @PostMapping("/save")
    public ResponseEntity<?> convertData(@RequestBody SaveRequest saveRequest) {
        try {
            List<String> data = saveRequest.getLogRows().stream().map(i -> i.getLogGroup() + " | " + i.getMessage()).collect(Collectors.toList());
            if (Formats.PDF.toString().equalsIgnoreCase(saveRequest.getDesiredFormat().toString())) {
                byte[] pdfData = fileConversionService.createPdf(data);
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_PDF);
                headers.setContentDispositionFormData("attachment", "output.pdf");
                return new ResponseEntity<>(pdfData, headers, HttpStatus.OK);
            } else if (Formats.JSON.toString().equalsIgnoreCase(saveRequest.getDesiredFormat().toString())) {
                return new ResponseEntity<>(data, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Invalid output type. Please provide either 'pdf' or 'json'.", HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

//    @PostMapping("/save")
//    @CrossOrigin(origins = "*")
//    public ResponseEntity<List<LogsResponse>> saveToFile(@RequestBody SaveRequest saveRequest) {
//        try {
//            //   LogResults result = new LogResults(logsMergerService.validateFlow(uploadInput));
//
//            return ResponseEntity.ok().body(logsMergerService.validateFlow(uploadInput));
//
//        } catch (LoadFlowConfigException e) {
//            e.printStackTrace();
//        } catch (InvalidRestRequestParamException e) {
//            e.printStackTrace();
//        } catch (FileNotFoundException e) {
//            e.printStackTrace();
//        } catch (FlowVisualizationErrorException e) {
//            e.printStackTrace();
//        }
//        return null;
//    }


}
