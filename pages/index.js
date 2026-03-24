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
        acc[field] = field === 'GIOI_TINH' ? 'Nam' : '';
        return acc;
      }, {})
    );
  }, [selectedType, reset]);

  const getLabel = (field) => {
    const labels = {
      MS_HDLD: "Mã phụ lục", HO_TEN: "Họ tên người lao động", NGAY_SINH: "Ngày sinh",
      GIOI_TINH: "Giới tính", NGHE_NGHIEP: "Nghề nghiệp", BO_PHAN: "Bộ phận",
      MS_NV: "Mã số nhân viên", DC_THUONG_TRU: "Địa chỉ thường trú",
      SO_CMND: "Số CMND/CCCD", NGAY_CAP: "Ngày cấp", HOC_VAN: "Trình độ học vấn",
      CHUYEN_NGANH: "Chuyên ngành", MS_HD: "Mã hợp đồng gốc",
      NGAY_KY_HD: "Ngày ký hợp đồng gốc", MUC_LUONG: "Mức lương (VNĐ)",
      NGAY_HL: "Ngày hiệu lực",

      DIA_DIEM: "Địa điểm", DD: "Ngày", MM: "Tháng", YY: "Năm",
      DIEN_THOAI: "Số điện thoại", VI_TRI_CV: "Vị trí công việc",
      DC_CTY: "Địa chỉ công ty", NGAY_NHAN_VIEC: "Ngày nhận việc",
      TG_THUVIEC: "Thời gian thử việc (tháng)", PT_LUONG: "Phần trăm lương thử việc",
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-[1480px] mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Tạo Văn Bản Hành Chính
        </h1>

        <div className="flex justify-center mb-10">
          <div className="w-full max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">Chọn loại văn bản</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-5 py-3.5 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg"
            >
              {vanbanTypes.map((type) => (
                <option key={type.code} value={type.code}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Form */}
          <div className="xl:col-span-5 bg-white rounded-3xl shadow-xl p-8">
            <form onSubmit={handleSubmit(onCreate)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentType.fields.map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {getLabel(field)}
                    </label>

                    {/* === ĐẶC BIỆT CHO GIỚI TÍNH === */}
                    {field === 'GIOI_TINH' ? (
                      <select
                        {...register(field)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
                      >
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                      </select>
                    ) : (
                      <input
                        {...register(field)}
                        placeholder={`Nhập ${getLabel(field)}`}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    )}

                    {errors[field] && <p className="mt-1 text-sm text-red-600">{errors[field].message}</p>}
                  </div>
                ))}
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-2xl transition shadow-lg"
                >
                  Tạo {currentType.name}
                </button>
              </div>
            </form>
          </div>

          {/* Preview */}
          <div className="xl:col-span-7 bg-white rounded-3xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Preview {currentType.name}
            </h2>

            <div 
              className="mx-auto bg-white border border-gray-200 shadow-sm overflow-auto font-serif"
              style={{
                width: '100%',
                maxWidth: '950px',
                minHeight: '950px',
                padding: '30mm 25mm',
                lineHeight: '1.65',
                fontSize: '14.2pt',
              }}
            >
              {selectedType === "PLHD" && (
                <div>
                  <div className="text-center mb-12">
                    <h3 className="text-[18pt] font-bold">CÔNG TY CỔ PHẦN XUẤT NHẬP KHẨU TASIFISH</h3>
                    <p className="text-sm">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                    <p className="text-sm">Độc Lập - Tự Do - Hạnh Phúc</p>
                    <p className="font-bold mt-8">Số: {formData.MS_HDLD || '...'}</p>
                    <h2 className="text-[19pt] font-bold mt-10">PHỤ LỤC HỢP ĐỒNG LAO ĐỘNG</h2>
                  </div>

                  <p className="mb-8 text-justify text-[14.2pt]">
                    Chúng tôi, một bên là Ông/Bà: <strong>LÊ DUY HOÀNG</strong> Quốc tịch: Việt Nam<br />
                    Chức vụ: GIÁM ĐỐC<br />
                    Đại diện cho: CÔNG TY CỔ PHẦN XUẤT NHẬP KHẨU TASIFISH
                  </p>

                  <p className="mb-8 text-justify text-[14.2pt]">
                    Và một bên là Ông/Bà: <strong>{formData.HO_TEN || '...'}</strong><br />
                    Ngày sinh: {formData.NGAY_SINH || '...'} Giới tính: <strong>{formData.GIOI_TINH || '...'}</strong><br />
                    Nghề nghiệp: {formData.NGHE_NGHIEP || '...'} Bộ phận: {formData.BO_PHAN || '...'} Mã số: {formData.MS_NV || '...'}<br />
                    Địa chỉ thường trú: {formData.DC_THUONG_TRU || '...'}<br />
                    Số CMND/CCCD: {formData.SO_CMND || '...'} Cấp ngày: {formData.NGAY_CAP || '...'}<br />
                    Trình độ học vấn: {formData.HOC_VAN || '...'} Chuyên ngành: {formData.CHUYEN_NGANH || '...'}
                  </p>

                  <p className="mb-8 text-justify text-[14.2pt]">
                    Căn cứ Hợp đồng lao động số <strong>{formData.MS_HD || '...'}</strong> ký ngày <strong>{formData.NGAY_KY_HD || '...'}</strong> và nhu cầu sử dụng lao động, hai bên thỏa thuận thay đổi mức lương chính theo tháng thành <strong>{formData.MUC_LUONG || '...'} VNĐ</strong>, có hiệu lực từ ngày <strong>{formData.NGAY_HL || '...'}</strong>.
                  </p>

                  <div className="mt-28 flex justify-between text-center">
                    <div>
                      <p className="font-bold">NGƯỜI LAO ĐỘNG</p>
                      <p>(Ký tên)</p>
                      <p className="mt-20 font-bold">{formData.HO_TEN || '...'}</p>
                    </div>
                    <div>
                      <p className="font-bold">NGƯỜI SỬ DỤNG LAO ĐỘNG</p>
                      <p>(Ký tên, đóng dấu)</p>
                      <p className="mt-20 font-bold">LÊ DUY HOÀNG</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedType === "TMNV" && (
                <div>
                  <div className="text-center mb-12">
                    <h3 className="text-[18pt] font-bold">CÔNG TY TNHH TASIFISH</h3>
                    <h2 className="text-[20pt] font-bold mt-8">THƯ MỜI NHẬN VIỆC</h2>
                    <p className="font-bold mt-6">Mã số: {formData.MS_HD || '...'}</p>
                  </div>

                  <p className="mb-8 text-justify text-[14.2pt]">
                    {formData.DIA_DIEM || '...'}, ngày {formData.DD || '...'} tháng {formData.MM || '...'} năm {formData.YY || '...'}
                  </p>

                  <p className="mb-8 text-justify text-[14.2pt]">
                    Kính gửi Anh/Chị: <strong>{formData.HO_TEN || '...'}</strong><br />
                    Ngày sinh: {formData.NGAY_SINH || '...'} Số điện thoại: {formData.DIEN_THOAI || '...'}<br />
                    Địa chỉ thường trú: {formData.DC_THUONG_TRU || '...'}
                  </p>

                  <p className="mb-8 text-justify text-[14.2pt]">
                    Công Ty TNHH TASIFISH chân thành cảm ơn Anh/Chị đã quan tâm đến nhu cầu tuyển dụng...
                  </p>

                  <p className="mb-8 text-justify text-[14.2pt]">
                    1. Vị trí công việc: <strong>{formData.VI_TRI_CV || '...'}</strong><br />
                    2. Địa điểm làm việc: <strong>{formData.DC_CTY || '...'}</strong><br />
                    5. Ngày nhận việc: <strong>{formData.NGAY_NHAN_VIEC || '...'}</strong><br />
                    • Tổng lương chính thức: <strong>{formData.MUC_LUONG || '...'} VNĐ</strong><br />
                    • Thử việc {formData.TG_THUVIEC || '...'} tháng nhận {formData.PT_LUONG || '...'}% mức lương chính thức.
                  </p>

                  <div className="mt-24 flex justify-between text-center">
                    <div>
                      <p className="font-bold">NGƯỜI LAO ĐỘNG</p>
                      <p>(Ký tên)</p>
                      <p className="mt-20 font-bold">{formData.HO_TEN || '...'}</p>
                    </div>
                    <div>
                      <p className="font-bold">CÔNG TY TNHH TASIFISH</p>
                      <p>GIÁM ĐỐC</p>
                      <p className="mt-20 font-bold">LÊ DUY HOÀNG</p>
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
