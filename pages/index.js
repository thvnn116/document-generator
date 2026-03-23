export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      MS_HDLD: '',
      HO_TEN: '',
      NGAY_SINH: '',
      GIOI_TINH: '',
      NGHE_NGHIEP: '',
      BO_PHAN: '',
      MS_NV: '',
      DC_THUONG_TRU: '',
      SO_CMND: '',
      NGAY_CAP: '',
      HOC_VAN: '',
      CHUYEN_NGANH: '',
      MS_HD: '',
      NGAY_KY_HD: '',
      MUC_LUONG: '',
      NGAY_HL: '',
    },
  });

  const formData = watch();

  const onCreate = async (data) => {
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
    } catch (err) {
      alert('Có lỗi: ' + err.message);
    }
  };

  const onPrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[210mm] mx-auto bg-white shadow-lg print:shadow-none print:max-w-full print:m-0 print:p-0">
        {/* Header trang web (ẩn khi in) */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8 print:hidden">
          Tạo Phụ Lục Hợp Đồng Lao Động
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:grid-cols-1 print:gap-0">
          {/* Form nhập liệu - ẩn khi in */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg print:hidden">
            <form onSubmit={handleSubmit(onCreate)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mã Phụ Lục</label>
                  <input {...register('MS_HDLD')} placeholder="VD: 001/2026" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition" />
                  {errors.MS_HDLD && <p className="mt-1 text-sm text-red-600">{errors.MS_HDLD.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên người lao động</label>
                  <input {...register('HO_TEN')} placeholder="VD: Nguyễn Văn A" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition" />
                  {errors.HO_TEN && <p className="mt-1 text-sm text-red-600">{errors.HO_TEN.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                  <input {...register('NGAY_SINH')} placeholder="VD: 01/01/1998" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition" />
                  {errors.NGAY_SINH && <p className="mt-1 text-sm text-red-600">{errors.NGAY_SINH.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                  <select {...register('GIOI_TINH')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition">
                    <option value="">Chọn</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                  {errors.GIOI_TINH && <p className="mt-1 text-sm text-red-600">{errors.GIOI_TINH.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nghề nghiệp</label>
                  <input {...register('NGHE_NGHIEP')} placeholder="VD: Nhân viên kho vận" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition" />
                  {errors.NGHE_NGHIEP && <p className="mt-1 text-sm text-red-600">{errors.NGHE_NGHIEP.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bộ phận</label>
                  <input {...register('BO_PHAN')} placeholder="VD: Kho vận" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition" />
                  {errors.BO_PHAN && <p className="mt-1 text-sm text-red-600">{errors.BO_PHAN.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mã số nhân viên</label>
                  <input {...register('MS_NV')} placeholder="VD: TSF001" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition" />
                  {errors.MS_NV && <p className="mt-1 text-sm text-red-600">{errors.MS_NV.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ thường trú</label>
                  <input {...register('DC_THUONG_TRU')} placeholder="VD: Số 123, đường ABC, phường XYZ, TP. Vĩnh Long" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition" />
                  {errors.DC_THUONG_TRU && <p className="mt-1 text-sm text-red-600">{errors.DC_THUONG_TRU.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số CMND/CCCD</label>
                  <input {...register('SO_CMND')} placeholder="VD: 123456789" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition" />
                  {errors.SO_CMND && <p className="mt-1 text-sm text-red-600">{errors.SO_CMND.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày cấp</label>
                  <input {...register('NGAY_CAP')} placeholder="VD: 01/01/2020" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition" />
                  {errors.NGAY_CAP && <p className="mt-1 text-sm text-red-600">{errors.NGAY_CAP.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trình độ học vấn</label>
                  <input {...register('HOC_VAN')} placeholder="VD: 12/12" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition" />
                  {errors.HOC_VAN && <p className="mt-1 text-sm text-red-600">{errors.HOC_VAN.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chuyên ngành</label>
                  <input {...register('CHUYEN_NGANH')} placeholder="VD: Không hoặc Quản trị kinh doanh" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition" />
                  {errors.CHUYEN_NGANH && <p className="mt-1 text-sm text-red-600">{errors.CHUYEN_NGANH.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mã hợp đồng gốc</label>
                  <input {...register('MS_HD')} placeholder="VD: HD001" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition" />
                  {errors.MS_HD && <p className="mt-1 text-sm text-red-600">{errors.MS_HD.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày ký hợp đồng gốc</label>
                  <input {...register('NGAY_KY_HD')} placeholder="VD: 01/01/2025" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition" />
                  {errors.NGAY_KY_HD && <p className="mt-1 text-sm text-red-600">{errors.NGAY_KY_HD.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mức lương (VNĐ)</label>
                  <input {...register('MUC_LUONG')} placeholder="VD: 15.000.000" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition" />
                  {errors.MUC_LUONG && <p className="mt-1 text-sm text-red-600">{errors.MUC_LUONG.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày hiệu lực</label>
                  <input {...register('NGAY_HL')} placeholder="VD: 01/03/2026" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition" />
                  {errors.NGAY_HL && <p className="mt-1 text-sm text-red-600">{errors.NGAY_HL.message}</p>}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 justify-center mt-10">
                <button
                  type="submit"
                  className="w-full md:w-auto px-10 py-4 bg-red-600 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 transition"
                >
                  Tạo Phụ Lục Hợp Đồng
                </button>

                <button
                  type="button"
                  onClick={onPrint}
                  className="w-full md:w-auto px-10 py-4 bg-blue-600 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition"
                >
                  In Hợp Đồng
                </button>
              </div>
            </form>
          </div>

          {/* Preview giống Word */}
          <div className="bg-white p-8 print:p-0" style={{ width: '210mm', minHeight: '297mm', margin: '0 auto', background: 'white', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold uppercase">CÔNG TY CỔ PHẦN XUẤT NHẬP KHẨU TASIFISH</h3>
              <p className="text-sm">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
              <p className="text-sm">Độc Lập - Tự Do - Hạnh Phúc</p>
              <p className="font-bold mt-4">Số: {formData.MS_HDLD || '...'}/2026</p>
              <h2 className="text-2xl font-bold mt-6">PHỤ LỤC HỢP ĐỒNG LAO ĐỘNG</h2>
            </div>

            <p className="mb-6 leading-7 text-justify">
              Chúng tôi, một bên là Ông/Bà: <strong>LÊ DUY HOÀNG</strong> Quốc tịch: Việt Nam<br />
              Chức vụ: GIÁM ĐỐC<br />
              Đại diện cho: CÔNG TY CỔ PHẦN XUẤT NHẬP KHẨU TASIFISH<br />
              Địa chỉ: Số 197, đường 14 tháng 9, khóm 6, phường 5, TP. Vĩnh Long, Tỉnh Vĩnh Long.
            </p>

            <p className="mb-6 leading-7 text-justify">
              Và một bên là Ông/Bà: <strong>{formData.HO_TEN || '...'}</strong><br />
              Quốc tịch: Việt Nam<br />
              Ngày sinh: {formData.NGAY_SINH || '...'}<br />
              Giới tính: {formData.GIOI_TINH || '...'}<br />
              Dân tộc: Kinh<br />
              Nghề nghiệp: {formData.NGHE_NGHIEP || '...'}<br />
              Bộ phận: {formData.BO_PHAN || '...'} Mã số: {formData.MS_NV || '...'}<br />
              Địa chỉ thường trú: {formData.DC_THUONG_TRU || '...'}<br />
              Số CMND/CCCD: {formData.SO_CMND || '...'} Cấp ngày: {formData.NGAY_CAP || '...'}<br />
              Trình độ học vấn: {formData.HOC_VAN || '...
