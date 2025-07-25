package se.voizter.felparkering.api;

import java.io.FileNotFoundException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import se.voizter.felparkering.api.service.ImportAddress;

@SpringBootApplication
public class FelparkeringApiApplication implements CommandLineRunner {

	@Autowired 
	private ImportAddress importAddress;

	public static void main(String[] args) {
		SpringApplication.run(FelparkeringApiApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		// importAddress.importFromCsv("addresses_with_city.csv");
	}

}
