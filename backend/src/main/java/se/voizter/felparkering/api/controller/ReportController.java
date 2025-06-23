package se.voizter.felparkering.api.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import se.voizter.felparkering.api.model.Report;
import se.voizter.felparkering.api.repository.ReportRepository;
import se.voizter.felparkering.api.type.Status;

@RestController
@RequestMapping("/reports")
public class ReportController {

    private final ReportRepository repository;

    ReportController(ReportRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    List<Report> all() {
        return repository.findAll();
    }

    @PostMapping
    Report createReport(@RequestBody Report report) {
        return repository.save(report);
    }

    @GetMapping("/{id}")
    Report one(@PathVariable Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Report not found"));
    }

    @PutMapping("/{id}")
    Report updateStatus(@RequestBody Status status, @PathVariable Long id) {
        Report report = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Report not found"));
        report.setStatus(status);
        return report;
    }
    
}
