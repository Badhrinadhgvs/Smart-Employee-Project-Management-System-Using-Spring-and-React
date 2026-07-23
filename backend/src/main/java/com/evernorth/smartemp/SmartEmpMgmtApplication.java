package com.evernorth.smartemp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@EnableAsync
@SpringBootApplication
public class SmartEmpMgmtApplication {
	private static final Logger log = LoggerFactory.getLogger(SmartEmpMgmtApplication.class);

	public static void main(String[] args) {
		log.info("event=app_start status=starting application=smart-emp-mgmt");
		SpringApplication.run(SmartEmpMgmtApplication.class, args);
	}

	@PreDestroy
	public void onShutdown() {
		log.info("event=app_shutdown status=completed application=smart-emp-mgmt message=App Stopped Successfully");
	}

}
