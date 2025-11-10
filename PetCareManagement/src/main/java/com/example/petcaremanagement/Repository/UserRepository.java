package com.example.petcaremanagement.Repository;

import com.example.petcaremanagement.Entity.Pet;
import com.example.petcaremanagement.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findUserByUserName(String userName);
    User findUserByEmail(String email);
    boolean existsUsersByEmail(String email);
    @Query("SELECT user FROM User user WHERE user.userName LIKE CONCAT('%', ?1, '%')" +
            " OR user.email LIKE CONCAT('%', ?1, '%')")
    List<User> searchUser(String keyword);
    List<User> findDistinctByRoles_Name(String roleName);

    @Query("SELECT u FROM User u WHERE u.vet IS NOT NULL")
    List<User> findAllUsersWithVetProfile();
}
