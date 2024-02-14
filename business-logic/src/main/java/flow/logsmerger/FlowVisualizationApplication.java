package flow.logsmerger;

import flow.logsmerger.controllers.LogsMergerController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import javax.annotation.PostConstruct;

@SpringBootApplication
public class FlowVisualizationApplication {
    private static final Logger logger = LoggerFactory.getLogger(FlowVisualizationApplication.class);
    public static void main(String[] args) {
        SpringApplication.run(FlowVisualizationApplication.class, args);
    }

    @PostConstruct
    public void postConstruct() {
        String msg = """
                
                
                ====================================
                =       MagicalLog Started         =
                =      http://localhost:9021       =
                ===================================="
        """;
        logger.info(msg);
    }
}
