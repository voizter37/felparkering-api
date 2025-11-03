package se.voizter.felparkering.api.service;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import se.voizter.felparkering.api.dto.ReportDetailDto;
import se.voizter.felparkering.api.dto.ReportRequest;
import se.voizter.felparkering.api.enums.Message;
import se.voizter.felparkering.api.enums.ParkingViolationCategory;
import se.voizter.felparkering.api.enums.Role;
import se.voizter.felparkering.api.enums.Status;
import se.voizter.felparkering.api.exception.exceptions.InvalidCredentialsException;
import se.voizter.felparkering.api.exception.exceptions.InvalidRequestException;
import se.voizter.felparkering.api.exception.exceptions.NotFoundException;
import se.voizter.felparkering.api.model.Address;
import se.voizter.felparkering.api.model.AttendantGroup;
import se.voizter.felparkering.api.model.Report;
import se.voizter.felparkering.api.model.User;
import se.voizter.felparkering.api.repository.AddressRepository;
import se.voizter.felparkering.api.repository.AttendantGroupRepository;
import se.voizter.felparkering.api.repository.ReportRepository;

@Service
public class ReportService {
    
    private final AddressRepository addressRepository;
    private final ReportRepository reportRepository;
    private final AttendantGroupRepository groupRepository;

    public ReportService(AddressRepository addressRepository, ReportRepository reportRepository, AttendantGroupRepository groupRepository) {
        this.addressRepository = addressRepository;
        this.reportRepository = reportRepository;
        this.groupRepository = groupRepository;
    }

    @Transactional
    public List<ReportDetailDto> getAll(User user) {
        Role role = user.getRole();

        List<Report> reports = switch (role) {
            case ADMIN -> reportRepository.findAll();
            case ATTENDANT -> reportRepository.findByAttendantGroup(user.getAttendantGroup());
            case CUSTOMER -> reportRepository.findByCreatedBy(user);
            default -> List.of();
        };

        return reports.stream().map(this::toDetailDto).toList();
    }

    @Transactional
    public ReportDetailDto create(User user, ReportRequest request) {
        if (user.getRole() == Role.ATTENDANT) {
            throw new InvalidCredentialsException(Message.REPORT_NO_PERMISSION.toString());
        }

        Address address = resolveAddress(request);

        Report report = new Report();
        report.setLocation(request.street() + " " + request.houseNumber() + ", " + request.city());
        report.setLatitude(address.getLatitude());
        report.setLongitude(address.getLongitude());
        report.setLicensePlate(request.licensePlate().toUpperCase());
        report.setCategory(request.category());
        report.setCreatedBy(user);
        report.setStatus(Status.NEW);

        AttendantGroup attendantGroup = groupRepository.findByName(address.getCity())
            .orElseThrow(() -> new NotFoundException(Message.ATTENDANT_GROUP_NOT_FOUND.toString()));

        report.setAttendantGroup(attendantGroup);

        reportRepository.save(report);

        return toDetailDto(report);
    }

    public ReportDetailDto get(User user, Long id) {
        Report report = reportRepository.findById(id)
            .orElseThrow(() -> new NotFoundException(Message.REPORT_NOT_FOUND.toString()));
        
        if (canAccess(user, report)) {
            return toDetailDto(report); 
        } else {
            throw new InvalidCredentialsException(Message.REPORT_NO_PERMISSION.toString());
        }
    }

    public ReportDetailDto update(User user, Status status, Long id) {
        Report report = reportRepository.findById(id)
            .orElseThrow(() -> new NotFoundException(Message.REPORT_NOT_FOUND.toString()));
        
        if (canAccess(user, report)) {
            if (user.getRole() == Role.CUSTOMER) {
                if (status == Status.CANCELLED && (report.getStatus() == Status.NEW || report.getStatus() == Status.ASSIGNED)) {
                    report.setStatus(status);
                }
            } else {
                report.setStatus(status);
            }
            return toDetailDto(report); 
        } else {
            throw new InvalidCredentialsException(Message.REPORT_NO_PERMISSION.toString());
        }
    }

    private ReportDetailDto toDetailDto(Report report) {
        return new ReportDetailDto(
            report.getId(),
            report.getLocation(),
            report.getLicensePlate(),
            report.getCategory(),
            report.getCreatedOn(),
            report.getUpdatedOn(),
            report.getStatus()
        );
    }

    private Address resolveAddress(ReportRequest request) {
        Optional<Address> maybeAddress = addressRepository.findById(request.id());

        if (!addressRepository.existsByStreetIgnoreCase(request.street()) || maybeAddress.isEmpty()) {
            throw new NotFoundException(Message.ADDRESS_NOT_FOUND.toString());
        }

        return maybeAddress.get();
    }

    private boolean canAccess(User user, Report report) {
        return switch (user.getRole()) {
            case ADMIN -> true;
            case ATTENDANT -> {
                AttendantGroup ug = user.getAttendantGroup();
                AttendantGroup rg = report.getAttendantGroup();
                yield ug != null && rg != null && Objects.equals(ug.getId(), rg.getId());
            }
            case CUSTOMER -> {
                User creator = report.getCreatedBy();
                yield creator != null && Objects.equals(creator.getId(), user.getId());
            }
            default -> false;
        };
    }
}
