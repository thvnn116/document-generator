// config/vanban-types.js
export const vanbanTypes = [
  {
    code: "PLHD",
    name: "Phụ lục hợp đồng lao động",
    templateFile: "phuluc-hopdong.docx",
    fields: [
      "MS_HDLD", "HO_TEN", "NGAY_SINH", "GIOI_TINH", "NGHE_NGHIEP",
      "BO_PHAN", "MS_NV", "DC_THUONG_TRU", "SO_CMND", "NGAY_CAP",
      "HOC_VAN", "CHUYEN_NGANH", "MS_HD", "NGAY_KY_HD", "MUC_LUONG", "NGAY_HL"
    ]
  },
  {
    code: "TMNV",
    name: "Thư mời nhận việc",
    templateFile: "thumoi-nhanviec.docx",
    fields: [
      "MS_HD", "HO_TEN", "NGAY_SINH", "DIEN_THOAI", "DC_THUONG_TRU",
      "VI_TRI_CV", "DC_CTY", "NGAY_NHAN_VIEC", "MUC_LUONG"
    ]
  }
];
