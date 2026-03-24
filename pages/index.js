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
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Tạo Văn Bản Hành Chính
        </h1>

        {/* Dropdown */}
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

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Form - chiếm 2 phần */}
          <div className="xl:col-span-2 bg-white rounded-3xl shadow-xl p-8">
            <form onSubmit={handleSubmit(onCreate)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentType.fields.map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {getLabel(field)}
                    </label>
                    <input
                      {...register(field)}
                      placeholder={`Nhập ${getLabel(field)}`}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
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

          {/* Preview - chiếm 3 phần, bung rộng tối đa */}
          <div className="xl:col-span-3 bg-white rounded-3xl shadow-xl p-6 overflow-hidden">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Preview {currentType.name}
            </h2>

            <div 
              className="mx-auto bg-white border border-gray-200 shadow-inner overflow-auto font-serif"
              style={{
                width: '100%',
                maxWidth: '850px',        // Bạn có thể tăng lên 900px nếu muốn rộng hơn
                minHeight: '920px',
                padding: '32mm 26mm',
                lineHeight: '1.75',
                fontSize: '15.2pt',
                margin: '0 auto',
              }}
            >
              {/* Nội dung PLHD */}
              {selectedType === "PLHD" && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold">CÔNG TY CỔ PHẦN XUẤT NHẬP KHẨU TASIFISH</h3>
                    <p className="mt-1">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                    <p>Độc Lập - Tự Do - Hạnh Phúc</p>
                    <p className="font-bold mt-8">Số: {formData.MS_HDLD || '...'}</p>
                    <h2 className="text-3xl font-bold mt-10">PHỤ LỤC HỢP ĐỒNG LAO ĐỘNG</h2>
                  </div>

                  {/* Nội dung PLHD rút gọn cho dễ nhìn */}
                  <p className="text-justify">
                    Chúng tôi, một bên là Ông/Bà: <strong>LÊ DUY HOÀNG</strong> Quốc tịch: Việt Nam, Chức vụ: GIÁM ĐỐC, Đại diện cho Công ty.<br /><br />
                    Và một bên là Ông/Bà: <strong>{formData.HO_TEN || '...'}</strong><br />
                    Ngày sinh: {formData.NGAY_SINH || '...'} Giới tính: {formData.GIOI_TINH || '...'}<br />
                    Nghề nghiệp: {formData.NGHE_NGHIEP || '...'} Bộ phận: {formData.BO_PHAN || '...'} Mã số: {formData.MS_NV || '...'}<br />
                    Địa chỉ thường trú: {formData.DC_THUONG_TRU || '...'}<br />
                    Số CMND/CCCD: {formData.SO_CMND || '...'} Cấp ngày: {formData.NGAY_CAP || '...'}
                  </p>

                  <p className="text-justify">
                    Căn cứ Hợp đồng lao động số <strong>{formData.MS_HD || '...'}</strong> ký ngày <strong>{formData.NGAY_KY_HD || '...'}</strong>, hai bên thỏa thuận thay đổi mức lương thành <strong>{formData.MUC_LUONG || '...'} VNĐ</strong> kể từ ngày <strong>{formData.NGAY_HL || '...'}</strong>.
                  </p>

                  <div className="mt-24 flex justify-between text-center">
                    <div>
                      <p className="font-bold">NGƯỜI LAO ĐỘNG</p>
                      <p className="mt-20 font-bold">{formData.HO_TEN || '...'}</p>
                    </div>
                    <div>
                      <p className="font-bold">NGƯỜI SỬ DỤNG LAO ĐỘNG</p>
                      <p className="mt-20 font-bold">LÊ DUY HOÀNG</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Nội dung TMNV */}
              {selectedType === "TMNV" && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold">CÔNG TY TNHH TASIFISH</h3>
                    <h2 className="text-3xl font-bold mt-8">THƯ MỜI NHẬN VIỆC</h2>
                    <p className="font-bold mt-6">Mã số: {formData.MS_HD || '...'}</p>
                  </div>

                  <p className="text-justify">
                    {formData.DIA_DIEM || '...'}, ngày {formData.DD || '...'} tháng {formData.MM || '...'} năm {formData.YY || '...'}
                  </p>

                  <p className="text-justify">
                    Kính gửi Anh/Chị: <strong>{formData.HO_TEN || '...'}</strong><br />
                    Ngày sinh: {formData.NGAY_SINH || '...'} Số điện thoại: {formData.DIEN_THOAI || '...'}<br />
                    Địa chỉ thường trú: {formData.DC_THUONG_TRU || '...'}
                  </p>

                  <p className="text-justify">
                    Công Ty TNHH TASIFISH chân thành cảm ơn Anh/Chị đã quan tâm đến nhu cầu tuyển dụng...
                  </p>

                  <p className="text-justify">
                    1. Vị trí công việc: <strong>{formData.VI_TRI_CV || '...'}</strong><br />
                    2. Địa điểm làm việc: <strong>{formData.DC_CTY || '...'}</strong><br />
                    5. Ngày nhận việc: <strong>{formData.NGAY_NHAN_VIEC || '...'}</strong><br />
                    • Tổng lương: <strong>{formData.MUC_LUONG || '...'} VNĐ</strong><br />
                    • Thử việc {formData.TG_THUVIEC || '...'} tháng nhận {formData.PT_LUONG || '...'}% lương chính thức.
                  </p>

                  <div className="mt-20 flex justify-between text-center">
                    <div>
                      <p className="font-bold">NGƯỜI LAO ĐỘNG</p>
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
