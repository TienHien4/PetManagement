package com.example.petcaremanagement.Controller;

import com.example.petcaremanagement.Dto.UserDTO.UserRequest;
import com.example.petcaremanagement.Dto.UserDTO.UserResponse;
import com.example.petcaremanagement.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/create")
    public ResponseEntity<UserResponse> CreateUser(@RequestBody UserRequest request){
        return ResponseEntity.ok().body(userService.CreateUser(request));
    }
    @GetMapping("/getInfor/{id}")
    public ResponseEntity<UserResponse> GetUserByEmail(@PathVariable long id){
        var result = userService.GetUserById(id);
        return ResponseEntity.ok().body(result);
    }


    @GetMapping("/getAll")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<UserResponse>> GetAllUser(@RequestParam int pageNo, @RequestParam(defaultValue = "5") int pageSize){
        return ResponseEntity.ok().body(userService.Pagination(pageNo, pageSize));
    }

    @GetMapping("/getUsers/{keyword}")
    public ResponseEntity<List<UserResponse>> GetUsersByKeyword(@PathVariable String keyword){
        var result = userService.FindUsers(keyword);
        return ResponseEntity.ok().body(result);
    }
    @PostMapping("/updateUser/{id}")
    public ResponseEntity<UserResponse> UpdateUserById(@PathVariable long id,
                                                       @RequestBody UserRequest request){
        var result = userService.UpdateUser(id, request);
        return ResponseEntity.ok().body(result);
    }
    @PostMapping("/changePassword/{id}")
    public ResponseEntity<UserResponse> ChangePassword(@PathVariable long id, @RequestParam String newPassword){
        var result = userService.ChangePassword(id, newPassword);
        return ResponseEntity.ok().body(result);
    }



}
