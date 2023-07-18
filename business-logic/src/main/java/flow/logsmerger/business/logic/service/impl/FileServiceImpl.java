package flow.logsmerger.business.logic.service.impl;

import flow.logsmerger.business.logic.models.UploadInputForm;
import flow.logsmerger.business.logic.service.FileService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URLConnection;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class FileServiceImpl extends ServiceBase implements FileService {

    private static final Logger logger = LogManager.getLogger(FileServiceImpl.class);

    public void uploadConfigFile(UploadInputForm uploadInput) {
        try {
            byte[] bytes = uploadInput.getConfigFile().getBytes();

            String origFileName = uploadInput.getConfigFile().getOriginalFilename();

            String userFolder = uploadInput.getUserFolder();
            String filesFolder = determineConfigFolder(userFolder);
            logger.debug("uploadConfigFile() - Folder:[" + filesFolder + "]");

            Path userFolderPath = Paths.get(filesFolder);

            if (!Files.exists(userFolderPath)) {
                logger.debug("uploadConfigFile() - Folder:[" + filesFolder + "] does not exist, creating.");
                Files.createDirectory(userFolderPath);
            }

            logger.debug("uploadConfigFile() - saving File Name:[" + origFileName + "]");
            Path path = Paths.get(userFolderPath + File.separator + origFileName);
            Files.write(path, bytes);
            logger.debug("uploadConfigFile() - filenName:[" + path.getFileName() + "] is loaded.");
        } catch (IOException e) {
            logger.error("uploadConfigFile() - exception:[" + e.getMessage() + "]", e);
        }
    }

    public Set<String> listConfigFiles(UploadInputForm uploadInput) throws IOException {
        String userFolder = uploadInput.getUserFolder();
        String filesFolder = determineConfigFolder(userFolder);
        logger.debug("list() - userFolder:[" + filesFolder + "]");

        Path userFolderPath = Paths.get(filesFolder);
        if (!Files.exists(userFolderPath)) {
            logger.debug("listConfigFiles() - Folder:[" + filesFolder + "] does not exist, creating.");
            Files.createDirectory(userFolderPath);
        }


        return listFilesUsingFilesList(filesFolder);
    }

    private File composeFileHandlerFromInput(UploadInputForm uploadInput) throws FileNotFoundException {
        Path userFolderPath = getConfigFilePath(uploadInput);
        Path path = Paths.get(userFolderPath + "/"
                + (uploadInput.getUserFolder() != null && !uploadInput.getUserFolder().isEmpty() ? uploadInput.getTmltConfigFileName() : uploadInput.getConfigFileName().trim()));
        File file = path.toFile();
        return file;
    }

    @Override
    public InputStream downloadConfigFile(UploadInputForm uploadInput, HttpServletResponse response) throws IOException {
        File file = composeFileHandlerFromInput(uploadInput);
        if (file.exists()) {
            setMimeType(response, file);
            InputStream in = new BufferedInputStream(new FileInputStream(file));
            return in;
        }
        throw new FileNotFoundException("File:[" + file.getName() + "] does not exist.");
    }

    @Override
    public boolean deleteConfigFile(UploadInputForm uploadInput, HttpServletResponse response) throws FileNotFoundException {
        File file = composeFileHandlerFromInput(uploadInput);
        if (file.exists()) {
            return file.delete();
        }
        throw new FileNotFoundException("File:[" + file.getName() + "] does not exist.");
    }

    private Path getConfigFilePath(UploadInputForm uploadInput) throws FileNotFoundException {
        String userFolder = determineConfigFolder(uploadInput.getUserFolder());

        Path userFolderPath = Paths.get(userFolder);

        if (!Files.exists(userFolderPath)) {
            String message = "getConfigFilePath() - userFolder:[" + userFolder + "] does not exist.";
            logger.debug(message);
            throw new FileNotFoundException(message);
        }

        logger.debug("getConfigFilePath() - userFolderPath:[" + userFolderPath + "]");
        return userFolderPath;
    }

    private void setMimeType(HttpServletResponse response, File file) {
        String mimeType = URLConnection.guessContentTypeFromName(file.getName());
        if (mimeType == null) {
            mimeType = "application/octet-stream";
        }
        response.setContentType(mimeType);
    }

    private Set<String> listFilesUsingFilesList(String dir) throws IOException {
        try (Stream<Path> stream = Files.list(Paths.get(dir))) {
            return stream
                    .filter(file -> !Files.isDirectory(file))
                    .map(Path::getFileName)
                    .map(Path::toString)
                    .collect(Collectors.toSet());
        }
    }
}