package se.voizter.felparkering.api.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import se.voizter.felparkering.api.model.Report;
import se.voizter.felparkering.api.model.User;
import se.voizter.felparkering.api.repository.ReportRepository;
import se.voizter.felparkering.api.type.Role;
import se.voizter.felparkering.api.type.Status;

@RestController
@RequestMapping("/reports")
public class ReportController {

    private final ReportRepository repository;

    ReportController(ReportRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<?> all() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
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
    public ResponseEntity<?> createReport(@RequestBody Map<String, String> body) {
        String location = body.get("location");
        String licensePlate = body.get("licensePlate");
        String violation = body.get("violation");

        if (location == null && licensePlate == null && violation == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing credentials"));
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        Role role = user.getRole();

        if (role == Role.ATTENDANT) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "You do not have permission to create a report"));
        }

        Report report = new Report();

        report.setLocation(location);
        report.setLicensePlate(licensePlate);
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
