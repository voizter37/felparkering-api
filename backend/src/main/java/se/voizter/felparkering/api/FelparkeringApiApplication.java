package se.voizter.felparkering.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;

import se.voizter.felparkering.api.model.*;
import se.voizter.felparkering.api.repository.*;
import se.voizter.felparkering.api.enums.*;

@SpringBootApplication
public class FelparkeringApiApplication {

	public static void main(String[] args) {
		System.out.println("Test!");
		SpringApplication.run(FelparkeringApiApplication.class, args);
	}

	@Bean
	CommandLineRunner run(UserRepository userRepository, AttendantGroupRepository groupRepository) {
		return args -> {
			AttendantGroup group = new AttendantGroup();
			group.setName("Stockholm södra");
			groupRepository.save(group);

			User admin = new User();
			admin.setEmail("admin@example.com");
			admin.setPassword("abc123");
			admin.setRole(Role.ADMIN);
			userRepository.save(admin);

			User vakt = new User();
			vakt.setEmail("vakt@example.com");
			vakt.setPassword("abc123");
			vakt.setRole(Role.ATTENDANT);
			vakt.setAttendantGroup(group);
			userRepository.save(vakt);

			System.out.println("Användare skapade!");
		};
	}
}
