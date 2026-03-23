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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-2xl mx-auto">
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

          {/* Preview dàn trải rộng hơn */}
          <div className="bg-white p-10 md:p-12 print:p-[1.5cm_1.5cm_1.5cm_1.5cm] shadow-xl print:shadow-none mx-auto print:mx-0" style={{ minWidth: '210mm', maxWidth: '100%', minHeight: '297mm', fontFamily: "'Times New Roman', Times, serif", fontSize: '13.5pt', lineHeight: '1.55', background: 'white' }}>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold uppercase">CÔNG TY CỔ PHẦN XUẤT NHẬP KHẨU TASIFISH</h3>
              <p className="text-sm">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
              <p className="text-sm">Độc Lập - Tự Do - Hạnh Phúc</p>
              <p className="font-bold mt-3">Số: {formData.MS_HDLD || '...'}/2026</p>
              <h2 className="text-2xl font-bold mt-5">PHỤ LỤC HỢP ĐỒNG LAO ĐỘNG</h2>
            </div>

            <p className="mb-5 text-justify hyphens-auto">
              Chúng tôi, một bên là Ông/Bà: <strong>LÊ DUY HOÀNG</strong> Quốc tịch: Việt Nam<br />
              Chức vụ: GIÁM ĐỐC<br />
              Đại diện cho: CÔNG TY CỔ PHẦN XUẤT NHẬP KHẨU TASIFISH<br />
              Địa chỉ: Số 197, đường 14 tháng 9, khóm 6, phường 5, TP. Vĩnh Long, Tỉnh Vĩnh Long.
            </p>

            <p className="mb-5 text-justify hyphens-auto">
              Và một bên là Ông/Bà: <strong>{formData.HO_TEN || '...'}</strong><br />
              Quốc tịch: Việt Nam<br />
              Ngày sinh: {formData.NGAY_SINH || '...'}<br />
              Giới tính: {formData.GIOI_TINH || '...'}<br />
              Dân tộc: Kinh<br />
              Nghề nghiệp: {formData.NGHE_NGHIEP || '...'}<br />
              Bộ phận: {formData.BO_PHAN || '...'} Mã số: {formData.MS_NV || '...'}<br />
              Địa chỉ thường trú: {formData.DC_THUONG_TRU || '...'}<br />
              Số CMND/CCCD: {formData.SO_CMND || '...'} Cấp ngày: {formData.NGAY_CAP || '...'}<br />
              Trình độ học vấn: {formData.HOC_VAN || '...'}<br />
              Chuyên ngành: {formData.CHUYEN_NGANH || '...'}
            </p>

            <p className="mb-5 text-justify hyphens-auto">
              Căn cứ Hợp đồng lao động số <strong>{formData.MS_HD || '...'}</strong> ký ngày <strong>{formData.NGAY_KY_HD || '...'}</strong> và nhu cầu sử dụng lao động, hai bên cùng nhau thỏa thuận thay đổi một số nội dung của hợp đồng đã ký kết như sau:
            </p>

            <p className="font-bold mb-2">Điều 1. Nội dung thay đổi - bổ sung:</p>
            <p className="mb-5 text-justify hyphens-auto">
              Các bên đồng ý thay đổi Hợp đồng lao động số {formData.MS_HD || '...'} như sau:<br />
              Khoản 1, Điều 3 [Quyền lợi và nghĩa vụ của người lao động]<br />
              - Mức lương chính theo tháng: <strong>{formData.MUC_LUONG || '...'} VNĐ</strong>
            </p>

            <p className="font-bold mb-2">Điều 2. Điều khoản thi hành:</p>
            <p className="mb-5 text-justify hyphens-auto">
              Trừ những nội dung thay đổi nêu tại Điều 1, Phụ lục hợp đồng này, các nội dung khác trong hợp đồng lao động số {formData.MS_HD || '...'} không thay đổi.<br />
              Phụ lục Hợp đồng lao động này là một phần không tách rời Hợp đồng lao động số {formData.MS_HD || '...'} và được làm thành 02 (hai) bản, các bản có giá trị pháp lý ngang nhau, mỗi bên giữ 01 (một) bản và có hiệu lực từ ngày <strong>{formData.NGAY_HL || '...'}</strong>.
            </p>

            <div className="mt-20 flex justify-between text-center print:mt-16">
              <div className="w-1/2">
                <p className="font-bold">NGƯỜI LAO ĐỘNG</p>
                <p>(Ký tên)</p>
                <p className="mt-12 font-bold">{formData.HO_TEN || '...'}</p>
              </div>
              <div className="w-1/2">
                <p className="font-bold">NGƯỜI SỬ DỤNG LAO ĐỘNG</p>
                <p>(Ký tên, đóng dấu)</p>
                <p className="mt-12 font-bold">LÊ DUY HOÀNG</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-6 mt-12 print:hidden">
          <button
            type="submit"
            onClick={handleSubmit(onCreate)}
            className="px-12 py-4 bg-red-600 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 transition"
          >
            Tạo Phụ Lục Hợp Đồng
          </button>

          <button
            type="button"
            onClick={onPrint}
            className="px-12 py-4 bg-blue-600 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition"
          >
            In Hợp Đồng
          </button>
        </div>

        <p className="text-center mt-8 text-sm text-gray-500 print:hidden">
          Dữ liệu được bảo mật và chỉ dùng để tạo file hợp đồng. Không lưu trữ.
        </p>
      </div>

      {/* CSS tối ưu in full trang A4, lề nhỏ hơn */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 1.5cm 1.5cm 1.5cm 1.5cm; /* Giảm lề Top/Left/Right xuống 1.5cm */
          }
          body {
            background: white !important;
            font-family: 'Times New Roman', Times, serif !important;
            font-size: 13.5pt !important;
            line-height: 1.55 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .print\\:hidden { display: none !important; }
          .max-w-screen-2xl { max-width: none !important; margin: 0 !important; padding: 0 !important; }
          .shadow-xl, .rounded-2xl, .p-10, .p-12 { box-shadow: none !important; border-radius: 0 !important; padding: 0 !important; }
          .grid-cols-2 { grid-template-columns: 1fr !important; gap: 0 !important; }
          .bg-white { background: white !important; }
          .text-justify { text-align: justify !important; hyphens: auto !important; word-break: break-word !important; }
          p { margin-bottom: 0.8em !important; }
        }
      `}</style>
    </div>
  );
}
