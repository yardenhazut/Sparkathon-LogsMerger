package flow.logsmerger.controllers;

import lombok.Getter;

import java.util.List;
@Getter
public class LogResults {
    List<String> logRows;

    public LogResults(List<String> logRows) {
        this.logRows = logRows;
    }
}
