import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';

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

  const { register, handleSubmit, formState: { errors } } = useForm({
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
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Tạo Phụ Lục Hợp Đồng Lao Động</h1>

        {errorMsg && <p className="text-red-600 mb-4 text-center">{errorMsg}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
                {/* 1 */}
                <div>
                  <label className="block text-sm font-medium">Mã phụ lục (Số: {{MS_HDLD}})</label>
                  <input {...register('MS_HDLD')} className="mt-1 block w-full border rounded-md p-2" />
                  {errors.MS_HDLD && <p className="text-red-500 text-sm">{errors.MS_HDLD.message}</p>}
                </div>
            
                {/* 2 */}
                <div>
                  <label className="block text-sm font-medium">Họ tên người lao động</label>
                  <input {...register('HO_TEN')} className="mt-1 block w-full border rounded-md p-2" />
                  {errors.HO_TEN && <p className="text-red-500 text-sm">{errors.HO_TEN.message}</p>}
                </div>
            
                {/* 3 */}
                <div>
                  <label className="block text-sm font-medium">Ngày sinh (dd/mm/yyyy)</label>
                  <input {...register('NGAY_SINH')} placeholder="01/01/1998" className="mt-1 block w-full border rounded-md p-2" />
                  {errors.NGAY_SINH && <p className="text-red-500 text-sm">{errors.NGAY_SINH.message}</p>}
                </div>
            
                {/* 4 */}
                <div>
                  <label className="block text-sm font-medium">Giới tính</label>
                  <select {...register('GIOI_TINH')} className="mt-1 block w-full border rounded-md p-2">
                    <option value="">Chọn</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                  {errors.GIOI_TINH && <p className="text-red-500 text-sm">{errors.GIOI_TINH.message}</p>}
                </div>
            
                {/* 5 */}
                <div>
                  <label className="block text-sm font-medium">Nghề nghiệp</label>
                  <input {...register('NGHE_NGHIEP')} className="mt-1 block w-full border rounded-md p-2" />
                  {errors.NGHE_NGHIEP && <p className="text-red-500 text-sm">{errors.NGHE_NGHIEP.message}</p>}
                </div>
            
                {/* 6 */}
                <div>
                  <label className="block text-sm font-medium">Bộ phận</label>
                  <input {...register('BO_PHAN')} className="mt-1 block w-full border rounded-md p-2" />
                  {errors.BO_PHAN && <p className="text-red-500 text-sm">{errors.BO_PHAN.message}</p>}
                </div>
            
                {/* 7 */}
                <div>
                  <label className="block text-sm font-medium">Mã số nhân viên</label>
                  <input {...register('MS_NV')} className="mt-1 block w-full border rounded-md p-2" />
                  {errors.MS_NV && <p className="text-red-500 text-sm">{errors.MS_NV.message}</p>}
                </div>
            
                {/* 8 */}
                <div>
                  <label className="block text-sm font-medium">Địa chỉ thường trú</label>
                  <input {...register('DC_THUONG_TRU')} className="mt-1 block w-full border rounded-md p-2" />
                  {errors.DC_THUONG_TRU && <p className="text-red-500 text-sm">{errors.DC_THUONG_TRU.message}</p>}
                </div>
            
                {/* 9 */}
                <div>
                  <label className="block text-sm font-medium">Số CMND/CCCD</label>
                  <input {...register('SO_CMND')} className="mt-1 block w-full border rounded-md p-2" />
                  {errors.SO_CMND && <p className="text-red-500 text-sm">{errors.SO_CMND.message}</p>}
                </div>
            
                {/* 10 */}
                <div>
                  <label className="block text-sm font-medium">Ngày cấp (dd/mm/yyyy)</label>
                  <input {...register('NGAY_CAP')} placeholder="01/01/2020" className="mt-1 block w-full border rounded-md p-2" />
                  {errors.NGAY_CAP && <p className="text-red-500 text-sm">{errors.NGAY_CAP.message}</p>}
                </div>
            
                {/* 11 */}
                <div>
                  <label className="block text-sm font-medium">Trình độ học vấn</label>
                  <input {...register('HOC_VAN')} className="mt-1 block w-full border rounded-md p-2" />
                  {errors.HOC_VAN && <p className="text-red-500 text-sm">{errors.HOC_VAN.message}</p>}
                </div>
            
                {/* 12 */}
                <div>
                  <label className="block text-sm font-medium">Chuyên ngành</label>
                  <input {...register('CHUYEN_NGANH')} className="mt-1 block w-full border rounded-md p-2" />
                  {errors.CHUYEN_NGANH && <p className="text-red-500 text-sm">{errors.CHUYEN_NGANH.message}</p>}
                </div>
            
                {/* 13 */}
                <div>
                  <label className="block text-sm font-medium">Mã hợp đồng gốc</label>
                  <input {...register('MS_HD')} className="mt-1 block w-full border rounded-md p-2" />
                  {errors.MS_HD && <p className="text-red-500 text-sm">{errors.MS_HD.message}</p>}
                </div>
            
                {/* 14 */}
                <div>
                  <label className="block text-sm font-medium">Ngày ký hợp đồng gốc (dd/mm/yyyy)</label>
                  <input {...register('NGAY_KY_HD')} placeholder="01/01/2025" className="mt-1 block w-full border rounded-md p-2" />
                  {errors.NGAY_KY_HD && <p className="text-red-500 text-sm">{errors.NGAY_KY_HD.message}</p>}
                </div>
            
                {/* 15 */}
                <div>
                  <label className="block text-sm font-medium">Mức lương (VNĐ)</label>
                  <input {...register('MUC_LUONG')} placeholder="15.000.000" className="mt-1 block w-full border rounded-md p-2" />
                  {errors.MUC_LUONG && <p className="text-red-500 text-sm">{errors.MUC_LUONG.message}</p>}
                </div>
            
                {/* 16 */}
                <div>
                  <label className="block text-sm font-medium">Ngày hiệu lực (dd/mm/yyyy)</label>
                  <input {...register('NGAY_HL')} placeholder="01/03/2026" className="mt-1 block w-full border rounded-md p-2" />
                  {errors.NGAY_HL && <p className="text-red-500 text-sm">{errors.NGAY_HL.message}</p>}
                </div>
            
              </div>
            
              <div className="text-center mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-red-600 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-red-700 disabled:opacity-50 transition"
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
