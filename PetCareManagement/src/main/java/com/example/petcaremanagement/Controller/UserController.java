package com.example.petcaremanagement.Controller;

import com.example.petcaremanagement.Dto.UserDTO.UserRequest;
import com.example.petcaremanagement.Dto.UserDTO.UserResponse;
import com.example.petcaremanagement.DtoError.ErrorResponse;
import com.example.petcaremanagement.Entity.User;
import com.example.petcaremanagement.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/create")
    public ResponseEntity<?> CreateUser(@RequestBody UserRequest request) {
        try {
            return ResponseEntity.ok().body(userService.CreateUser(request));
        } catch (DataIntegrityViolationException e) {
            // 1. Most specific exception first
            String root = e.getRootCause() != null ? e.getRootCause().getMessage() : e.getMessage();
            String lower = root == null ? "" : root.toLowerCase();

            if (lower.contains("user.email") || lower.contains("duplicate")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ErrorResponse("Email đã được sử dụng, vui lòng dùng email khác"));
            } else if (lower.contains("username") || lower.contains("user_name") || lower.contains("user.userName")
                    || lower.contains("tên")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ErrorResponse("Tên tài khoản đã tồn tại, vui lòng chọn tên khác"));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ErrorResponse("Đăng ký thất bại. Vui lòng thử lại!"));
            }
        } catch (RuntimeException e) {
            // 2. More general runtime exception next
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            // 3. Most general exception last
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Đăng ký thất bại. Vui lòng thử lại!"));
        }
    }

    @GetMapping("/getInfor/{id}")
    public ResponseEntity<UserResponse> GetUserByEmail(@PathVariable long id) {
        var result = userService.GetUserById(id);
        return ResponseEntity.ok().body(result);
    }

    @GetMapping("/getAll")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<UserResponse>> GetAllUser(@RequestParam int pageNo,
            @RequestParam(defaultValue = "5") int pageSize) {
        return ResponseEntity.ok().body(userService.Pagination(pageNo, pageSize));
    }

    @GetMapping("/getUsers/{keyword}")
    public ResponseEntity<List<UserResponse>> GetUsersByKeyword(@PathVariable String keyword) {
        var result = userService.FindUsers(keyword);
        return ResponseEntity.ok().body(result);
    }

    @PostMapping("/updateUser/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<UserResponse> UpdateUserById(@PathVariable long id,
            @RequestBody UserRequest request) {
        var result = userService.UpdateUser(id, request);
        return ResponseEntity.ok().body(result);
    }

    @PostMapping("/admin/updateUser/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> AdminUpdateUserById(@PathVariable long id,
            @RequestBody UserRequest request) {
        var result = userService.UpdateUser(id, request);
        return ResponseEntity.ok().body(result);
    }

    @PostMapping("/changePassword/{id}")
    public ResponseEntity<UserResponse> ChangePassword(@PathVariable long id, @RequestParam String newPassword) {
        var result = userService.ChangePassword(id, newPassword);
        return ResponseEntity.ok().body(result);
    }

    @GetMapping("/vets")
    public ResponseEntity<List<User>> getAllVets() {
        List<User> vets = userService.getAllVets();
        return ResponseEntity.ok(vets);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> DeleteUser(@PathVariable long id) {
        try {
            userService.DeleteUser(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }
}
