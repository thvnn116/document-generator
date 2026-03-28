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
      acc[field] = field === 'GIOI_TINH' ? 'Nam' : '';
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

  // Hàm thay thế placeholder trong previewTemplate
  const renderPreview = (template, data) => {
    let html = template;
    Object.keys(data).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, data[key] || '...');
    });
    return html;
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

          {/* Preview động */}
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
              dangerouslySetInnerHTML={{
                __html: renderPreview(currentType.previewTemplate, formData)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
