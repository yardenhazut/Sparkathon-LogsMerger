package flow.logsmerger.configurations;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import flow.logsmerger.business.logic.config.ConfigLoader;
import flow.logsmerger.business.logic.diagrams.SequenceDiagramGenerator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.boot.web.servlet.server.ConfigurableServletWebServerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.DefaultServletHandlerConfigurer;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class ApplicationConfiguration implements WebMvcConfigurer {
    @Value("${config-folder-path}")
    private String configFolderPath;
    @Value("${output-folder-path}")
    private String outputFolderPath;
    @Value("${AWS_PROFILE}")

    private static final String[] CLASSPATH_RESOURCE_LOCATIONS = {
            "classpath:/META-INF/resources/", "classpath:/resources/",
            "classpath:/static/", "classpath:/public/" };

    @Bean
    public Gson gson() {
        return new GsonBuilder().create();
    }

    @Bean
    public ConfigLoader configLoader(Gson gson) {
        return new ConfigLoader(gson, configFolderPath);
    }

    @Bean
    public SequenceDiagramGenerator sequenceDiagramGenerator() {
        return new SequenceDiagramGenerator(outputFolderPath);
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
//        registry.addViewController("/flow-visualization").setViewName("forward:/index.html");
//        registry.addViewController("/flow-visualization").setViewName("forward:/**"); // NO
        registry.addViewController("/flow-visualization").setViewName("forward:/");
    }

    //9999
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/dist/**", "/js/**")
                .addResourceLocations("classpath:/static/dist/", "classpath:/static/js/");
    }

    @Bean
    WebServerFactoryCustomizer<ConfigurableServletWebServerFactory> enableDefaultServlet() {
        return (factory) -> factory.setRegisterDefaultServlet(true);
    }
    @Override
    public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
        configurer.enable();
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**").allowedOrigins("*");
    }
}
