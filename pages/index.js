export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  MS_HDLD: z.string().min(1, 'Vui lòng nhập mã phụ lục'),
  HO_TEN: z.string().min(1, 'Vui lòng nhập họ tên'),
  NGAY_SINH: z.string().min(1, 'Vui lòng nhập ngày sinh (dd/mm/yyyy)'),
  GIOI_TINH: z.string().min(1, 'Vui lòng chọn giới tính'),
  NGHE_NGHIEP: z.string().min(1, 'Vui lòng nhập nghề nghiệp'),
  BO_PHAN: z.string().min(1, 'Vui lòng nhập bộ phận'),
  MS_NV: z.string().min(1, 'Vui lòng nhập mã nhân viên'),
  DC_THUONG_TRU: z.string().min(1, 'Vui lòng nhập địa chỉ thường trú'),
  SO_CMND: z.string().min(9, 'Số CMND/CCCD phải từ 9 chữ số'),
  NGAY_CAP: z.string().min(1, 'Vui lòng nhập ngày cấp (dd/mm/yyyy)'),
  HOC_VAN: z.string().min(1, 'Vui lòng nhập trình độ học vấn'),
  CHUYEN_NGANH: z.string().optional(),
  MS_HD: z.string().min(1, 'Vui lòng nhập mã hợp đồng gốc'),
  NGAY_KY_HD: z.string().min(1, 'Vui lòng nhập ngày ký hợp đồng gốc (dd/mm/yyyy)'),
  MUC_LUONG: z.string().min(1, 'Vui lòng nhập mức lương'),
  NGAY_HL: z.string().min(1, 'Vui lòng nhập ngày hiệu lực (dd/mm/yyyy)'),
});

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Lỗi khi tạo file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'phuluc-hopdong.docx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      alert('Tạo file thành công! File đang tải về...');
    } catch (err) {
      setErrorMsg(err.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-gray-800">
          Tạo Phụ Lục Hợp Đồng Lao Động
        </h1>

        {errorMsg && (
          <p className="text-red-600 mb-4 text-center font-medium">{errorMsg}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">

            {/* Field 1 - Đã sửa label thành string thuần */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mã phụ lục (Số: {{MS_HDLD}})
              </label>
              <input
                {...register('MS_HDLD')}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-red-500 focus:border-red-500"
              />
              {errors.MS_HDLD && (
                <p className="text-red-500 text-sm mt-1">{errors.MS_HDLD.message}</p>
              )}
            </div>

            {/* Field 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Họ tên người lao động
              </label>
              <input
                {...register('HO_TEN')}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-red-500 focus:border-red-500"
              />
              {errors.HO_TEN && (
                <p className="text-red-500 text-sm mt-1">{errors.HO_TEN.message}</p>
              )}
            </div>

            {/* Field 3 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ngày sinh (dd/mm/yyyy)
              </label>
              <input
                {...register('NGAY_SINH')}
                placeholder="01/01/1998"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-red-500 focus:border-red-500"
              />
              {errors.NGAY_SINH && (
                <p className="text-red-500 text-sm mt-1">{errors.NGAY_SINH.message}</p>
              )}
            </div>

            {/* Field 4 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Giới tính
              </label>
              <select
                {...register('GIOI_TINH')}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Chọn</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
              {errors.GIOI_TINH && (
                <p className="text-red-500 text-sm mt-1">{errors.GIOI_TINH.message}</p>
              )}
            </div>

            {/* Field 5 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nghề nghiệp
              </label>
              <input
                {...register('NGHE_NGHIEP')}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-red-500 focus:border-red-500"
              />
              {errors.NGHE_NGHIEP && (
                <p className="text-red-500 text-sm mt-1">{errors.NGHE_NGHIEP.message}</p>
              )}
            </div>

            {/* Field 6 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bộ phận
              </label>
              <input
                {...register('BO_PHAN')}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-red-500 focus:border-red-500"
              />
              {errors.BO_PHAN && (
                <p className="text-red-500 text-sm mt-1">{errors.BO_PHAN.message}</p>
              )}
            </div>

            {/* Field 7 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mã số nhân viên
              </label>
              <input
                {...register('MS_NV')}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-red-500 focus:border-red-500"
              />
              {errors.MS_NV && (
                <p className="text-red-500 text-sm mt-1">{errors.MS_NV.message}</p>
              )}
            </div>

            {/* Field 8 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Địa chỉ thường trú
              </label>
              <input
                {...register('DC_THUONG_TRU')}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-red-500 focus:border-red-500"
              />
              {errors.DC_THUONG_TRU && (
                <p className="text-red-500 text-sm mt-1">{errors.DC_THUONG_TRU.message}</p>
              )}
            </div>

            {/* Field 9 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Số CMND/CCCD
              </label>
              <input
                {...register('SO_CMND')}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-red-500 focus:border-red-500"
              />
              {errors.SO_CMND && (
                <p className="text-red-500 text-sm mt-1">{errors.SO_CMND.message}</p>
              )}
            </div>

            {/* Field 10 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ngày cấp (dd/mm/yyyy)
              </label>
              <input
                {...register('NGAY_CAP')}
                placeholder="01/01/2020"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-red-500 focus:border-red-500"
              />
              {errors.NGAY_CAP && (
                <p className="text-red-500 text-sm mt-1">{errors.NGAY_CAP.message}</p>
              )}
            </div>

            {/* Field 11 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Trình độ học vấn
              </label>
              <input
                {...register('HOC_VAN')}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-red-500 focus:border-red-500"
              />
              {errors.HOC_VAN && (
                <p className="text-red-500 text-sm mt-1">{errors.HOC_VAN.message}</p>
              )}
            </div>

            {/* Field 12 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Chuyên ngành
              </label>
              <input
                {...register('CHUYEN_NGANH')}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-red-500 focus:border-red-500"
              />
              {errors.CHUYEN_NGANH && (
                <p className="text-red-500 text-sm mt-1">{errors.CHUYEN_NGANH.message}</p>
              )}
            </div>

            {/* Field 13 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mã hợp đồng gốc
              </label>
              <input
                {...register('MS_HD')}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-red-500 focus:border-red-500"
              />
              {errors.MS_HD && (
                <p className="text-red-500 text-sm mt-1">{errors.MS_HD.message}</p>
              )}
            </div>

            {/* Field 14 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ngày ký hợp đồng gốc (dd/mm/yyyy)
              </label>
              <input
                {...register('NGAY_KY_HD')}
                placeholder="01/01/2025"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-red-500 focus:border-red-500"
              />
              {errors.NGAY_KY_HD && (
                <p className="text-red-500 text-sm mt-1">{errors.NGAY_KY_HD.message}</p>
              )}
            </div>

            {/* Field 15 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mức lương (VNĐ)
              </label>
              <input
                {...register('MUC_LUONG')}
                placeholder="15.000.000"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-red-500 focus:border-red-500"
              />
              {errors.MUC_LUONG && (
                <p className="text-red-500 text-sm mt-1">{errors.MUC_LUONG.message}</p>
              )}
            </div>

            {/* Field 16 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ngày hiệu lực (dd/mm/yyyy)
              </label>
              <input
                {...register('NGAY_HL')}
                placeholder="01/03/2026"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-red-500 focus:border-red-500"
              />
              {errors.NGAY_HL && (
                <p className="text-red-500 text-sm mt-1">{errors.NGAY_HL.message}</p>
              )}
            </div>

          </div>

          <div className="text-center mt-8">
            <button
              type="submit"
              disabled={loading}
              className={`bg-red-600 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition disabled:opacity-50 ${
                loading ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {loading ? 'Đang tạo hợp đồng...' : 'Tạo Phụ Lục Hợp Đồng'}
            </button>
          </div>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500">
          Dữ liệu được bảo mật và chỉ dùng để tạo file hợp đồng. Không lưu trữ.
        </p>
      </div>
    </div>
  );
}
