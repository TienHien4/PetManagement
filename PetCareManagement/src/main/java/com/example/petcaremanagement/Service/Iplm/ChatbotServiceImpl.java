package com.example.petcaremanagement.Service.Iplm;

import com.example.petcaremanagement.Dto.ChatDTO.ChatRequest;
import com.example.petcaremanagement.Dto.ChatDTO.ChatResponse;
import com.example.petcaremanagement.Service.ChatbotService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class ChatbotServiceImpl implements ChatbotService {

    @Value("${gemini.api.key:}")
    private String apiKey;

    @Value("${gemini.model:gemini-2.0-flash}")
    private String model;

    private final com.example.petcaremanagement.Repository.PetRepository petRepository;
    private final com.example.petcaremanagement.Repository.MedicalRecordRepository medicalRecordRepository;
    private final com.example.petcaremanagement.Repository.VaccinationRepository vaccinationRepository;
    private final com.example.petcaremanagement.Repository.AppointmentRepository appointmentRepository;
    private final com.example.petcaremanagement.Repository.ProductRepository productRepository;
    private final com.example.petcaremanagement.Repository.VetRepository vetRepository;
    private final com.example.petcaremanagement.Repository.ServicesTypeRepository servicesTypeRepository;
    private final com.example.petcaremanagement.Repository.OrderRepository orderRepository;
    private final com.example.petcaremanagement.Repository.WeightRecordRepository weightRecordRepository;

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/";

    private static final String SYSTEM_PROMPT = """
            Bạn là PetCare AI - Trợ lý toàn năng của Veterinary Clinic.
            Bạn có quyền truy cập TOÀN BỘ hệ thống để hỗ trợ khách hàng tốt nhất.
            
            CÁC CÔNG CỤ BẠN CÓ:
            1. getUserPets: Danh sách thú cưng của người dùng.
            2. getPetMedicalRecords: Lịch sử bệnh án.
            3. getPetVaccinations: Lịch sử tiêm phòng.
            4. getPetWeightHistory: Lịch sử cân nặng của thú cưng.
            5. getMyAppointments: Lịch hẹn của người dùng.
            6. getAllVets: Danh sách các bác sĩ trong hệ thống và chuyên môn của họ.
            7. getClinicServices: Danh sách các dịch vụ phòng khám đang cung cấp.
            8. getProducts: Danh sách sản phẩm (Thức ăn, Phụ kiện, Thuốc).
            9. getUserOrders: Lịch sử mua hàng của người dùng.

            QUY TẮC:
            - Khi được hỏi về bác sĩ, hãy dùng `getAllVets`.
            - Khi được hỏi về dịch vụ hoặc giá, hãy dùng `getClinicServices`.
            - Luôn trả lời đầy đủ, chi tiết và có cấu trúc.
            - Nếu không có dữ liệu, hãy xin lỗi và gợi ý liên hệ hotline 0382562504.
            """;

    @Override
    public ChatResponse chat(ChatRequest request) {
        log.info("Processing chatbot message locally (Gemini bypassed): {}", request.getMessage());
        return handleLocalChat(request);
    }

    private ChatResponse handleLocalChat(ChatRequest request) {
        String message = request.getMessage() != null ? request.getMessage().trim().toLowerCase() : "";
        Long userId = request.getUserId();
        StringBuilder reply = new StringBuilder();

        // 1. GREETINGS
        if (message.equals("chào") || message.equals("xin chào") || message.contains("hi") || message.contains("hello") || message.contains("chào bác sĩ") || message.contains("chào bạn") || message.contains("alo")) {
            reply.append("👋 **Xin chào! Mình là PetCare AI** - Trợ lý phòng khám thú y PetCare.\n\n");
            reply.append("Mình có thể hỗ trợ bạn các thông tin sau:\n");
            reply.append("- 🏥 **Dịch vụ & Bảng giá** (Nhập 'bảng giá' hoặc 'dịch vụ')\n");
            reply.append("- 👩‍⚕️ **Đội ngũ bác sĩ** (Nhập 'bác sĩ' hoặc 'vet')\n");
            reply.append("- 🐶 **Thú cưng của bạn** (Nhập 'thú cưng' hoặc 'pet')\n");
            reply.append("- 📅 **Lịch hẹn & Đặt lịch khám** (Nhập 'lịch hẹn' hoặc 'đặt lịch')\n");
            reply.append("- 💉 **Tra cứu tiêm phòng & bệnh án** (Nhập 'tiêm phòng' hoặc 'bệnh án')\n");
            reply.append("- 🛍️ **Cửa hàng mua sắm** (Nhập 'sản phẩm' hoặc 'thức ăn')\n");
            reply.append("- 📍 **Thông tin liên hệ & giờ mở cửa** (Nhập 'địa chỉ' hoặc 'giờ làm việc')\n\n");
            reply.append("Chúc bạn và bé cưng một ngày ngập tràn niềm vui! 🐶🐱❤️");
        }
        // 2. THANKS / POLITE ENDINGS
        else if (message.contains("cảm ơn") || message.contains("cám ơn") || message.contains("thank") || message.contains("tạm biệt") || message.contains("bye")) {
            reply.append("💖 **Dạ, PetCare luôn sẵn lòng hỗ trợ bạn!**\n\n");
            reply.append("Nếu bạn cần hỗ trợ thêm thông tin gì khác, đừng ngần ngại chat với mình nhé.\n");
            reply.append("Chúc bé cưng của bạn luôn khỏe mạnh, năng động và hạnh phúc! Hẹn gặp lại bạn sớm! 🐾✨");
        }
        // 3. EMERGENCY / KHẨN CẤP
        else if (message.contains("cấp cứu") || message.contains("khẩn cấp") || message.contains("nguy kịch") || message.contains("tai nạn") || message.contains("cứu")) {
            reply.append("🚨🚨 **CẢNH BÁO TÌNH TRẠNG KHẨN CẤP!** 🚨🚨\n\n");
            reply.append("Nếu bé cưng của bạn đang gặp các tình trạng nguy kịch như: Khó thở nguy kịch, chảy máu nhiều, nuốt phải dị vật/chất độc, co giật hoặc bất tỉnh:\n\n");
            reply.append("1️⃣ **Hãy giữ bình tĩnh:** Đặt bé ở nơi khô ráo, thoáng mát và tránh di chuyển mạnh.\n");
            reply.append("2️⃣ **Không tự ý cho uống thuốc:** Khi chưa có chỉ dẫn của bác sĩ thú y.\n");
            reply.append("3️⃣ **Liên hệ khẩn cấp:** Gọi ngay số Hotline Cấp Cứu **0382562504** hoạt động 24/7.\n");
            reply.append("4️⃣ **Mang bé đến phòng khám gần nhất:** Địa chỉ phòng khám chính của chúng tôi tại **PetCare Clinic, Hà Nội** luôn có đội ngũ bác sĩ trực khẩn cấp.\n\n");
            reply.append("🏥 *Chúng tôi luôn sẵn sàng túc trực để bảo vệ sự sống cho bé cưng của bạn!*");
        }
        // 4. CONTACT / LOCATION / HOURS
        else if (message.contains("địa chỉ") || message.contains("ở đâu") || message.contains("bản đồ") || message.contains("đường đi") || message.contains("giờ") || message.contains("mở cửa") || message.contains("đóng cửa") || message.contains("thời gian") || message.contains("hotline") || message.contains("sđt") || message.contains("liên hệ")) {
            reply.append("📍 **Thông tin liên hệ & Thời gian làm việc của PetCare:**\n\n");
            reply.append("- 🏢 **Trụ sở chính:** 12 Chùa Bộc, Đống Đa, Hà Nội.\n");
            reply.append("- 📞 **Hotline hỗ trợ:** 0382562504 (Hỗ trợ 24/7).\n");
            reply.append("- ✉️ **Email liên hệ:** nguyentienhien432004@gmail.com\n");
            reply.append("- ⏰ **Giờ mở cửa:**\n");
            reply.append("  - *Thứ 2 - Thứ Sáu:* 08:00 - 21:00\n");
            reply.append("  - *Thứ 7 & Chủ Nhật:* 08:00 - 22:00\n");
            reply.append("  - *(Dịch vụ cấp cứu túc trực 24/7)*\n\n");
            reply.append("🚗 Hân hạnh được đón tiếp bạn và bé cưng ghé thăm!");
        }
        // 5. SERVICES & PRICES
        else if (message.contains("dịch vụ") || message.contains("giá") || message.contains("bảng giá") || message.contains("chi phí") || message.contains("dich vu") || message.contains("gia")) {
            reply.append("🏥 **Danh sách dịch vụ và bảng giá tại PetCare:**\n\n");
            List<com.example.petcaremanagement.Entity.ServicesType> services = servicesTypeRepository.findAll();
            if (services.isEmpty()) {
                reply.append("Hiện chưa có thông tin dịch vụ. Vui lòng liên hệ hotline 0382562504.\n");
            } else {
                for (com.example.petcaremanagement.Entity.ServicesType service : services) {
                    reply.append(String.format("- **%s**: %,.0f VNĐ\n  *%s*\n\n", 
                        service.getName(), service.getPrice(), service.getDescription() != null ? service.getDescription() : "Đang cập nhật"));
                }
            }
            reply.append("💡 *Bạn muốn đặt lịch hẹn dịch vụ nào không? Hãy nhập 'đặt lịch' để được hướng dẫn nhé!*");
        }
        // 6. VETS / DOCTORS
        else if (message.contains("bác sĩ") || message.contains("bác sỹ") || message.contains("vet") || message.contains("bac si")) {
            reply.append("👩‍⚕️👨‍⚕️ **Đội ngũ bác sĩ thú y tại PetCare:**\n\n");
            List<com.example.petcaremanagement.Entity.Vet> vets = vetRepository.findAll();
            if (vets.isEmpty()) {
                reply.append("Hiện chưa có thông tin bác sĩ trên hệ thống.\n");
            } else {
                for (com.example.petcaremanagement.Entity.Vet vet : vets) {
                    reply.append(String.format("- **Bác sĩ %s**\n  - Chuyên khoa: %s\n  - SĐT: %s\n  - Địa chỉ phòng khám: %s\n\n", 
                        vet.getName(), vet.getSpecialty() != null ? vet.getSpecialty() : "Đa khoa", vet.getPhoneNumber(), vet.getClinicAddress() != null ? vet.getClinicAddress() : "PetCare Clinic"));
                }
            }
        }
        // 7. APPOINTMENTS / BOOKING
        else if (message.contains("lịch hẹn") || message.contains("lich hen") || message.contains("lịch khám") || message.contains("đặt lịch") || message.contains("dat lich")) {
            if (userId == null) {
                reply.append("🔑 Bạn vui lòng đăng nhập tài khoản để tra cứu lịch hẹn cá nhân hoặc thực hiện đặt lịch khám nhé!");
            } else {
                List<com.example.petcaremanagement.Entity.Appointment> appointments = appointmentRepository.findByUserId(userId);
                if (appointments.isEmpty()) {
                    reply.append("📅 Bạn chưa có lịch hẹn nào sắp tới.\n\n");
                } else {
                    reply.append("📅 **Lịch hẹn của bạn:**\n\n");
                    for (com.example.petcaremanagement.Entity.Appointment app : appointments) {
                        String vetName = app.getVet() != null ? app.getVet().getName() : "Chưa phân công";
                        String status = app.getStatus() != null ? app.getStatus() : "Đang xử lý";
                        reply.append(String.format("- **Mã cuộc hẹn:** #%d\n  - Ngày khám: %s\n  - Bác sĩ: %s\n  - Trạng thái: %s\n\n", 
                            app.getId(), app.getDate() != null ? app.getDate().toString() : "Đang cập nhật", vetName, status));
                    }
                }
                reply.append("👉 **Để đặt lịch hẹn mới:** Vui lòng truy cập menu **Đặt lịch** trên thanh điều hướng để chọn bác sĩ và thời gian khám phù hợp nhé!");
            }
        }
        // 8. USER PETS
        else if (message.contains("thú cưng") || message.contains("thu cung") || message.contains("pet") || message.contains("chó") || message.contains("mèo")) {
            if (userId == null) {
                reply.append("🐶🐱 Vui lòng đăng nhập để xem danh sách thú cưng của bạn.");
            } else {
                List<com.example.petcaremanagement.Entity.Pet> pets = petRepository.findByOwnerId(userId);
                if (pets.isEmpty()) {
                    reply.append("🐾 Bạn chưa đăng ký bé thú cưng nào trong hệ thống. Hãy thêm thú cưng của bạn ở mục quản lý thú cưng nhé!");
                } else {
                    reply.append("🐶🐱 **Danh sách bé cưng của bạn:**\n\n");
                    for (com.example.petcaremanagement.Entity.Pet pet : pets) {
                        reply.append(String.format("- **%s** (%s - %s)\n  - Tuổi: %d tháng\n  - Cân nặng: %.1f kg\n\n", 
                            pet.getName(), pet.getSpecies(), pet.getBreed() != null ? pet.getBreed() : "Chưa xác định", pet.getAge(), pet.getWeight() != null ? pet.getWeight() : 0.0f));
                    }
                }
            }
        }
        // 9. VACCINATIONS / TIÊM PHÒNG
        else if (message.contains("tiêm phòng") || message.contains("tiêm ngừa") || message.contains("tiem phong") || message.contains("vắc xin") || message.contains("vacxin")) {
            if (userId == null) {
                reply.append("💉 Vui lòng đăng nhập để tra cứu lịch tiêm phòng của thú cưng.");
            } else {
                List<com.example.petcaremanagement.Entity.Pet> pets = petRepository.findByOwnerId(userId);
                if (pets.isEmpty()) {
                    reply.append("🐾 Bạn chưa có thú cưng trên hệ thống để tra cứu tiêm phòng.");
                } else {
                    reply.append("💉 **Lịch sử tiêm phòng của thú cưng:**\n\n");
                    boolean hasVaccine = false;
                    for (com.example.petcaremanagement.Entity.Pet pet : pets) {
                        List<com.example.petcaremanagement.Entity.Vaccination> vaccinations = vaccinationRepository.findByPetIdOrderByVaccinationDateDesc(pet.getId());
                        if (vaccinations != null && !vaccinations.isEmpty()) {
                            hasVaccine = true;
                            reply.append(String.format("🐶🐱 **Bé %s:**\n", pet.getName()));
                            for (com.example.petcaremanagement.Entity.Vaccination vac : vaccinations) {
                                reply.append(String.format("  - Vắc-xin: %s (Ngày tiêm: %s, Mũi tiếp theo: %s)\n", 
                                    vac.getVaccineName(), 
                                    vac.getVaccinationDate() != null ? vac.getVaccinationDate().toString() : "Đã tiêm", 
                                    vac.getNextDueDate() != null ? vac.getNextDueDate().toString() : "Chưa có"));
                            }
                            reply.append("\n");
                        }
                    }
                    if (!hasVaccine) {
                        reply.append("Hiện tại chưa có ghi nhận tiêm phòng nào cho các bé cưng của bạn.\n");
                    }
                }
            }
        }
        // 10. HEALTH / MEDICAL RECORDS
        else if (message.contains("bệnh án") || message.contains("sức khỏe") || message.contains("benh an") || message.contains("khám bệnh")) {
            if (userId == null) {
                reply.append("🏥 Vui lòng đăng nhập để tra cứu bệnh án thú cưng.");
            } else {
                List<com.example.petcaremanagement.Entity.Pet> pets = petRepository.findByOwnerId(userId);
                if (pets.isEmpty()) {
                    reply.append("🐾 Bạn chưa có thú cưng để xem lịch sử bệnh án.");
                } else {
                    reply.append("🏥 **Lịch sử bệnh án & khám bệnh:**\n\n");
                    boolean hasRecord = false;
                    for (com.example.petcaremanagement.Entity.Pet pet : pets) {
                        List<com.example.petcaremanagement.Entity.MedicalRecord> records = medicalRecordRepository.findByPetIdOrderByVisitDateDesc(pet.getId());
                        if (records != null && !records.isEmpty()) {
                            hasRecord = true;
                            reply.append(String.format("🐾 **Bé %s:**\n", pet.getName()));
                            for (com.example.petcaremanagement.Entity.MedicalRecord record : records) {
                                reply.append(String.format("  - Ngày khám: %s\n  - Chẩn đoán: %s\n  - Điều trị: %s\n", 
                                    record.getVisitDate() != null ? record.getVisitDate().toString() : "Chưa rõ", 
                                    record.getDiagnosis(), 
                                    record.getTreatment() != null ? record.getTreatment() : "Theo dõi"));
                            }
                            reply.append("\n");
                        }
                    }
                    if (!hasRecord) {
                        reply.append("Hiện chưa có bệnh án nào được ghi nhận cho thú cưng của bạn.\n");
                    }
                }
            }
        }
        // 11. PRODUCTS
        else if (message.contains("sản phẩm") || message.contains("thức ăn") || message.contains("phụ kiện") || message.contains("thuốc") || message.contains("san pham")) {
            reply.append("🛍️ **Danh mục sản phẩm tại PetCare Clinic:**\n\n");
            reply.append("- 🥩 **Thức ăn**: Các loại hạt dinh dưỡng, pate cho chó mèo.\n");
            reply.append("- 🧸 **Phụ kiện**: Vòng cổ, sữa tắm, đồ chơi, nhà cây.\n");
            reply.append("- 💊 **Thuốc**: Thuốc bổ, trị rận, tẩy giun.\n\n");
            reply.append("👉 *Bạn có thể truy cập trang **Cửa hàng** trên hệ thống để xem chi tiết hình ảnh và mua sắm trực tuyến!*");
        }
        // 12. HEALTH TIPS / DIET / NUTRITION / GROOMING
        else if (message.contains("ăn uống") || message.contains("dinh dưỡng") || message.contains("ăn gì") || message.contains("không nên ăn") || message.contains("tắm") || message.contains("vệ sinh") || message.contains("chải lông") || message.contains("rận")) {
            reply.append("🥗🚿 **Lời khuyên sức khỏe & Chăm sóc thú cưng từ bác sĩ thú y:**\n\n");
            reply.append("🚫 **Thực phẩm NGUY HIỂM TUYỆT ĐỐI không cho chó mèo ăn:**\n");
            reply.append("- 🍫 **Sô-cô-la & Cà phê:** Gây ngộ độc tim mạch và thần kinh.\n");
            reply.append("- 🍇 **Nho tươi & Nho khô:** Gây suy thận cấp tính.\n");
            reply.append("- 🧅 **Hành & Tỏi:** Phá hủy hồng cầu, gây thiếu máu nghiêm trọng.\n");
            reply.append("- 🦴 **Xương nhỏ (như xương gà):** Dễ gãy vỡ gây đâm thủng ruột.\n\n");
            reply.append("🛁 **Lời khuyên vệ sinh & chải lông:**\n");
            reply.append("- **Tắm cho chó/mèo:** Nên tắm 1-2 tuần/lần bằng sữa tắm chuyên dụng.\n");
            reply.append("- **Chải lông hàng ngày:** Giúp giảm thiểu lông rụng bám vào nhà và kích thích mọc lông mới bóng mượt.\n");
            reply.append("- **Phòng trừ ký sinh trùng:** Nên nhỏ thuốc trị rận và tẩy giun định kỳ mỗi 1-3 tháng/lần.");
        }
        // 13. SHOPPING ORDERS & PURCHASE HISTORY
        else if (message.contains("đơn hàng") || message.contains("mua hàng") || message.contains("lịch sử mua") || message.contains("order")) {
            if (userId == null) {
                reply.append("🛍️ Vui lòng đăng nhập để xem lịch sử đơn hàng của bạn.");
            } else {
                List<com.example.petcaremanagement.Entity.Order> orders = orderRepository.findByUserId(userId);
                if (orders.isEmpty()) {
                    reply.append("🛍️ Bạn chưa thực hiện đơn mua hàng nào trên hệ thống.\n\n");
                } else {
                    reply.append("🛍️ **Lịch sử đơn hàng của bạn:**\n\n");
                    for (com.example.petcaremanagement.Entity.Order order : orders) {
                        reply.append(String.format("- **Đơn hàng #%d**\n  - Ngày mua: %s\n  - Tổng tiền: %,.0f VNĐ\n  - Trạng thái: %s\n\n", 
                            order.getOrderId(), order.getOrderDate() != null ? order.getOrderDate().toString() : "Đang cập nhật", order.getTotalPrice(), order.getStatus() != null ? order.getStatus() : "Đã thanh toán"));
                    }
                }
                reply.append("👉 Để mua sắm thêm các sản phẩm tuyệt vời cho thú cưng, hãy ghé thăm mục **Cửa hàng** nhé!");
            }
        }
        // 14. FALLBACK (Alternative flow 4.1)
        else {
            reply.append("Xin lỗi, tôi chưa hiểu ý bạn... 😿\n\n");
            reply.append("Bạn có thể thử hỏi tôi bằng cách nhấn chọn các gợi ý nhanh hoặc hỏi về:\n");
            reply.append("- **Bảng giá & Dịch vụ** (ví dụ: 'Bảng giá dịch vụ')\n");
            reply.append("- **Thông tin bác sĩ** (ví dụ: 'Bác sĩ trực')\n");
            reply.append("- **Thú cưng của bạn** (ví dụ: 'Xem thú cưng')\n");
            reply.append("- **Lịch hẹn của bạn** (ví dụ: 'Xem lịch hẹn')\n");
            reply.append("- **Lời khuyên sức khỏe** (ví dụ: 'Dinh dưỡng cho thú cưng')\n");
            reply.append("- **Thông tin liên hệ & giờ mở cửa** (ví dụ: 'Giờ làm việc phòng khám')\n\n");
            reply.append("📞 Hoặc gọi trực tiếp Hotline **0382562504** để gặp nhân viên hỗ trợ!");
        }

        return ChatResponse.builder()
                .reply(reply.toString())
                .success(true)
                .conversationId(request.getConversationId())
                .build();
    }

    private Object executeTool(String name, Map<String, Object> args) {
        log.info("Executing tool: {} with args: {}", name, args);
        try {
            switch (name) {
                case "getUserPets":
                    return petRepository.findByOwnerId(Long.valueOf(args.get("userId").toString()));
                case "getPetMedicalRecords":
                    return medicalRecordRepository.findByPetIdOrderByVisitDateDesc(Long.valueOf(args.get("petId").toString()));
                case "getPetVaccinations":
                    return vaccinationRepository.findByPetIdOrderByVaccinationDateDesc(Long.valueOf(args.get("petId").toString()));
                case "getPetWeightHistory":
                    return weightRecordRepository.findByPetIdOrderByRecordDateDesc(Long.valueOf(args.get("petId").toString()));
                case "getMyAppointments":
                    return appointmentRepository.findByUserId(Long.valueOf(args.get("userId").toString()));
                case "getAllVets":
                    return vetRepository.findAll();
                case "getClinicServices":
                    return servicesTypeRepository.findAll();
                case "getProducts":
                    return productRepository.findByType((String) args.get("type"));
                case "getUserOrders":
                    return orderRepository.findByUserId(Long.valueOf(args.get("userId").toString()));
                default:
                    return "Tool not found";
            }
        } catch (Exception e) {
            log.error("Tool execution error", e);
            return "Error: " + e.getMessage();
        }
    }
}
