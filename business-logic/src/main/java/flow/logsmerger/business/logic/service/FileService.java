package flow.logsmerger.business.logic.service;

import flow.logsmerger.business.logic.models.UploadInputForm;

import javax.servlet.http.HttpServletResponse;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Set;

public interface FileService {

	void uploadConfigFile(UploadInputForm uploadInput);
	Set<String> listConfigFiles(UploadInputForm uploadInput) throws IOException;
	InputStream downloadConfigFile(UploadInputForm uploadInput, HttpServletResponse response) throws IOException;
    boolean deleteConfigFile(UploadInputForm uploadInput, HttpServletResponse response) throws FileNotFoundException;
}
