package se.voizter.felparkering.api.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;

import se.voizter.felparkering.api.model.AttendantGroup;
import se.voizter.felparkering.api.model.Report;
import se.voizter.felparkering.api.model.User;
import se.voizter.felparkering.api.type.ParkingViolationCategory;
import se.voizter.felparkering.api.type.Role;
import se.voizter.felparkering.api.type.Status;

@DataJpaTest
public class ReportRepositoryTests {
    @Autowired
    ReportRepository reportRepository;

    @Autowired
    AttendantGroupRepository groupRepository;

    @Autowired
    UserRepository userRepository;

    @Test
    void canSaveAndFindById() {
        Report report = new Report();
        report.setLocation("Testgatan 2, Testia");
        report.setLicensePlate("ITES71");
        report.setCategory(ParkingViolationCategory.NO_PARKING_AREA);
        report.setStatus(Status.NEW);
        
        reportRepository.save(report);
        Optional<Report> result = reportRepository.findById(report.getId());

        assertTrue(result.isPresent());
        assertEquals(report.getId(), result.get().getId());
        assertEquals("Testgatan 2, Testia", result.get().getLocation());
        assertEquals("ITES71", result.get().getLicensePlate());
        assertEquals(ParkingViolationCategory.NO_PARKING_AREA, result.get().getCategory());
        assertEquals(Status.NEW, result.get().getStatus());
    }

    @Test
    void findByIdReturnsEmptyWhenNotFound() {
        Optional<Report> result = reportRepository.findById((long) 10);
        assertTrue(result.isEmpty());
    }

    @Test
    void canSaveReportWithDuplicateParams() {
        Report report1 = new Report();
        report1.setLocation("Testgatan 2, Testia");
        report1.setLicensePlate("ITES71");
        report1.setCategory(ParkingViolationCategory.NO_PARKING_AREA);
        report1.setStatus(Status.NEW);
        reportRepository.save(report1);

        Report report2 = new Report();
        report2.setLocation("Testgatan 2, Testia");
        report2.setLicensePlate("ITES71");
        report2.setCategory(ParkingViolationCategory.NO_PARKING_AREA);
        report2.setStatus(Status.NEW);
        reportRepository.save(report2);

        assertFalse(report1.getId() == report2.getId());
        assertEquals(report1.getLocation(), report2.getLocation());
        assertEquals(report1.getLicensePlate(), report2.getLicensePlate());
        assertEquals(report1.getCategory(), report2.getCategory());
        assertEquals(report1.getStatus(), report2.getStatus());
    }

    @Test
    void shouldThrowExceptionWhenMissingRequiredField() {
        Report report1 = new Report();
        report1.setLicensePlate("ITES71");
        report1.setCategory(ParkingViolationCategory.NO_PARKING_AREA);
        report1.setStatus(Status.NEW);
        
        assertThrows(DataIntegrityViolationException.class, () -> {
            reportRepository.saveAndFlush(report1);
        });

        Report report2 = new Report();
        report2.setLocation("Testgatan 2, Testia");
        report2.setCategory(ParkingViolationCategory.NO_PARKING_AREA);
        report2.setStatus(Status.NEW);
        
        assertThrows(DataIntegrityViolationException.class, () -> {
            reportRepository.saveAndFlush(report2);
        });

        Report report3 = new Report();
        report3.setLocation("Testgatan 2, Testia");
        report3.setLicensePlate("ITES71");
        report3.setStatus(Status.NEW);
        
        assertThrows(DataIntegrityViolationException.class, () -> {
            reportRepository.saveAndFlush(report3);
        });

        Report report4 = new Report();
        report4.setLocation("Testgatan 2, Testia");
        report4.setLicensePlate("ITES71");
        report2.setCategory(ParkingViolationCategory.NO_PARKING_AREA);
        
        assertThrows(DataIntegrityViolationException.class, () -> {
            reportRepository.saveAndFlush(report4);
        });
    }

    @Test
    void canSaveReportWithAttendantGroup() {
        AttendantGroup group = new AttendantGroup();
        group.setName("Testgruppen");
        AttendantGroup savedGroup = groupRepository.save(group);

        Report report = new Report();
        report.setLocation("Testgatan 3");
        report.setLicensePlate("GROUP123");
        report.setCategory(ParkingViolationCategory.OUTSIDE_MARKED_SPACE);
        report.setStatus(Status.NEW);
        report.setAttendantGroup(savedGroup);

        Report savedReport = reportRepository.save(report);

        assertEquals("Testgruppen", savedReport.getAttendantGroup().getName());
    }

    @Test 
    void canSaveReportWithAssignedUser() {
        User user = new User();
        user.setEmail("assigned@example.com");
        user.setPassword("secure");
        user.setRole(Role.ATTENDANT);
        user.setAttendantGroup(null);
        User savedUser = userRepository.save(user);

        Report report = new Report();
        report.setLocation("Uservägen 1");
        report.setLicensePlate("USER123");
        report.setCategory(ParkingViolationCategory.RENTED_SPACE_OCCUPIED);
        report.setStatus(Status.ASSIGNED);
        report.setAssignedTo(savedUser);

        Report saved = reportRepository.save(report);

        assertEquals("assigned@example.com", saved.getAssignedTo().getEmail());
    }

    @Test
    void creationAndUpdateTimestampsAreSet() {
        Report report = new Report();
        report.setLocation("Tidsgatan 9");
        report.setLicensePlate("TIME123");
        report.setCategory(ParkingViolationCategory.NO_PARKING_AREA);
        report.setStatus(Status.NEW);

        Report saved = reportRepository.save(report);

        assertTrue(saved.getCreatedOn() != null);
        assertTrue(saved.getUpdatedOn() != null);
    }

    @Test
    void canUpdateReportStatus() {
        Report report = new Report();
        report.setLocation("Uppdateringsgatan 9");
        report.setLicensePlate("UPDATE1");
        report.setCategory(ParkingViolationCategory.INVALID_TICKET);
        report.setStatus(Status.NEW);

        Report saved = reportRepository.save(report);
        saved.setStatus(Status.RESOLVED);
        Report updated = reportRepository.save(saved);

        assertEquals(Status.RESOLVED, updated.getStatus());
    }
}
