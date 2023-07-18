package flow.logsmerger.business.logic.service.impl;

import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;

import java.io.File;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.annotation.PostConstruct;

public class ServiceBase {

	@Setter
	@Value("${config-folder-path}")
	protected String configFolderPath;
	@Value("${output-folder-path}")
	protected String outputFolderPath;


	private static final Logger logger = LogManager.getLogger(ServiceBase.class);

	@PostConstruct
	public void init(){
		if (configFolderPath == null){
			throw new RuntimeException("CONFIGURATION ERROR: config-folder-path property is null - setup configuration");
		}
		if (outputFolderPath == null){
			throw new RuntimeException("CONFIGURATION ERROR: output-folder-path property is null - setup configuration");
		}

		logger.debug("ServiceBase.init() - *********************************************************************");
		logger.debug("ServiceBase.init() - application.yml - config path:[" + configFolderPath + "]");
		logger.debug("ServiceBase.init() - application.yml - output path:[" + outputFolderPath + "]");
		logger.debug("ServiceBase.init() - *********************************************************************");
	}
	protected String determineConfigFolder(String userFolder) {
		return  "./" + configFolderPath + (!configFolderPath.endsWith("/") ? File.separator : "") + userFolder;
	}
	protected String determineOutputFolder(String userFolder) {
		return outputFolderPath + File.separator + userFolder;
	}
}
