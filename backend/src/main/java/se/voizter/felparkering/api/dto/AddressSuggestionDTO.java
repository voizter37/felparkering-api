package se.voizter.felparkering.api.dto;

import java.util.List;

import se.voizter.felparkering.api.model.Address;

public record AddressSuggestionDto(Long id, String street, String city, String houseNumber) {
    public static List<AddressSuggestionDto> fromEntity(Address a) {
        return a.getHouseNumbers().stream()
            .map(hn -> new AddressSuggestionDto(a.getId(), a.getStreet(), a.getCity(), hn))
            .toList();
    }
}
