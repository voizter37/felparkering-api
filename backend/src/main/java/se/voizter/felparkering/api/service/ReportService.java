package se.voizter.felparkering.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import se.voizter.felparkering.api.exception.exceptions.InvalidRequestException;
import se.voizter.felparkering.api.repository.AddressRepository;

@Service
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
