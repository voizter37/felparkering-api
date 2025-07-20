package se.voizter.felparkering.api.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import se.voizter.felparkering.api.model.Address;

public interface AddressRepository extends JpaRepository<Address, Long>  {
    
}
