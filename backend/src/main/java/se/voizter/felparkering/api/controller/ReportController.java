package se.voizter.felparkering.api.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import jakarta.validation.Valid;
import se.voizter.felparkering.api.dto.ReportDto;
import se.voizter.felparkering.api.model.Address;
import se.voizter.felparkering.api.model.Report;
import se.voizter.felparkering.api.model.User;
import se.voizter.felparkering.api.repository.AddressRepository;
import se.voizter.felparkering.api.repository.ReportRepository;
import se.voizter.felparkering.api.repository.UserRepository;
import se.voizter.felparkering.api.type.ParkingViolationCategory;
import se.voizter.felparkering.api.type.Role;
import se.voizter.felparkering.api.type.Status;
import se.voizter.felparkering.service.ReportService;

@RestController
@RequestMapping("/reports")
public class ReportController {

    private final ReportRepository repository;
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    ReportController(ReportRepository repository, AddressRepository addressRepository, UserRepository userRepository) {
        this.repository = repository;
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> all() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = (String) auth.getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Role role = user.getRole();

        switch (role) {
            case ADMIN:
                return ResponseEntity.ok(repository.findAll());
            case ATTENDANT:
                return ResponseEntity.ok(repository.findByAttendantGroup(user.getAttendantGroup()));
            case CUSTOMER:
                return ResponseEntity.ok(repository.findByCreatedBy(user));
            default:
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "You do not have permission to get all reports"));
        }
        
    }

    @PostMapping
    public ResponseEntity<?> createReport(@Valid @RequestBody ReportDto request) {
        String street = request.getStreet();
        String houseNumber = request.getHouseNumber();
        String city = request.getCity();
        String licensePlate = request.getLicensePlate();
        ParkingViolationCategory violation = request.getViolation();

        if (street == null && licensePlate == null && violation == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing credentials"));
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = (String) auth.getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Role role = user.getRole();

        if (role == Role.ATTENDANT) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "You do not have permission to create a report"));
        }

        Optional<Address> optionalAddress = addressRepository.findById(request.getId());

        if (optionalAddress.isEmpty()) {
            throw new RuntimeException("Address not found in database");
        }

        Address address = optionalAddress.get();

        Report report = new Report();

        report.setLocation(street + " " + houseNumber + ", " + city);
        report.setLatitude(address.getLatitude());
        report.setLongitude(address.getLongitude());
        report.setLicensePlate(licensePlate.toUpperCase());
        report.setCategory(violation);
        report.setCreatedBy(user);
        report.setStatus(Status.NEW);

        repository.save(report);

        return ResponseEntity.ok(Map.of(
            "message", "Report created successfully",
            "createdOn", report.getCreatedOn()
        ));
    }

    @GetMapping("/{id}")
    public Report one(@PathVariable Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Report not found"));
    }

    @PutMapping("/{id}")
    public Report updateStatus(@RequestBody Status status, @PathVariable Long id) {
        Report report = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Report not found"));
        report.setStatus(status);
        return report;
    }
    
}
