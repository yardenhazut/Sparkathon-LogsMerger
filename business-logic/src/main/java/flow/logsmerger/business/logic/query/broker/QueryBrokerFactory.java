package flow.logsmerger.business.logic.query.broker;

import flow.logsmerger.business.logic.config.FlowConfig;
import flow.logsmerger.business.logic.utils.QueryConvertor;
import flow.logsmerger.business.logic.utils.Utils;
import flow.logsmerger.business.logic.exceptions.AwsClientLoginException;
import flow.logsmerger.business.logic.exceptions.GetQueryBrokerException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class QueryBrokerFactory {
    private static final Logger logger = LoggerFactory.getLogger(QueryBrokerFactory.class);

    private QueryBrokerFactory() {}

    public static QueryBroker getQueryBroker(String queryBrokerPlatform, FlowConfig flowConfig, QueryConvertor queryConvertor) throws GetQueryBrokerException, AwsClientLoginException {
        if (!queryBrokerPlatform.equals(Utils.AWS_LOGS_PLATFORM)) {
            logger.error("An error occurred during trying to get query broker for the selected logs platform");
            throw new GetQueryBrokerException(queryBrokerPlatform);
        }

        return new CloudWatchQueryBroker(flowConfig, queryConvertor);
    }
}
