package flow.logsmerger.business.logic.models;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UploadInputForm {

    @ToString.Exclude private MultipartFile configFile;
    private String configFileName;
    private String tmltConfigFileName;

    private String parameters;

    private Integer searchLastHours;
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