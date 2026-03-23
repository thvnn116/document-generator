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

  const generateDocxBlob = async (data) => {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Lỗi khi tạo file');

    return await response.blob();
  };

  const onCreate = async (data) => {
    try {
      const blob = await generateDocxBlob(data);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'phuluc-hopdong.docx';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Có lỗi khi tạo file: ' + err.message);
    }
  };

  const onPrint = async () => {
    try {
      const currentData = watch();
      const blob = await generateDocxBlob(currentData);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'phuluc-hopdong-in.docx'; // Tên khác để dễ nhận biết
      a.click();
      URL.revokeObjectURL(url);

      alert('File hợp đồng đã được tải về. Hãy mở file và bấm Ctrl+P (hoặc Cmd+P) để in – định dạng chuẩn Word, đầy đủ trang A4.');
    } catch (err) {
      alert('Lỗi khi chuẩn bị in: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-6 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0">
      <div className="max-w-7xl mx-auto print:max-w-full print:m-0">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8 print:hidden">
          Tạo Phụ Lục Hợp Đồng Lao Động
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:grid-cols-1 print:gap-0">
          {/* Form */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 print:hidden">
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
                  {errors.DC_THUONG_TRU && <p className="mt-1 text-sm text-red-600">{errors.DC
