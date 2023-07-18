package flow.logsmerger.business.logic.query.broker;

import flow.logsmerger.business.logic.models.LogMessage;
import flow.logsmerger.business.logic.exceptions.CloudWatchQueryBrokerException;

import java.util.List;
import java.util.Optional;

public interface QueryBroker {
    Optional<List<LogMessage>> runQuery(String searchParameters) throws CloudWatchQueryBrokerException;
}
