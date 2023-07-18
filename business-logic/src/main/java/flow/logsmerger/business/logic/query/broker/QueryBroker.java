package flow.logsmerger.business.logic.query.broker;

import com.amazonaws.services.logs.model.GetQueryResultsResult;
import flow.logsmerger.business.logic.exceptions.CloudWatchQueryBrokerException;

public interface QueryBroker {
    GetQueryResultsResult runQuery(String searchParameters) throws CloudWatchQueryBrokerException;
}
