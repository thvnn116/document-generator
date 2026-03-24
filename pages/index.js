export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useEffect } from 'react';
import { vanbanTypes } from '../config/vanban-types';

export default function Home() {
  const [selectedType, setSelectedType] = useState(vanbanTypes[0].code);
  const currentType = vanbanTypes.find(t => t.code === selectedType);

  const schema = z.object(
    currentType.fields.reduce((acc, field) => {
      acc[field] = z.string().min(1, `Vui lòng nhập ${field}`);
      return acc;
    }, {})
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: currentType.fields.reduce((acc, field) => {
      acc[field] = '';
      return acc;
    }, {}),
  });

  const formData = watch();

  useEffect(() => {
    reset(
      currentType.fields.reduce((acc, field) => {
        acc[field] = '';
        return acc;
      }, {})
    );
  }, [selectedType, reset]);

  const getLabel = (field) => {
    const labels = {
      MS_HDLD: "Mã phụ lục",
      HO_TEN: "Họ tên người lao động",
      NGAY_SINH: "Ngày sinh",
      GIOI_TINH: "Giới tính",
      NGHE_NGHIEP: "Nghề nghiệp",
      BO_PHAN: "Bộ phận",
      MS_NV: "Mã số nhân viên",
      DC_THUONG_TRU: "Địa chỉ thường trú",
      SO_CMND: "Số CMND/CCCD",
      NGAY_CAP: "Ngày cấp",
      HOC_VAN: "Trình độ học vấn",
      CHUYEN_NGANH: "Chuyên ngành",
      MS_HD: "Mã hợp đồng gốc",
      NGAY_KY_HD: "Ngày ký hợp đồng gốc",
      MUC_LUONG: "Mức lương (VNĐ)",
      NGAY_HL: "Ngày hiệu lực",

      DIA_DIEM: "Địa điểm",
      DD: "Ngày",
      MM: "Tháng",
      YY: "Năm",
      DIEN_THOAI: "Số điện thoại",
      VI_TRI_CV: "Vị trí công việc",
      DC_CTY: "Địa chỉ công ty",
      NGAY_NHAN_VIEC: "Ngày nhận việc",
      TG_THUVIEC: "Thời gian thử việc (tháng)",
      PT_LUONG: "Phần trăm lương thử việc",
    };
    return labels[field] || field.replace(/_/g, ' ');
  };

  const onCreate = async (data) => {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, loaiVanBan: selectedType }),
      });

      if (!response.ok) throw new Error('Lỗi khi tạo file');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedType.toLowerCase()}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Có lỗi khi tạo file: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
          Tạo Văn Bản Hành Chính
        </h1>

        <div className="mb-8 flex justify-center">
          <div className="w-full max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">Chọn loại văn bản</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-lg"
            >
              {vanbanTypes.map((type) => (
                <option key={type.code} value={type.code}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <form onSubmit={handleSubmit(onCreate)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentType.fields.map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {getLabel(field)}
                    </label>
                    <input
                      {...register(field)}
                      placeholder={`Nhập ${getLabel(field)}`}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                    />
                    {errors[field] && <p className="mt-1 text-sm text-red-600">{errors[field].message}</p>}
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-10">
                <button
                  type="submit"
                  className="w-full md:w-auto px-12 py-4 bg-red-600 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 transition"
                >
                  Tạo {currentType.name}
                </button>
              </div>
            </form>
          </div>

          {/* Preview - ĐÃ LOẠI BỎ KHUNG NGOÀI, cho bung rộng tối đa */}
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Preview {currentType.name}
            </h2>

            {/* Đây là phần chính, đã được làm rộng và không còn khung thừa */}
            <div 
              className="mx-auto bg-white border border-gray-200 shadow-sm overflow-auto font-serif"
              style={{
                width: '100%',           // Bung rộng hết phần bên phải
                maxWidth: '210mm',       // Giới hạn tối đa bằng khổ A4
                minHeight: '297mm',
                padding: '28mm 22mm',    // Lề chuẩn Word
                lineHeight: '1.75',
                fontSize: '15.5pt',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              }}
            >
              {selectedType === "PLHD" && (
                <div>
                  <div className="text-center mb-10">
                    <h3 className="text-xl font-bold">CÔNG TY CỔ PHẦN XUẤT NHẬP KHẨU TASIFISH</h3>
                    <p className="text-sm mt-1">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                    <p className="text-sm">Độc Lập - Tự Do - Hạnh Phúc</p>
                    <p className="font-bold mt-6">Số: {formData.MS_HDLD || '...'}</p>
                    <h2 className="text-2xl font-bold mt-8">PHỤ LỤC HỢP ĐỒNG LAO ĐỘNG</h2>
                  </div>

                  <p className="mb-6 text-justify">
                    Chúng tôi, một bên là Ông/Bà: <strong>LÊ DUY HOÀNG</strong> Quốc tịch: Việt Nam<br />
                    Chức vụ: GIÁM ĐỐC<br />
                    Đại diện cho: CÔNG TY CỔ PHẦN XUẤT NHẬP KHẨU TASIFISH
                  </p>

                  <p className="mb-6 text-justify">
                    Và một bên là Ông/Bà: <strong>{formData.HO_TEN || '...'}</strong><br />
                    Quốc tịch: Việt Nam<br />
                    Ngày sinh: {formData.NGAY_SINH || '...'}<br />
                    Giới tính: {formData.GIOI_TINH || '...'}<br />
                    Nghề nghiệp: {formData.NGHE_NGHIEP || '...'}<br />
                    Bộ phận: {formData.BO_PHAN || '...'} Mã số: {formData.MS_NV || '...'}<br />
                    Địa chỉ thường trú: {formData.DC_THUONG_TRU || '...'}<br />
                    Số CMND: {formData.SO_CMND || '...'} Cấp ngày: {formData.NGAY_CAP || '...'}<br />
                    Trình độ học vấn: {formData.HOC_VAN || '...'}<br />
                    Chuyên ngành: {formData.CHUYEN_NGANH || '...'}
                  </p>

                  <p className="mb-6 text-justify">
                    Căn cứ Hợp đồng lao động số <strong>{formData.MS_HD || '...'}</strong> ký ngày <strong>{formData.NGAY_KY_HD || '...'}</strong> và nhu cầu sử dụng lao động, hai bên thỏa thuận thay đổi như sau:
                  </p>

                  <p className="font-bold mb-2">Điều 1. Nội dung thay đổi - bổ sung:</p>
                  <p className="mb-6 text-justify">
                    Các bên đồng ý thay đổi Hợp đồng lao động số {formData.MS_HD || '...'} như sau:<br />
                    Khoản 1, Điều 3 [Quyền lợi và nghĩa vụ của người lao động]<br />
                    - Mức lương chính theo tháng: <strong>{formData.MUC_LUONG || '...'} VNĐ</strong>
                  </p>

                  <p className="font-bold mb-2">Điều 2. Điều khoản thi hành:</p>
                  <p className="mb-6 text-justify">
                    Trừ những nội dung thay đổi nêu tại Điều 1, Phụ lục hợp đồng này, các nội dung khác trong hợp đồng lao động số {formData.MS_HD || '...'} không thay đổi.<br />
                    Phụ lục Hợp đồng lao động này là một phần không tách rời Hợp đồng lao động số {formData.MS_HD || '...'} và được làm thành 02 (hai) bản, các bản có giá trị pháp lý ngang nhau, mỗi bên giữ 01 (một) bản và có hiệu lực từ ngày <strong>{formData.NGAY_HL || '...'}</strong>.
                  </p>

                  <div className="mt-20 flex justify-between text-center">
                    <div>
                      <p className="font-bold">NGƯỜI LAO ĐỘNG</p>
                      <p>(Ký tên)</p>
                      <p className="mt-16 font-bold">{formData.HO_TEN || '...'}</p>
                    </div>
                    <div>
                      <p className="font-bold">NGƯỜI SỬ DỤNG LAO ĐỘNG</p>
                      <p>(Ký tên, đóng dấu)</p>
                      <p className="mt-16 font-bold">LÊ DUY HOÀNG</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedType === "TMNV" && (
                <div>
                  <div className="text-center mb-10">
                    <h3 className="text-xl font-bold uppercase">CÔNG TY TNHH TASIFISH</h3>
                    <h2 className="text-2xl font-bold mt-6">THƯ MỜI NHẬN VIỆC</h2>
                    <p className="font-bold mt-4">Mã số: {formData.MS_HD || '...'}</p>
                  </div>

                  <p className="mb-6 text-justify">
                    {formData.DIA_DIEM || '...'}, ngày {formData.DD || '...'} tháng {formData.MM || '...'} năm {formData.YY || '...'}
                  </p>

                  <p className="mb-6 text-justify">
                    Kính gửi Anh/Chị: <strong>{formData.HO_TEN || '...'}</strong><br />
                    Ngày tháng năm sinh: {formData.NGAY_SINH || '...'}<br />
                    Số điện thoại: {formData.DIEN_THOAI || '...'}<br />
                    Địa chỉ thường trú: {formData.DC_THUONG_TRU || '...'}
                  </p>

                  <p className="mb-6 text-justify">
                    Công Ty TNHH TASIFISH chân thành cảm ơn Anh/Chị đã quan tâm đến nhu cầu tuyển dụng và dành thời gian tiếp xúc, trao đổi với chúng tôi trong thời gian qua. Theo kết quả cuộc phỏng vấn, Công ty chúng tôi trân trọng mời Anh/Chị về cộng tác với các nội dung thỏa thuận cơ bản sau:
                  </p>

                  <p className="mb-4 text-justify">
                    1. Vị trí công việc: <strong>{formData.VI_TRI_CV || '...'}</strong><br />
                    2. Địa điểm làm việc: <strong>{formData.DC_CTY || '...'}</strong><br />
                    3. Chế độ làm việc: Toàn thời gian<br />
                    4. Thời gian làm việc: Sáng 07h00 đến 11h00; Chiều 13h00 đến 17h00<br />
                    5. Ngày nhận việc: <strong>{formData.NGAY_NHAN_VIEC || '...'}</strong>
                  </p>

                  <p className="mb-6 text-justify">
                    • Tổng lương chính thức: <strong>{formData.MUC_LUONG || '...'} VNĐ</strong><br />
                    • Mức lương chưa bao gồm công tác phí theo thực tế phát sinh.<br />
                    • Thử việc {formData.TG_THUVIEC || '...'} tháng nhận {formData.PT_LUONG || '...'}% mức lương chính thức, sau đó sẽ có đánh giá thử việc từ Ban Giám đốc.
                  </p>

                  <p className="mb-6 text-justify">
                    6. Trách nhiệm và quyền hạn chính: Theo mô tả công việc <strong>{formData.VI_TRI_CV || '...'}</strong>
                  </p>

                  <p className="mb-8 text-justify">
                    Chúng tôi hân hạnh chào đón Anh/Chị làm việc tại công ty và mong nhận được phản hồi từ Anh/Chị khi nhận được thư này.
                  </p>

                  <div className="mt-16 flex justify-between text-center">
                    <div>
                      <p className="font-bold">NGƯỜI LAO ĐỘNG</p>
                      <p>(Ký tên)</p>
                      <p className="mt-16 font-bold">{formData.HO_TEN || '...'}</p>
                    </div>
                    <div>
                      <p className="font-bold">CÔNG TY TNHH TASIFISH</p>
                      <p>GIÁM ĐỐC</p>
                      <p className="mt-16 font-bold">LÊ DUY HOÀNG</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
