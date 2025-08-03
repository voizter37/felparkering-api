package se.voizter.felparkering.api.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import se.voizter.felparkering.api.dto.AddressSuggestionDto;
import se.voizter.felparkering.api.repository.AddressRepository;

@RestController
@RequestMapping("/addresses")
public class AddressController {
    private final AddressRepository repository;

    public AddressController(AddressRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/search")
    public List<AddressSuggestionDto> search(@RequestParam String query) {
        return repository.searchByStreet(query)
            .stream()
            .flatMap(a -> AddressSuggestionDto.fromEntity(a).stream())
            .toList();
    }
}
