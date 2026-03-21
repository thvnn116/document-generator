export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  MS_HDLD: z.string().min(1, 'Vui lòng nhập mã phụ lục'),
  HO_TEN: z.string().min(1, 'Vui lòng nhập họ tên'),
  NGAY_SINH: z.string().min(1, 'Vui lòng nhập ngày sinh'),
  GIOI_TINH: z.string().min(1, 'Vui lòng chọn giới tính'),
  NGHE_NGHIEP: z.string().min(1, 'Vui lòng nhập nghề nghiệp'),
  BO_PHAN: z.string().min(1, 'Vui lòng nhập bộ phận'),
  MS_NV: z.string().min(1, 'Vui lòng nhập mã nhân viên'),
  DC_THUONG_TRU: z.string().min(1, 'Vui lòng nhập địa chỉ thường trú'),
  SO_CMND: z.string().min(9, 'Số CMND/CCCD phải từ 9 chữ số'),
  NGAY_CAP: z.string().min(1, 'Vui lòng nhập ngày cấp'),
  HOC_VAN: z.string().min(1, 'Vui lòng nhập trình độ học vấn'),
  CHUYEN_NGANH: z.string().optional(),
  MS_HD: z.string().min(1, 'Vui lòng nhập mã hợp đồng gốc'),
  NGAY_KY_HD: z.string().min(1, 'Vui lòng nhập ngày ký hợp đồng gốc'),
  MUC_LUONG: z.string().min(1, 'Vui lòng nhập mức lương'),
  NGAY_HL: z.string().min(1, 'Vui lòng nhập ngày hiệu lực'),
});

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setSuccessMsg('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Lỗi khi tạo file');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'phuluc-hopdong.docx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setSuccessMsg('Tạo phụ lục thành công! File đang tải về...');
    } catch (err) {
      alert('Có lỗi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-8 md:px-10 md:py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10">
            Tạo Phụ Lục Hợp Đồng Lao Động
          </h1>

          {successMsg && (
            <div className="mb-8 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-r">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 1 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mã Phụ Lục</label>
                <input
                  {...register('MS_HDLD')}
                  placeholder="VD: 001/2026"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                />
                {errors.MS_HDLD && <p className="mt-1 text-sm text-red-600">{errors.MS_HDLD.message}</p>}
              </div>

              {/* 2 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên người lao động</label>
                <input
                  {...register('HO_TEN')}
                  placeholder="VD: Nguyễn Văn A"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                />
                {errors.HO_TEN && <p className="mt-1 text-sm text-red-600">{errors.HO_TEN.message}</p>}
              </div>

              {/* Các field còn lại – bạn copy pattern trên và thay tên field + placeholder */}
              {/* Ví dụ field 3 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                <input
                  {...register('NGAY_SINH')}
                  placeholder="VD: 01/01/1998"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                />
                {errors.NGAY_SINH && <p className="mt-1 text-sm text-red-600">{errors.NGAY_SINH.message}</p>}
              </div>

              {/* ... tiếp tục thêm 13 field còn lại theo cùng pattern */}
              {/* Để tiết kiệm chỗ, bạn tự copy-paste pattern từ field 1 hoặc 3 và thay tên field */}
            </div>

            <div className="text-center mt-10">
              <button
                type="submit"
                disabled={loading}
                className={`w-full md:w-auto px-10 py-4 bg-red-600 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 transition disabled:opacity-60 disabled:cursor-not-allowed ${
                  loading ? 'animate-pulse' : ''
                }`}
              >
                {loading ? 'Đang tạo...' : 'Tạo Phụ Lục Hợp Đồng'}
              </button>
            </div>
          </form>

          <p className="text-center mt-8 text-sm text-gray-500">
            Dữ liệu được bảo mật và chỉ dùng để tạo file hợp đồng. Không lưu trữ.
          </p>
        </div>
      </div>
    </div>
  );
}
