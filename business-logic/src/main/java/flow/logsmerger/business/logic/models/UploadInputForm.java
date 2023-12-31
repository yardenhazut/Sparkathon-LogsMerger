package flow.logsmerger.business.logic.models;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UploadInputForm {

    @ToString.Exclude private MultipartFile configFile;
    private String configFileName;
    private List<String> logGroups;
    private String tmltConfigFileName;

    private String parameters;

    private Integer searchLastHours;
    private Integer searchLastMinutes;
    private String searchBeginPeriod;
    private String searchEndPeriod;
    private RangeType searchRange;
    private Integer resultLimit;

    @Getter(AccessLevel.NONE)
    private String userFolder;

    public String getUserFolder() {
        return userFolder != null ? userFolder.trim() : "";
    }
}