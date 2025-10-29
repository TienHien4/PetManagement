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
import java.util.stream.Collectors;

@Service
public class UserServiceIplm implements UserService {
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private RoleRepository roleRepo;
    @Autowired
    private UserMapper userMapper;

    @Override
    public UserResponse CreateUser(UserRequest request) throws Exception {

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
        if (user.getUserName().isEmpty() || user.getPassword().isEmpty() || user.getEmail().isEmpty()) {
            throw new Exception("You need to enter complete information");
        }
        userRepo.save(user);
        return response;
    }

    @Override
    public List<UserResponse> GetAllUser() {
        var listUser = userRepo.findAll();
        return listUser.stream().map(s -> userMapper.toUserResponse(s)).toList();
    }

    @Override
    public List<UserResponse> FindUsers(String keyword) {
        var listUser = userRepo.searchUser(keyword);
        var response = listUser.stream().map(
                s -> {
                    UserResponse userResponse = userMapper.toUserResponse(s);
                    userResponse.setRoles(s.getRoles());
                    return userResponse;
                }).toList();
        return response;
    }

    @Override
    public UserResponse UpdateUser(long id, UserRequest request) {
        User user = userRepo.findById(id).orElseThrow(() -> new RuntimeException("Not found user by id: " + id));
        userMapper.updateUser(user, request);
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
    public void DeleteUser(long id) {
        User user = userRepo.findById(id).orElseThrow(() -> new RuntimeException("Not found user by id: " + id));
        userRepo.deleteById(id);
    }

    @Override
    public UserResponse GetUserById(long id) {
        User user = userRepo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        return userMapper.toUserResponse(user);
    }

    @Override
    public UserResponse ChangePassword(long id, String newPassword) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = bCryptPasswordEncoder.encode(newPassword);
        user.setPassword(encodedPassword);
        User savedUser = userRepo.save(user);
        return userMapper.toUserResponse(savedUser);
    }

    @Override
    public Page<UserResponse> Pagination(int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(pageNo - 1, pageSize);
        Page<User> listUser = userRepo.findAll(pageable);

        Page<UserResponse> listUserResponse = listUser.map(user -> {
            UserResponse userResponse = userMapper.toUserResponse(user);
            userResponse.setRoles(user.getRoles());
            return userResponse;
        });

        return listUserResponse;
    }

    @Override
    public User getUserByEmail(String email) {
        User user = userRepo.findUserByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found with email: " + email);
        }
        return user;
    }

    @Override
    public User getUserByUsername(String username) {
        User user = userRepo.findUserByUserName(username);
        if (user == null) {
            throw new RuntimeException("User not found with username: " + username);
        }
        return user;
    }

}
