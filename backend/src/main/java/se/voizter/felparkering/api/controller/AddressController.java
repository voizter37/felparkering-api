package se.voizter.felparkering.api.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import se.voizter.felparkering.api.dto.AddressSuggestionDto;
import se.voizter.felparkering.api.dto.RouteRequest;
import se.voizter.felparkering.api.repository.AddressRepository;
import se.voizter.felparkering.api.service.RouteService;

@RestController
@RequestMapping("/addresses")
public class AddressController {
    private final AddressRepository repository;

    private final RouteService routeService;

    public AddressController(AddressRepository repository, RouteService routeService) {
        this.repository = repository;
        this.routeService = routeService;
    }

    @GetMapping("/search")
    public List<AddressSuggestionDto> search(@RequestParam String query) {
        return repository.searchByStreet(query)
            .stream()
            .flatMap(a -> AddressSuggestionDto.fromEntity(a).stream())
            .toList();
    }

    @PostMapping("/route")
    public Map<?,?> getRoute(@RequestBody RouteRequest request) {
        return routeService.getRoute(request.getStart(), request.getEnd());
    }
}
