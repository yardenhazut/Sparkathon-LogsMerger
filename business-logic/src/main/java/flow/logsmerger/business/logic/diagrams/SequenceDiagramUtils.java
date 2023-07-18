package flow.logsmerger.business.logic.diagrams;

public class SequenceDiagramUtils {
    private SequenceDiagramUtils() {}

    public static final String UML_START = "@startuml\n";
    public static final String UML_STYLE =
            "skinparam defaultFontSize 14\n" +
                    "skinparam ParticipantFontSize 14\n" +
                    "skinparam ArrowFontSize 13\n" +
                    "skinparam NoteBackgroundColor #gold\n\n";

    public static final String UML_TITLE = "title Flow Diagram\n";
    public static final String UML_FOOTER = "footer ";
    public static final String UML_PARAM_HEADER = "Param ";
    public static final String UML_FOOTER_SEPARATOR = "\\n";
    public static final String UML_END_FOOTER = "\n";
    public static final String UML_FOOTER_COLOR_PATTERN = " (%s): ";
    public static final String UML_COLOR_RED = "red";
    public static final String UML_COLOR_BLUE = "blue";
    public static final String UML_COLOR_GREEN = "green";
    public static final String UML_COLOR_DEFAULT = "black";
    private static final String[] UML_PARAMETERS_COLORS = new String[]{UML_COLOR_GREEN, UML_COLOR_RED, UML_COLOR_BLUE};
    public static final String UML_FOOTER_4_PARAMETERS = "footer Param 1 (green): %s\\nParam 2 (red): %s\\nParam 3 (blue): %s\\nParam 4 (black): %s\n";
    public static final String UML_FOOTER_3_PARAMETERS = "footer Param 1 (green): %s\\nParam 2 (red): %s\\nParam 3 (blue): %s\n";
    public static final String UML_FOOTER_2_PARAMETERS = "footer Param 1 (green): %s\\nParam 2 (red): %s\n";
    public static final String UML_END = "@enduml\n";
    public static final String UML_MESSAGE_REQ_RED = "\"%s\"->\"%s\":%s\n";
    public static final String UML_MESSAGE_RES_RED = "\"%s\"-->\"%s\":%s\n";
    public static final String UML_MESSAGE_PREFIX = "\"%s\"-[#";
    public static final String UML_REQUEST_MESSAGE_POSTFIX = "]>\"%s\":%s\n";
    public static final String UML_RESPONSE_MESSAGE_POSTFIX = "]->\"%s\":%s\n";
    public static final String UML_MESSAGE_REQ_BLUE = UML_MESSAGE_PREFIX + UML_COLOR_BLUE + UML_REQUEST_MESSAGE_POSTFIX;
    public static final String UML_MESSAGE_RES_BLUE = UML_MESSAGE_PREFIX + UML_COLOR_BLUE + UML_RESPONSE_MESSAGE_POSTFIX;
    public static final String UML_MESSAGE_REQ_GREEN = UML_MESSAGE_PREFIX + UML_COLOR_GREEN + UML_REQUEST_MESSAGE_POSTFIX;
    public static final String UML_MESSAGE_RES_GREEN = UML_MESSAGE_PREFIX + UML_COLOR_GREEN + UML_RESPONSE_MESSAGE_POSTFIX;
    public static final String UML_MESSAGE_REQ_DEFAULT = UML_MESSAGE_PREFIX + UML_COLOR_DEFAULT + UML_REQUEST_MESSAGE_POSTFIX;
    public static final String UML_MESSAGE_RES_DEFAULT = UML_MESSAGE_PREFIX + UML_COLOR_DEFAULT + UML_RESPONSE_MESSAGE_POSTFIX;
    public static final String IMAGE_PATH = "flowDiagram_%s.png";
    public static String[] getUmlParametersColors() { return UML_PARAMETERS_COLORS; }
}
