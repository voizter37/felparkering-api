package se.voizter.felparkering.service;

import org.springframework.beans.factory.annotation.Autowired;

import se.voizter.felparkering.api.exception.InvalidRequestException;
import se.voizter.felparkering.api.repository.AddressRepository;

public class ReportService {
    
    @Autowired
    private AddressRepository repository;
    
    public void validateLocation(String location) {
        boolean exists = repository.existsByStreetIgnoreCase(location);
        if (!exists) {
            throw new InvalidRequestException("location", "Address is not valid");
        }
    }
}
