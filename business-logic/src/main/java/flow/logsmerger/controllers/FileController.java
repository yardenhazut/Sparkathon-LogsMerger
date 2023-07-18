package flow.logsmerger.controllers;

import flow.logsmerger.business.logic.models.UploadInputForm;
import flow.logsmerger.business.logic.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.IOException;
import java.io.InputStream;
import java.util.Set;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@RestController
@RequestMapping(value = "/flow-visualization")
public class FileController {
    private static final Logger logger = LogManager.getLogger(FileController.class);
    @Autowired
    private FileService fileService;

    @PostMapping(value = "/upload", produces = "application/json; charset=utf-8")
    public @ResponseBody ResponseEntity<Set<String>> uploadConfig(UploadInputForm uploadInput,
                                                                  RedirectAttributes redirectAttributes,
                                                                  HttpServletRequest request) throws IOException {
        logger.debug("uploadConfig() -  in.");
        if (uploadInput.getConfigFile().isEmpty()) {
            redirectAttributes.addFlashAttribute("message", "Please select a file to upload1");
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .contentType(MediaType.TEXT_HTML)
                    .body(null);
        }

        fileService.uploadConfigFile(uploadInput);
        return listConfigFiles(uploadInput);
    }

    @RequestMapping(value = "/pass", method = RequestMethod.POST, produces = "application/json; charset=utf-8")
    public @ResponseBody ResponseEntity<Boolean> pass(@RequestBody String pass) throws IOException {
        boolean cond = "10ligisha".equals(pass);
        return !cond ? ResponseEntity.status(HttpStatus.CONFLICT).build() : ResponseEntity.status(HttpStatus.OK).build();
    }

    @RequestMapping(value = "/list", method = RequestMethod.POST, produces = "application/json; charset=utf-8")
    public @ResponseBody ResponseEntity<Set<String>> listConfigFiles(UploadInputForm uploadInput) throws IOException {
        Set<String> set = fileService.listConfigFiles(uploadInput);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(set);
    }

    @PostMapping("/download")
    @ResponseBody
    public ResponseEntity<InputStreamResource> downloadConfig(UploadInputForm uploadInput, HttpServletResponse response) throws IOException {

        InputStream in = fileService.downloadConfigFile(uploadInput, response);
        MediaType contentType = MediaType.parseMediaType(response.getContentType());
        return ResponseEntity.ok()
                .contentType(contentType)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\""
                        + (uploadInput.getUserFolder() != null && !uploadInput.getUserFolder().isEmpty() ? uploadInput.getTmltConfigFileName() : uploadInput.getConfigFileName().trim())
                        +  "\"")
                .body(new InputStreamResource(in));
    }

    @PostMapping("/delete")
    @ResponseBody
    public ResponseEntity<Void> deleteConfig(UploadInputForm uploadInput, HttpServletResponse response) throws IOException {

        boolean status = fileService.deleteConfigFile(uploadInput, response);

        return (status == true ? ResponseEntity.ok() : ResponseEntity.status(409))
                .build();
    }
}
