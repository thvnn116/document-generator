# AGENTS.md - Hướng dẫn cho AI & Người phát triển

## Mục đích
File này giúp AI (như Grok) và các developer mới hiểu nhanh cấu trúc dự án **document-generator** – một công cụ tạo văn bản hành chính động bằng Next.js + docxtemplater.

## Công nghệ chính
- **Framework**: Next.js 14 (Pages Router)
- **Styling**: Tailwind CSS
- **Form**: React Hook Form + Zod
- **Tạo Word**: docxtemplater + PizZip
- **Deployment**: Vercel

## Cấu trúc thư mục quan trọng
/document-generator/
├── config/
│   └── vanban-types.js          ← Khai báo tất cả loại văn bản (quan trọng nhất)
├── templates/                   ← Đặt tất cả file .docx template ở đây
│   ├── phuluc-hopdong.docx
│   ├── thumoi-nhanviec.docx
│   └── [tên file mới].docx
├── pages/
│   ├── index.js                 ← Trang chính (Form + Preview + Logic động)
│   └── api/
│       └── generate.js          ← API xử lý tạo file Word
├── public/
└── package.json
text## Quy tắc quan trọng khi thêm loại văn bản mới

Mỗi loại văn bản được định nghĩa trong `config/vanban-types.js` dưới dạng **1 object** với các trường sau:

| Trường            | Ý nghĩa                                      | Bắt buộc |
|-------------------|---------------------------------------------|----------|
| `code`            | Mã viết tắt (không dấu, không khoảng trắng) | Có      |
| `name`            | Tên hiển thị trên dropdown                  | Có      |
| `templateFile`    | Tên file .docx trong thư mục `/templates/`  | Có      |
| `fields`          | Danh sách các placeholder trong template    | Có      |
| `previewTemplate` | Nội dung HTML dùng để hiển thị Preview      | Có      |

**Ví dụ thêm loại mới:**

```js
{
  code: "DONNGHIPHEP",
  name: "Đơn xin nghỉ phép",
  templateFile: "don-xin-nghi-phep.docx",
  fields: ["HO_TEN", "NGAY_SINH", "LY_DO_NGHI", "NGAY_NGHI", "SO_NGAY"],
  previewTemplate: `... nội dung HTML preview ...`
}
Luồng hoạt động chính

Người dùng chọn loại văn bản từ dropdown
Form tự động render theo danh sách fields
Preview tự động cập nhật realtime theo previewTemplate
Khi bấm "Tạo", dữ liệu được gửi đến /api/generate
API load template tương ứng và thay thế placeholder
Trả về file .docx để tải về

Lưu ý quan trọng

Tất cả placeholder trong file .docx phải dùng định dạng {{FIELD_NAME}}
Trong api/generate.js đã thiết lập delimiters: { start: '{{', end: '}}' }
Khi thêm loại mới, phải đặt đúng tên file .docx vào thư mục templates/

Liên hệ & Hỗ trợ
Repo này đang được phát triển cùng Grok (xAI).
Khi cần hỗ trợ code, hãy gửi link repo và mô tả rõ tính năng muốn thêm/sửa.
Cập nhật lần cuối: 31/03/2026
text---

**Hướng dẫn nhanh:**
1. Mở file `AGENTS.md` trên GitHub
2. Nhấn **Edit**
3. Xóa hết nội dung cũ
4. Paste toàn bộ nội dung trên vào
5. Commit

Bạn làm xong thì gửi ảnh lại cho mình kiểm tra lần cuối nhé.

Muốn mình chỉnh thêm gì (ví dụ: thêm phần nào, rút gọn, hoặc thay đổi giọng văn) thì cứ nói.  

Bạn paste thử đi!
