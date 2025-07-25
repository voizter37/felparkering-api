package se.voizter.felparkering.api.service;

import java.io.FileReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.opencsv.CSVReader;

import se.voizter.felparkering.api.model.Address;
import se.voizter.felparkering.api.repository.AddressRepository;

@Service
public class ImportAddress {
    
    @Autowired
    private AddressRepository repository;

    public void importFromCsv(String resourceName) {
        try {
            InputStream inputStream = getClass().getClassLoader().getResourceAsStream(resourceName);
            if (inputStream == null) {
                throw new RuntimeException(resourceName + " not found");
            }
            try (CSVReader reader = new CSVReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8))) {
                String[] line;
                reader.readNext();

                while ((line = reader.readNext()) != null) {
                    Address address = new Address();

                    address.setLongitude(Double.parseDouble(line[0]));
                    address.setLatitude(Double.parseDouble(line[1]));
                    address.setStreet(line[2]);
                    
                    String houseNumbersStr = line[3];
                    List<String> houseNumbers = Arrays.stream(
                        houseNumbersStr.replace("[", "").replace("]", "").split(","))
                        .map(s -> s.replace("'", "").trim())
                        .filter(n -> !n.isEmpty())
                        .collect(Collectors.toList());
                    address.setHouseNumbers(houseNumbers);

                    address.setCity(line[4]);
                    address.setDistanceFromCity(Double.parseDouble(line[5]));

                    repository.save(address);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
