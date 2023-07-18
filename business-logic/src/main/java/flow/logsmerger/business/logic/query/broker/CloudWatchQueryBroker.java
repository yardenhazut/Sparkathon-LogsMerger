package flow.logsmerger.business.logic.query.broker;

import com.amazonaws.services.logs.AWSLogs;
import com.amazonaws.services.logs.model.GetQueryResultsRequest;
import com.amazonaws.services.logs.model.GetQueryResultsResult;
import com.amazonaws.services.logs.model.ResultField;
import com.amazonaws.services.logs.model.StartQueryRequest;
import com.amazonaws.services.logs.model.StartQueryResult;
import flow.logsmerger.business.logic.config.FlowConfig;
import flow.logsmerger.business.logic.models.LogMessage;
import flow.logsmerger.business.logic.utils.QueryConvertor;
import flow.logsmerger.business.logic.utils.Utils;
import flow.logsmerger.business.logic.exceptions.AwsClientLoginException;
import flow.logsmerger.business.logic.exceptions.CloudWatchQueryBrokerException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static flow.logsmerger.business.logic.query.broker.CloudWatchQueryBrokerUtils.QUERY_PATTERN;
import static flow.logsmerger.business.logic.query.broker.CloudWatchQueryBrokerUtils.createAwsLogsClient;

public class CloudWatchQueryBroker implements QueryBroker {
    private final QueryConvertor queryConvertor;
    private final AWSLogs awsLogs;
    private static final Logger logger = LoggerFactory.getLogger(CloudWatchQueryBroker.class);
    private final FlowConfig flowConfig;

    public CloudWatchQueryBroker(FlowConfig flowConfig, QueryConvertor queryConvertor) throws AwsClientLoginException {
        this.queryConvertor = queryConvertor;
        this.flowConfig = flowConfig;

        try {
            this.awsLogs = createAwsLogsClient();
        } catch (Exception e) {
            logger.error("CloudWatchQueryBroker(CTOR) - Exception:" + e.getMessage() );
            throw new AwsClientLoginException(e.getMessage());
        }
    }

    @Override
    public GetQueryResultsResult runQuery(String searchParameters) throws CloudWatchQueryBrokerException {
        try {
            StartQueryRequest queryRequest = createQueryRequest(this.flowConfig.getLogGroups(), searchParameters);
            logger.info("runQuery() - Created query request: {}", queryRequest.getQueryString());

            logger.info("runQuery() - Start running query");
            StartQueryResult queryResult = awsLogs.startQuery(queryRequest);
            logger.info("runQuery() - Finished running query");
            return getAllQueryResult(queryResult);
            //return getQueryResultAsLogMessages(finalQueryResult);
        } catch (Exception e) {
            logger.error("runQuery() - Exception while running query:" + e.getMessage());
            throw new CloudWatchQueryBrokerException(e.getMessage());
        }
    }

    private StartQueryRequest createQueryRequest(Set<String> logGroups, String searchPattern) {
        logger.info("createQueryRequest() - logGroups: {}, searchPattern: {}", logGroups, searchPattern);
        StartQueryRequest queryRequest = new StartQueryRequest()
                .withLogGroupNames(logGroups)
                .withQueryString(String.format(QUERY_PATTERN, searchPattern, this.flowConfig.getResultLimit()))
                .withLimit(this.flowConfig.getResultLimit());

        if (flowConfig.getSearchRange().equals(QueryTimestamps.PERIOD.toString())) {
            addQuerySearchPeriodTime(queryRequest);
        } else {
            addQuerySearchLastHoursTime(queryRequest);
        }

        return queryRequest;
    }

    private void addQuerySearchPeriodTime(StartQueryRequest queryRequest) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(Utils.QUERY_TIMESTAMPS_PATTERN);
        LocalDateTime begin = LocalDateTime.parse(flowConfig.getSearchBeginPeriod(), formatter);
        LocalDateTime end = LocalDateTime.parse(flowConfig.getSearchEndPeriod(), formatter);
        queryRequest.withStartTime(Timestamp.valueOf(begin).getTime()).withEndTime(Timestamp.valueOf(end).getTime());
    }

    private void addQuerySearchLastHoursTime(StartQueryRequest queryRequest) {
        queryRequest.withStartTime(Timestamp.valueOf(LocalDateTime.now().minusHours(this.flowConfig.getSearchLastHours())).getTime())
                .withEndTime(Timestamp.valueOf(LocalDateTime.now()).getTime());
    }

    private GetQueryResultsResult getAllQueryResult(StartQueryResult startQueryResult) {
        logger.info("Get query results");
        int limitMessages = this.flowConfig.getResultLimit();
        GetQueryResultsRequest getQueryResultsRequest = new GetQueryResultsRequest().withQueryId(startQueryResult.getQueryId());
        GetQueryResultsResult queryResult = awsLogs.getQueryResults(getQueryResultsRequest);

        while (queryResult.getResults().size() < limitMessages && queryResult.getStatus().equals(Utils.UNFINISHED_QUERY_RESULT_STATUS)) {
            queryResult = awsLogs.getQueryResults(getQueryResultsRequest);
            logger.info("Got {} messages, waiting to get additional messages", queryResult.getResults().size());
        }
        logger.info("Messages retrieval finished with {} messages", queryResult.getResults().size());

        return queryResult;
    }

    private Optional<List<LogMessage>> getQueryResultAsLogMessages(GetQueryResultsResult queryResult) {
        List<LogMessage> logMessages = new ArrayList<>();
        List<List<ResultField>> queryResultList = queryResult.getResults();

        if (!queryResultList.isEmpty()) {
            logger.info("getQueryResultAsLogMessages() - Converting query result to log messages");
            convertQueryResultToLogMessages(logMessages, queryResultList);
            logger.info("getQueryResultAsLogMessages() - Found {} messages that match the rules", logMessages.size());
        } else {
            logger.error("getQueryResultAsLogMessages() - No results were found by the query");
        }
        return Optional.of(logMessages);
    }

    private void convertQueryResultToLogMessages(List<LogMessage> logMessages, List<List<ResultField>> queryResultList) {
        for (List<ResultField> field : queryResultList) {
            String logFieldResult = null;
            String messageResult = null;

            for (ResultField resultField: field) {
                if (resultField.getField().equals(Utils.AWS_LOGS_LOG_FIELD_NAME)) {
                    logFieldResult = resultField.getValue();
                } else if (resultField.getField().equals(Utils.AWS_LOGS_MESSAGE_FIELD_NAME)) {
                    messageResult = resultField.getValue();
                }
            }

            if (logFieldResult != null && messageResult != null) {
                queryConvertor.convertQueryResultToLogMessage(this.flowConfig, logFieldResult, messageResult, logMessages);
            }
        }
    }
}
