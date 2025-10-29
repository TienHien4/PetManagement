package com.example.petcaremanagement.Service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    /**
     * Upload image to Cloudinary with default folder (pet_images)
     */
    public String uploadImage(MultipartFile file) {
        return uploadImage(file, "pet_images");
    }

    /**
     * Upload image to Cloudinary with custom folder
     * 
     * @param file   The image file to upload
     * @param folder The folder name in Cloudinary (e.g., "pet_images",
     *               "product_images")
     * @return The secure URL of uploaded image
     */
    public String uploadImage(MultipartFile file, String folder) {
        try {
            // Validate input
            if (file == null || file.isEmpty()) {
                throw new IllegalArgumentException("File cannot be null or empty");
            }

            // Upload to Cloudinary with folder
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", folder,
                            "resource_type", "image"));

            // Return secure URL
            String secureUrl = (String) uploadResult.get("secure_url");
            if (secureUrl == null || secureUrl.isEmpty()) {
                throw new RuntimeException("Failed to get image URL from Cloudinary");
            }

            return secureUrl;

        } catch (IOException e) {
            throw new RuntimeException("Error uploading image: " + e.getMessage(), e);
        }
    }

    /**
     * Delete image from Cloudinary
     */
    public void deleteImage(String imageUrl) {
        try {
            if (imageUrl == null || imageUrl.isEmpty()) {
                return;
            }

            String publicId = extractPublicIdFromUrl(imageUrl);
            Map result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());

            String resultStatus = (String) result.get("result");
            if (!"ok".equals(resultStatus)) {
                throw new RuntimeException("Failed to delete image: " + resultStatus);
            }

        } catch (IOException e) {
            throw new RuntimeException("Failed to delete image from Cloudinary: " + e.getMessage(), e);
        }
    }

    /**
     * Extract public_id from Cloudinary URL
     */
    private String extractPublicIdFromUrl(String imageUrl) {
        try {
            String[] parts = imageUrl.split("/");
            int uploadIndex = -1;
            for (int i = 0; i < parts.length; i++) {
                if ("upload".equals(parts[i])) {
                    uploadIndex = i;
                    break;
                }
            }

            if (uploadIndex == -1 || uploadIndex + 2 >= parts.length) {
                throw new IllegalArgumentException("Invalid Cloudinary URL format");
            }

            StringBuilder publicId = new StringBuilder();
            for (int i = uploadIndex + 2; i < parts.length; i++) {
                if (i > uploadIndex + 2) {
                    publicId.append("/");
                }
                publicId.append(parts[i]);
            }

            String publicIdStr = publicId.toString();
            int lastDot = publicIdStr.lastIndexOf('.');
            if (lastDot > 0) {
                publicIdStr = publicIdStr.substring(0, lastDot);
            }

            return publicIdStr;

        } catch (Exception e) {
            throw new RuntimeException("Failed to extract public_id from URL: " + imageUrl, e);
        }
    }
}
