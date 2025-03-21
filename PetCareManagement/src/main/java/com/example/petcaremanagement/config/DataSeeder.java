package com.example.petcaremanagement.config;

import com.example.petcaremanagement.Entity.Permission;
import com.example.petcaremanagement.Entity.Role;
import com.example.petcaremanagement.Entity.User;
import com.example.petcaremanagement.Repository.PermissionRepository;
import com.example.petcaremanagement.Repository.RoleRepository;
import com.example.petcaremanagement.Repository.UserRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@Configuration
public class DataSeeder {

    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository, RoleRepository roleRepository, PermissionRepository permissionRepository) {
        return args -> {
            Set<Permission> list2 = new HashSet<>();

            Role role2 = new Role("USER", "User role", list2);
            roleRepository.save(role2);
            if (userRepository.findUserByUserName("admin") == null) {
                // Tạo và lưu các Permission
                Permission permission1 = new Permission("Update", "Allow update permission");
                Permission permission2 = new Permission("Create", "Create permission");
                permissionRepository.save(permission1);
                permissionRepository.save(permission2);

                // Tạo danh sách Permission
                Set<Permission> list1 = new HashSet<>();
                list1.add(permission1);
                list1.add(permission2);


                // Tạo và lưu Role
                Role role1 = new Role("ADMIN", "Admin role", list1);
                roleRepository.save(role1);



                // Tạo danh sách Role
                Set<Role> roles = new HashSet<>();
                roles.add(role1);

                // Tạo và lưu User
                User user = new User();
                user.setUserName("admin");
                user.setPassword("123456");
                user.setEmail("admin@gmail.com");
                user.setRoles(roles);

                // Mã hóa mật khẩu
                PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
                user.setPassword(passwordEncoder.encode(user.getPassword()));

                // Lưu User
                userRepository.save(user);
            }
        };
    }
}

