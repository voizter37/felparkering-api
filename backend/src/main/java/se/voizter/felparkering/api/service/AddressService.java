package se.voizter.felparkering.api.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import jakarta.transaction.Transactional;
import se.voizter.felparkering.api.dto.AddressSuggestionDto;
import se.voizter.felparkering.api.repository.AddressRepository;

@Service
public class AddressService {

    private final RestClient rest;
    private final String apiKey;
    private final AddressRepository addressRepository;

    public AddressService(
        RestClient.Builder builder,
        @Value("${open_route_service_url:https://api.openrouteservice.org}") String baseUrl,
        @Value("${open_route_service_api}") String apiKey,
        AddressRepository addressRepository
        ) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException(
                "ORS API nyckel saknas."
            );
        }
        this.rest = builder.baseUrl(baseUrl).build();
        this.apiKey = apiKey;
        this.addressRepository = addressRepository;
    }

    @Transactional
    public List<AddressSuggestionDto> getAddresses(String query) {
        return addressRepository.searchByStreet(query)
            .stream()
            .flatMap(a -> AddressSuggestionDto.fromEntity(a).stream())
            .toList();
    }

    @Transactional
    public Map<?,?> getRoute(double[] start, double[] end) {
        double startLat = start[0], startLon = start[1];
        double endLat   = end[0],   endLon   = end[1];

        var body = Map.of(
            "coordinates", List.of(
                List.of(startLon, startLat),
                List.of(endLon, endLat)
            )
        );
        
        return rest.post()
            .uri("/v2/directions/driving-car/geojson")
            .contentType(MediaType.APPLICATION_JSON)
            .header(HttpHeaders.AUTHORIZATION, apiKey)
            .body(body)
            .retrieve()
            .body(Map.class);
    }
}
