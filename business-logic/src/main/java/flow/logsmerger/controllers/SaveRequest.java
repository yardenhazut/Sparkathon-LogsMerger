package flow.logsmerger.controllers;

import flow.logsmerger.business.logic.models.LogsResponse;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SaveRequest {
    public List<LogsResponse> logRows;
    public Formats desiredFormat;
    public String query;
}
