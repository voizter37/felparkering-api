package se.voizter.felparkering.api.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Arrays;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;

import se.voizter.felparkering.api.model.Address;
import se.voizter.felparkering.api.model.AttendantGroup;
import se.voizter.felparkering.api.model.Report;
import se.voizter.felparkering.api.model.User;
import se.voizter.felparkering.api.enums.ParkingViolationCategory;
import se.voizter.felparkering.api.enums.Role;
import se.voizter.felparkering.api.enums.Status;

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
        Address address = new Address();
        address.setCity("Testia");
        address.setStreet("Testgatan");
        address.setHouseNumbers(Arrays.asList("2"));
        report.setAddress(address);
        report.setLicensePlate("ITES71");
        report.setCategory(ParkingViolationCategory.NO_PARKING_AREA);
        report.setStatus(Status.NEW);
        
        reportRepository.save(report);
        Optional<Report> result = reportRepository.findById(report.getId());

        assertTrue(result.isPresent());
        assertEquals(report.getId(), result.get().getId());
        assertEquals("Testgatan 2, Testia", result.get().getAddress().toString());
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
        Address address1 = new Address();
        address1.setCity("Testia");
        address1.setStreet("Testgatan");
        address1.setHouseNumbers(Arrays.asList("2"));
        report1.setAddress(address1);
        report1.setLicensePlate("ITES71");
        report1.setCategory(ParkingViolationCategory.NO_PARKING_AREA);
        report1.setStatus(Status.NEW);
        reportRepository.save(report1);

        Report report2 = new Report();
        Address address2 = new Address();
        address2.setCity("Testia");
        address2.setStreet("Testgatan");
        address2.setHouseNumbers(Arrays.asList("2"));
        report2.setAddress(address2);
        report2.setLicensePlate("ITES71");
        report2.setCategory(ParkingViolationCategory.NO_PARKING_AREA);
        report2.setStatus(Status.NEW);
        reportRepository.save(report2);

        assertFalse(report1.getId() == report2.getId());
        assertEquals(report1.getAddress().toString(), report2.getAddress().toString());
        assertEquals(report1.getLicensePlate(), report2.getLicensePlate());
        assertEquals(report1.getCategory(), report2.getCategory());
        assertEquals(report1.getStatus(), report2.getStatus());
    }

    @Test
    void shouldThrowExceptionWhenMissingRequiredField() {
        Report report2 = new Report();
        Address address2 = new Address();
        address2.setCity("Testia");
        address2.setStreet("Testgatan");
        address2.setHouseNumbers(Arrays.asList("2"));
        report2.setAddress(address2);
        report2.setCategory(ParkingViolationCategory.NO_PARKING_AREA);
        report2.setStatus(Status.NEW);
        
        assertThrows(DataIntegrityViolationException.class, () -> {
            reportRepository.saveAndFlush(report2);
        });

        Report report3 = new Report();
        Address address3 = new Address();
        address3.setCity("Testia");
        address3.setStreet("Testgatan");
        address3.setHouseNumbers(Arrays.asList("2"));
        report3.setAddress(address3);
        report3.setLicensePlate("ITES71");
        report3.setStatus(Status.NEW);
        
        assertThrows(DataIntegrityViolationException.class, () -> {
            reportRepository.saveAndFlush(report3);
        });

        Report report4 = new Report();
        Address address4 = new Address();
        address4.setCity("Testia");
        address4.setStreet("Testgatan");
        address4.setHouseNumbers(Arrays.asList("2"));
        report4.setAddress(address4);
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
        Address address = new Address();
        address.setStreet("Testgatan");
        address.setHouseNumbers(Arrays.asList("3"));
        report.setAddress(address);
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
        Address address = new Address();
        address.setStreet("Uservägen");
        address.setHouseNumbers(Arrays.asList("1"));
        report.setAddress(address);
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
        Address address = new Address();
        address.setStreet("Tidsgatan");
        address.setHouseNumbers(Arrays.asList("9"));
        report.setAddress(address);
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
        Address address = new Address();
        address.setStreet("Uppdateringsgatan");
        address.setHouseNumbers(Arrays.asList("9"));
        report.setAddress(address);
        report.setLicensePlate("UPDATE1");
        report.setCategory(ParkingViolationCategory.INVALID_TICKET);
        report.setStatus(Status.NEW);

        Report saved = reportRepository.save(report);
        saved.setStatus(Status.RESOLVED);
        Report updated = reportRepository.save(saved);

        assertEquals(Status.RESOLVED, updated.getStatus());
    }
}
