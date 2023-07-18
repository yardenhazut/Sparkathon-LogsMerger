package flow.logsmerger.business.logic.diagrams;

import flow.logsmerger.business.logic.exceptions.CreateOutputFolderException;
import flow.logsmerger.business.logic.exceptions.DiagramGenerationException;
import flow.logsmerger.business.logic.exceptions.GenerateUmlRowException;
import flow.logsmerger.business.logic.exceptions.NoDiagramLogMessagesException;
import flow.logsmerger.business.logic.models.LogMessage;
import flow.logsmerger.business.logic.models.UmlRow;
import flow.logsmerger.business.logic.utils.Utils;
import lombok.Getter;
import net.sourceforge.plantuml.SourceStringReader;
import net.sourceforge.plantuml.security.SFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.function.Function;

import static flow.logsmerger.business.logic.diagrams.SequenceDiagramUtils.IMAGE_PATH;
import static flow.logsmerger.business.logic.diagrams.SequenceDiagramUtils.UML_COLOR_DEFAULT;
import static flow.logsmerger.business.logic.diagrams.SequenceDiagramUtils.UML_END;
import static flow.logsmerger.business.logic.diagrams.SequenceDiagramUtils.UML_END_FOOTER;
import static flow.logsmerger.business.logic.diagrams.SequenceDiagramUtils.UML_FOOTER;
import static flow.logsmerger.business.logic.diagrams.SequenceDiagramUtils.UML_FOOTER_COLOR_PATTERN;
import static flow.logsmerger.business.logic.diagrams.SequenceDiagramUtils.UML_FOOTER_SEPARATOR;
import static flow.logsmerger.business.logic.diagrams.SequenceDiagramUtils.UML_PARAM_HEADER;
import static flow.logsmerger.business.logic.diagrams.SequenceDiagramUtils.UML_START;
import static flow.logsmerger.business.logic.diagrams.SequenceDiagramUtils.UML_STYLE;
import static flow.logsmerger.business.logic.diagrams.SequenceDiagramUtils.UML_TITLE;
import static flow.logsmerger.business.logic.diagrams.SequenceDiagramUtils.getUmlParametersColors;

@Getter
public class SequenceDiagramGenerator implements DiagramGenerator {
    private static final Logger logger = LoggerFactory.getLogger(SequenceDiagramGenerator.class);
    private StringBuilder umlBuilder;
    private final String outputFolderPath;
    public SequenceDiagramGenerator(String outputFolderPath) {
        this.outputFolderPath = outputFolderPath;
    }

    private static Function<String, String> replacer = s -> s.replaceAll("[~#%&{}()\\<>*?/$!'\\:@+`|=\"\\[\\]\\\\^]", "");
    @Override
    public String generateDiagram(List<LogMessage> messages, String unsplitedParameters) throws DiagramGenerationException {
        try {
            String[] parameters = unsplitedParameters.split(Utils.LOG_PARAMETERS_SEPARATOR);
            umlBuilder = new StringBuilder();

            logger.info("start generating the diagram");
            umlBuilder.append(UML_START);
            umlBuilder.append(UML_STYLE);
            umlBuilder.append(UML_TITLE);

            addLogMessagesToUml(messages, parameters);
            setDiagramFooter(parameters);
            umlBuilder.append(UML_END);

            return generateDiagramImageFromUml(parameters);
        } catch (IOException | CreateOutputFolderException | NoDiagramLogMessagesException e) {
            throw new DiagramGenerationException(e.getMessage());
        }
    }

    private void addLogMessagesToUml(List<LogMessage> messages, String[] parameters) throws NoDiagramLogMessagesException {
        StringBuilder logMessagesBuilder = buildUmlLogMessages(messages, parameters);

        if (logMessagesBuilder.length() == 0) {
            throw new NoDiagramLogMessagesException("there are no log messages that match the config file rules.");
        } else {
            this.umlBuilder.append(logMessagesBuilder);
        }
    }

    private StringBuilder buildUmlLogMessages(List<LogMessage> messages, String[] parameters) {
        StringBuilder logMessagesBuilder = new StringBuilder();

        for (LogMessage logMessage : messages) {
            String umlRow = createUmlForLogMessage(logMessage, parameters);
            if (umlRow != null) {
                logMessagesBuilder.append(umlRow);
            }
        }

        return logMessagesBuilder;
    }

    private String createUmlForLogMessage(LogMessage message, String[] parameters) {
        try {
            UmlRow umlRow = new UmlRow();
            umlRow.setUmlArrowsColors(message, parameters);

            return umlRow.generateUmlRow(message);
        } catch (GenerateUmlRowException e) {
            logger.error(e.getMessage());
            return null;
        }
    }

    private void setDiagramFooter(String[] logParameters) {
        StringBuilder footer = new StringBuilder();
        footer.append(UML_FOOTER);

        for(int i = 0; i < logParameters.length; i++) {
            footer.append(UML_PARAM_HEADER).append(i + 1);

            if (i < getUmlParametersColors().length) {
                footer.append(String.format(UML_FOOTER_COLOR_PATTERN, getUmlParametersColors()[i]));
            } else {
                footer.append(String.format(UML_FOOTER_COLOR_PATTERN, UML_COLOR_DEFAULT));
            }

            footer.append(logParameters[i]);

            if (i == logParameters.length - 1) {
                footer.append(UML_END_FOOTER);
            } else {
                footer.append(UML_FOOTER_SEPARATOR);
            }
        }

        this.umlBuilder.append(footer);
    }
    private String  generateDiagramImageFromUml(String[] parameters) throws IOException, CreateOutputFolderException {
        createOutputDirectory();
        File outputFile = new File(String.format(outputFolderPath + IMAGE_PATH, replacer.apply(parameters[0])));
        SourceStringReader reader = new SourceStringReader(this.umlBuilder.toString());
        reader.outputImage(SFile.fromFile(outputFile));
        logger.info("Diagram UML: \n {} \n Diagram generated on path: {}", this.umlBuilder, outputFile.getAbsolutePath());
        return outputFile.getAbsolutePath();
    }
    private void createOutputDirectory() throws CreateOutputFolderException {
        File directory = new File(outputFolderPath);

        if (!directory.exists()) {
            logger.info("The folder '{}' does not exist. Creating the folder", outputFolderPath);
            boolean createDirectory = directory.mkdir();
            if (!createDirectory) {
                throw new CreateOutputFolderException(outputFolderPath);
            }

            logger.info("The folder '{}' created", outputFolderPath);
        }
    }
}
