# AGENTS.md - Hướng dẫn cho AI & Người phát triển

## Mục đích
File này giúp AI (như Grok) và các developer mới hiểu nhanh cấu trúc dự án "document-generator" – một công cụ tạo văn bản hành chính động bằng Next.js + docxtemplater.

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

## Quy tắc quan trọng khi thêm loại văn bản mới

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
