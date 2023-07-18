package flow.logsmerger.business.logic.query.broker;

import com.amazonaws.services.logs.AWSLogs;
import com.amazonaws.services.logs.AWSLogsClientBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CloudWatchQueryBrokerUtils {
    private CloudWatchQueryBrokerUtils() {}
    private static final Logger logger = LoggerFactory.getLogger(CloudWatchQueryBrokerUtils.class);

    public static final String QUERY_PATTERN = "fields @timestamp, @log, @message\n" +
            "| filter @message like /%s/\n" +
            "| sort @timestamp asc\n" +
            "| limit %s";

    public static AWSLogs createAwsLogsClient() {
        logger.info("createAwsLogsClient()");
        return AWSLogsClientBuilder.defaultClient();
    }
}
