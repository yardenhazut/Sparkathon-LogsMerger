package flow.logsmerger.business.logic.exceptions;

public class CreateOutputFolderException extends Exception {
    public CreateOutputFolderException(String folderName) {
        super("An error occurred during creating output folder:[" + folderName + "]");
    }

}
