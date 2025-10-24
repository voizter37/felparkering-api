package se.voizter.felparkering.api.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class RouteService {

    private final RestClient rest;
    private final String apiKey;

    public RouteService(
        RestClient.Builder builder,
        @Value("${open_route_service_url:https://api.openrouteservice.org}") String baseUrl,
        @Value("${open_route_service_api}") String apiKey
        ) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException(
                "ORS API nyckel saknas."
            );
        }
        this.rest = builder.baseUrl(baseUrl).build();
        this.apiKey = apiKey;
    }

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
