package com.DanielsProjects1.Chatter_Box_Starter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class ChatterBoxStarterApplication {

	public static void main(String[] args) {
		SpringApplication.run(ChatterBoxStarterApplication.class, args);
	}

}
