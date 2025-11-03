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
import se.voizter.felparkering.api.service.AddressService;

@RestController
@RequestMapping("/addresses")
public class AddressController {
    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @GetMapping("/search")
    public List<AddressSuggestionDto> search(@RequestParam String query) {
        return addressService.getAddresses(query);
    }

    @PostMapping("/route")
    public Map<?,?> getRoute(@RequestBody RouteRequest request) {
        return addressService.getRoute(request.getStart(), request.getEnd());
    }
}
