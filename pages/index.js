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

  // Tạo schema động
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

  // Reset form khi đổi loại
  useEffect(() => {
    reset(
      currentType.fields.reduce((acc, field) => {
        acc[field] = '';
        return acc;
      }, {})
    );
  }, [selectedType, reset]);

  // Label tiếng Việt đẹp
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

      // Fields cho Thư mời nhận việc
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

        {/* Dropdown */}
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
          {/* Form động */}
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

          {/* Preview */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Preview {currentType.name}
            </h2>
            <div className="prose prose-sm md:prose-base max-w-none border border-gray-200 rounded-lg p-6 bg-white min-h-[800px] overflow-auto leading-relaxed">
              <p className="text-gray-500 italic text-center">
                (Preview sẽ được cập nhật theo loại văn bản và dữ liệu bạn nhập)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
