package com.example.petcaremanagement.Service.Iplm;

import com.example.petcaremanagement.Dto.UserDTO.UserRequest;
import com.example.petcaremanagement.Dto.UserDTO.UserResponse;
import com.example.petcaremanagement.Entity.Role;
import com.example.petcaremanagement.Entity.User;
import com.example.petcaremanagement.Mapper.UserMapper;
import com.example.petcaremanagement.Repository.PetRepository;
import com.example.petcaremanagement.Repository.RoleRepository;
import com.example.petcaremanagement.Repository.UserRepository;
import com.example.petcaremanagement.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class UserServiceIplm implements UserService {
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private RoleRepository roleRepo;
    @Autowired
    private UserMapper userMapper;

    @Override
    public UserResponse CreateUser(UserRequest request) {

        User user = userMapper.toUser(request);
        var response = userMapper.toUserResponse(user);
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        Set<Role> roles = new HashSet<>();
        var r = roleRepo.findById("USER")
                .orElseThrow(() -> new RuntimeException("Not found!"));
        roles.add(r);
        response.setRoles(roles);
        user.setRoles(roles);
        userRepo.save(user);
        return response;
    }

    @Override
    public List<UserResponse> GetAllUser() {
        var listUser = userRepo.findAll();
        return listUser.stream().map(s -> userMapper.toUserResponse(s)).toList();
    }

    @Override
    public UserResponse UpdateUser(long id, UserRequest request) {
        User user = userRepo.findById(id).orElseThrow(() -> new RuntimeException("Not found user by id: " + id));
        userMapper.updateUser(user, request);
        return userMapper.toUserResponse(userRepo.save(user));
    }

    @Override
    public void DeleteUser(long id) {
        User user = userRepo.findById(id).orElseThrow(() -> new RuntimeException("Not found user by id: " + id));
        userRepo.deleteById(id);
    }

    @Override
    public Page<UserResponse> Pagination(int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(pageNo-1, pageSize);
        return userRepo.findAll(pageable).map(s -> userMapper.toUserResponse(s));
    }
}
