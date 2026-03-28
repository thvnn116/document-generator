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
    ],
    previewTemplate: `
      <div class="text-center mb-12">
        <h3 class="text-[18pt] font-bold">CÔNG TY CỔ PHẦN XUẤT NHẬP KHẨU TASIFISH</h3>
        <p class="text-sm">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
        <p class="text-sm">Độc Lập - Tự Do - Hạnh Phúc</p>
        <p class="font-bold mt-8">Số: {{MS_HDLD}}</p>
        <h2 class="text-[19pt] font-bold mt-10">PHỤ LỤC HỢP ĐỒNG LAO ĐỘNG</h2>
      </div>

      <p class="mb-8 text-justify text-[14.2pt]">
        Chúng tôi, một bên là Ông/Bà: <strong>LÊ DUY HOÀNG</strong> Quốc tịch: Việt Nam<br />
        Chức vụ: GIÁM ĐỐC<br />
        Đại diện cho: CÔNG TY CỔ PHẦN XUẤT NHẬP KHẨU TASIFISH
      </p>

      <p class="mb-8 text-justify text-[14.2pt]">
        Và một bên là Ông/Bà: <strong>{{HO_TEN}}</strong><br />
        Ngày sinh: {{NGAY_SINH}} Giới tính: <strong>{{GIOI_TINH}}</strong><br />
        Nghề nghiệp: {{NGHE_NGHIEP}} Bộ phận: {{BO_PHAN}} Mã số: {{MS_NV}}<br />
        Địa chỉ thường trú: {{DC_THUONG_TRU}}<br />
        Số CMND/CCCD: {{SO_CMND}} Cấp ngày: {{NGAY_CAP}}<br />
        Trình độ học vấn: {{HOC_VAN}} Chuyên ngành: {{CHUYEN_NGANH}}
      </p>

      <p class="mb-8 text-justify text-[14.2pt]">
        Căn cứ Hợp đồng lao động số <strong>{{MS_HD}}</strong> ký ngày <strong>{{NGAY_KY_HD}}</strong>, hai bên thỏa thuận thay đổi mức lương chính theo tháng thành <strong>{{MUC_LUONG}} VNĐ</strong>, có hiệu lực từ ngày <strong>{{NGAY_HL}}</strong>.
      </p>

      <div class="mt-28 flex justify-between text-center">
        <div>
          <p class="font-bold">NGƯỜI LAO ĐỘNG</p>
          <p>(Ký tên)</p>
          <p class="mt-20 font-bold">{{HO_TEN}}</p>
        </div>
        <div>
          <p class="font-bold">NGƯỜI SỬ DỤNG LAO ĐỘNG</p>
          <p>(Ký tên, đóng dấu)</p>
          <p class="mt-20 font-bold">LÊ DUY HOÀNG</p>
        </div>
      </div>
    `
  },
  {
    code: "TMNV",
    name: "Thư mời nhận việc",
    templateFile: "thumoi-nhanviec.docx",
    fields: [
      "MS_HD", "DIA_DIEM", "DD", "MM", "YY", "HO_TEN", "NGAY_SINH",
      "DIEN_THOAI", "DC_THUONG_TRU", "VI_TRI_CV", "DC_CTY",
      "NGAY_NHAN_VIEC", "MUC_LUONG", "TG_THUVIEC", "PT_LUONG"
    ],
    previewTemplate: `
      <div class="text-center mb-12">
        <h3 class="text-[18pt] font-bold">CÔNG TY TNHH TASIFISH</h3>
        <h2 class="text-[20pt] font-bold mt-8">THƯ MỜI NHẬN VIỆC</h2>
        <p class="font-bold mt-6">Mã số: {{MS_HD}}</p>
      </div>

      <p class="mb-8 text-justify text-[14.2pt]">
        {{DIA_DIEM}}, ngày {{DD}} tháng {{MM}} năm {{YY}}
      </p>

      <p class="mb-8 text-justify text-[14.2pt]">
        Kính gửi Anh/Chị: <strong>{{HO_TEN}}</strong><br />
        Ngày sinh: {{NGAY_SINH}} Số điện thoại: {{DIEN_THOAI}}<br />
        Địa chỉ thường trú: {{DC_THUONG_TRU}}
      </p>

      <p class="mb-8 text-justify text-[14.2pt]">
        Công Ty TNHH TASIFISH chân thành cảm ơn Anh/Chị đã quan tâm đến nhu cầu tuyển dụng...
      </p>

      <p class="mb-8 text-justify text-[14.2pt]">
        1. Vị trí công việc: <strong>{{VI_TRI_CV}}</strong><br />
        2. Địa điểm làm việc: <strong>{{DC_CTY}}</strong><br />
        5. Ngày nhận việc: <strong>{{NGAY_NHAN_VIEC}}</strong><br />
        • Tổng lương chính thức: <strong>{{MUC_LUONG}} VNĐ</strong><br />
        • Thử việc {{TG_THUVIEC}} tháng nhận {{PT_LUONG}}% mức lương chính thức.
      </p>

      <div class="mt-24 flex justify-between text-center">
        <div>
          <p class="font-bold">NGƯỜI LAO ĐỘNG</p>
          <p>(Ký tên)</p>
          <p class="mt-20 font-bold">{{HO_TEN}}</p>
        </div>
        <div>
          <p class="font-bold">CÔNG TY TNHH TASIFISH</p>
          <p>GIÁM ĐỐC</p>
          <p class="mt-20 font-bold">LÊ DUY HOÀNG</p>
        </div>
      </div>
    `
  }
];
