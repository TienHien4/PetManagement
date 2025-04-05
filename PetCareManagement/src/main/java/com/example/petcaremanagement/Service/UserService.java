package com.example.petcaremanagement.Service;

import com.example.petcaremanagement.Dto.UserDTO.UserRequest;
import com.example.petcaremanagement.Dto.UserDTO.UserResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface UserService {
    UserResponse CreateUser(UserRequest request);
    List<UserResponse> GetAllUser();
    List<UserResponse> FindUsers(String keyword);
    UserResponse UpdateUser(long id, UserRequest request);
    void DeleteUser(long id);
    Page<UserResponse> Pagination(int pageNo, int pageSize);
}
