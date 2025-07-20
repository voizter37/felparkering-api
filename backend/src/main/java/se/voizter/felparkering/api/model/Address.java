package se.voizter.felparkering.api.model;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "addresses")
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double longitude;
    
    private double latitude;

    private String street;

    private List<String> houseNumbers;

    private String city;

    private double distanceFromCity;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public List<String> getHouseNumbers() {
        return houseNumbers;
    }

    public void setHouseNumbers(List<String> houseNumbers) {
        this.houseNumbers = houseNumbers;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public double getDistanceFromCity() {
        return distanceFromCity;
    }

    public void setDistanceFromCity(double distanceFromCity) {
        this.distanceFromCity = distanceFromCity;
    }
}
