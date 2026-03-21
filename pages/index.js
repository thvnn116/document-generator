export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { renderAsync } from 'docx-preview';

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
  const [previewBlob, setPreviewBlob] = useState(null);
  const previewRef = useRef(null);

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
    setPreviewBlob(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Lỗi khi tạo file');

      const blob = await response.blob();
      setPreviewBlob(blob);  // Lưu blob để preview

      // Render preview
      if (previewRef.current) {
        previewRef.current.innerHTML = ''; // Xóa preview cũ
        await renderAsync(blob, previewRef.current, null, {
          ignoreWidth: true,
          ignoreHeight: true,
        });
      }

      // Tự động tải về sau khi preview thành công (bạn có thể bỏ nếu chỉ muốn xem trước)
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'phuluc-hopdong.docx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setSuccessMsg('Tạo phụ lục thành công! File đã tải về và hiển thị preview bên dưới.');
    } catch (err) {
      alert('Có lỗi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
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
              {/* Field 1 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mã Phụ Lục</label>
                <input
                  {...register('MS_HDLD')}
                  placeholder="VD: 001/2026"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                />
                {errors.MS_HDLD && <p className="mt-1 text-sm text-red-600">{errors.MS_HDLD.message}</p>}
              </div>

              {/* Field 2 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên người lao động</label>
                <input
                  {...register('HO_TEN')}
                  placeholder="VD: Nguyễn Văn A"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                />
                {errors.HO_TEN && <p className="mt-1 text-sm text-red-600">{errors.HO_TEN.message}</p>}
              </div>

              {/* Field 3 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                <input
                  {...register('NGAY_SINH')}
                  placeholder="VD: 01/01/1998"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                />
                {errors.NGAY_SINH && <p className="mt-1 text-sm text-red-600">{errors.NGAY_SINH.message}</p>}
              </div>

              {/* Field 4 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                <select
                  {...register('GIOI_TINH')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                >
                  <option value="">Chọn</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
                {errors.GIOI_TINH && <p className="mt-1 text-sm text-red-600">{errors.GIOI_TINH.message}</p>}
              </div>

              {/* Field 5 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nghề nghiệp</label>
                <input
                  {...register('NGHE_NGHIEP')}
                  placeholder="VD: Nhân viên kho vận"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                />
                {errors.NGHE_NGHIEP && <p className="mt-1 text-sm text-red-600">{errors.NGHE_NGHIEP.message}</p>}
              </div>

              {/* Field 6 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bộ phận</label>
                <input
                  {...register('BO_PHAN')}
                  placeholder="VD: Kho vận"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                />
                {errors.BO_PHAN && <p className="mt-1 text-sm text-red-600">{errors.BO_PHAN.message}</p>}
              </div>

              {/* Field 7 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mã số nhân viên</label>
                <input
                  {...register('MS_NV')}
                  placeholder="VD: TSF001"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                />
                {errors.MS_NV && <p className="mt-1 text-sm text-red-600">{errors.MS_NV.message}</p>}
              </div>

              {/* Field 8 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ thường trú</label>
                <input
                  {...register('DC_THUONG_TRU')}
                  placeholder="VD: Số 123, đường ABC, phường XYZ, TP. Vĩnh Long"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                />
                {errors.DC_THUONG_TRU && <p className="mt-1 text-sm text-red-600">{errors.DC_THUONG_TRU.message}</p>}
              </div>

              {/* Field 9 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số CMND/CCCD</label>
                <input
                  {...register('SO_CMND')}
                  placeholder="VD: 123456789"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                />
                {errors.SO_CMND && <p className="mt-1 text-sm text-red-600">{errors.SO_CMND.message}</p>}
              </div>

              {/* Field 10 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày cấp</label>
                <input
                  {...register('NGAY_CAP')}
                  placeholder="VD: 01/01/2020"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                />
                {errors.NGAY_CAP && <p className="mt-1 text-sm text-red-600">{errors.NGAY_CAP.message}</p>}
              </div>

              {/* Field 11 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trình độ học vấn</label>
                <input
                  {...register('HOC_VAN')}
                  placeholder="VD: 12/12"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                />
                {errors.HOC_VAN && <p className="mt-1 text-sm text-red-600">{errors.HOC_VAN.message}</p>}
              </div>

              {/* Field 12 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chuyên ngành</label>
                <input
                  {...register('CHUYEN_NGANH')}
                  placeholder="VD: Không hoặc Quản trị kinh doanh"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                />
                {errors.CHUYEN_NGANH && <p className="mt-1 text-sm text-red-600">{errors.CHUYEN_NGANH.message}</p>}
              </div>

              {/* Field 13 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mã hợp đồng gốc</label>
                <input
                  {...register('MS_HD')}
                  placeholder="VD: HD001"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                />
                {errors.MS_HD && <p className="mt-1 text-sm text-red-600">{errors.MS_HD.message}</p>}
              </div>

              {/* Field 14 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày ký hợp đồng gốc</label>
                <input
                  {...register('NGAY_KY_HD')}
                  placeholder="VD: 01/01/2025"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                />
                {errors.NGAY_KY_HD && <p className="mt-1 text-sm text-red-600">{errors.NGAY_KY_HD.message}</p>}
              </div>

              {/* Field 15 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mức lương (VNĐ)</label>
                <input
                  {...register('MUC_LUONG')}
                  placeholder="VD: 15.000.000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                />
                {errors.MUC_LUONG && <p className="mt-1 text-sm text-red-600">{errors.MUC_LUONG.message}</p>}
              </div>

              {/* Field 16 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày hiệu lực</label>
                <input
                  {...register('NGAY_HL')}
                  placeholder="VD: 01/03/2026"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                />
                {errors.NGAY_HL && <p className="mt-1 text-sm text-red-600">{errors.NGAY_HL.message}</p>}
              </div>
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

          {/* Phần preview */}
          {previewBlob && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Preview Phụ Lục Hợp Đồng</h2>
              <div
                ref={previewRef}
                className="border border-gray-300 rounded-lg p-4 bg-white min-h-[400px] overflow-auto"
              />
            </div>
          )}

          <p className="text-center mt-8 text-sm text-gray-500">
            Dữ liệu được bảo mật và chỉ dùng để tạo file hợp đồng. Không lưu trữ.
          </p>
        </div>
      </div>
    </div>
  );
}
