package se.voizter.felparkering.api.dto;

import java.util.List;

import se.voizter.felparkering.api.model.Address;

public record AddressSuggestionDTO(String street, String city, String houseNumber) {
    public static List<AddressSuggestionDTO> fromEntity(Address a) {
        return a.getHouseNumbers().stream()
            .map(hn -> new AddressSuggestionDTO(a.getStreet(), a.getCity(), hn))
            .toList();
    }
}
