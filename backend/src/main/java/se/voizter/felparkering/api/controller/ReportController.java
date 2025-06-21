package se.voizter.felparkering.api.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import se.voizter.felparkering.api.model.Report;
import se.voizter.felparkering.api.repository.ReportRepository;
import se.voizter.felparkering.api.type.Status;

@RestController
public class ReportController {

    private final ReportRepository repository;

    ReportController(ReportRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/reports")
    List<Report> all() {
        return repository.findAll();
    }

    @PostMapping("/reports")
    Report createReport(@RequestBody Report report) {
        return repository.save(report);
    }

    @GetMapping("/reports/{id}")
    Report one(@PathVariable Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new RuntimeException("No report found"));
    }

    @PutMapping("/reports/{id}")
    Report updateStatus(@RequestBody Status status, @PathVariable Long id) {
        Report report = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("No report found"));
        report.setStatus(status);
        return report;
    }
    
}
