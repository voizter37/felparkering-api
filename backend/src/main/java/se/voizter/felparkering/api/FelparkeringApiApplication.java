package se.voizter.felparkering.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;

import se.voizter.felparkering.api.model.*;
import se.voizter.felparkering.api.repository.*;
import se.voizter.felparkering.api.type.*;

@SpringBootApplication
public class FelparkeringApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(FelparkeringApiApplication.class, args);
	}

	@Bean
	CommandLineRunner run(UserRepository userRepository, AttendantGroupRepository groupRepository, ReportRepository reportRepository) {
		return args -> {
			if (!groupRepository.existsByName("Stockholm södra")){
				AttendantGroup group = new AttendantGroup();
				group.setName("Stockholm södra");
				groupRepository.save(group);
			}

			if (!userRepository.existsByEmail("admin@example.com")) {
				User admin = new User();
				admin.setEmail("admin@example.com");
				admin.setPassword("abc123");
				admin.setRole(Role.ADMIN);
				userRepository.save(admin);

				User vakt = new User();
				vakt.setEmail("vakt@example.com");
				vakt.setPassword("abc123");
				vakt.setRole(Role.ATTENDANT);

				if (groupRepository.existsByName("Stockholm södra")) {
					vakt.setAttendantGroup(
						groupRepository.findByName("Stockholm södra")
							.orElseThrow(() -> new RuntimeException("Vaktgruppen finns inte"))
					);
				}

				userRepository.save(vakt);
			}

			Report report1 = new Report();
			report1.setLocation("Södra vägen 1, Stockholm");
			report1.setLicensePlate("ABC123");
			report1.setCategory("Blockerar infart");
			report1.setStatus(Status.NEW);
			if (groupRepository.existsByName("Stockholm södra")) {
				report1.setAttendantGroup(
					groupRepository.findByName("Stockholm södra")
						.orElseThrow(() -> new RuntimeException("Vaktgruppen finns inte"))
				);
			}
			if (userRepository.existsByEmail("admin@example.com")) {
				report1.setAssignedTo(
					userRepository.findByEmail("admin@example.com")
						.orElseThrow(() -> new RuntimeException("Användaren finns inte"))
				);
			}
			reportRepository.save(report1);

			System.out.println("Test!");
		};
	}
}
