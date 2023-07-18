package flow.logsmerger.test.configuration;

import com.amazonaws.services.logs.AWSLogs;
import com.google.gson.Gson;
import flow.logsmerger.business.logic.config.ConfigLoader;
import flow.logsmerger.business.logic.diagrams.SequenceDiagramGenerator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@Import({Gson.class})
@MockBean({AWSLogs.class})
public class TestConfiguration {
    @Value("${resource-folder-path}")
    private String resourceFolderPath;
    @Value("${output-folder-path}")
    private String outputFolderPath;

    @Bean
    public ConfigLoader configLoader(Gson gson) {
        return new ConfigLoader(gson, resourceFolderPath);
    }

    @Bean
    public SequenceDiagramGenerator sequenceDiagramGenerator() {
        return new SequenceDiagramGenerator(outputFolderPath);
    }
}
