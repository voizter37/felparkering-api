package se.voizter.felparkering.api.repository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import se.voizter.felparkering.api.model.Address;

public interface AddressRepository extends JpaRepository<Address, Long>  {
    // Gets all addresses as 'a' where street includes the user input somewhere in it.
    @Query("SELECT a FROM Address a WHERE LOWER(a.street) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Address> searchByStreet(@Param("query") String query);
    boolean existsByStreetIgnoreCase(String location);
    Optional<Address> findById(Long id);
}
