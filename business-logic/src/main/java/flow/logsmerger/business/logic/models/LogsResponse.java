package flow.logsmerger.business.logic.models;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LogsResponse {
    public String timestamp;
    public String logGroup;
    public String message;
    public String fgroup;
}
