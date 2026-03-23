export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRef } from 'react';

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
  const printIframeRef = useRef(null);

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
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'phuluc-hopdong.docx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Có lỗi khi tạo file: ' + err.message);
    }
  };

  const onPrint = async () => {
    try {
      const currentData = watch();
      const blob = await generateDocxBlob(currentData);
      const url = window.URL.createObjectURL(blob);

      const iframe = printIframeRef.current;
      if (iframe) {
        iframe.src = url;

        iframe.onload = () => {
          setTimeout(() => {
            const win = iframe.contentWindow || iframe.contentDocument.defaultView;
            if (win) {
              win.focus();
              win.print();
            } else {
              alert('Không thể mở hộp thoại in. Hãy thử lại hoặc dùng nút Tạo để tải file rồi in bằng Word.');
            }
            // Cleanup sau 10 giây
            setTimeout(() => window.URL.revokeObjectURL(url), 10000);
          }, 2500); // Tăng thời gian chờ để .docx load đầy đủ định dạng
        };
      } else {
        alert('Iframe không sẵn sàng. Hãy thử lại.');
      }
    } catch (err) {
      alert('Lỗi khi chuẩn bị in: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8 print:hidden">
          Tạo Phụ Lục Hợp Đồng Lao Động
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:hidden">
          {/* Form */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <form onSubmit={handleSubmit(onCreate)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 16 field giữ nguyên */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mã Phụ Lục</label>
                  <input {...register('MS_HDLD')} placeholder="VD: 001/2026" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition" />
                  {errors.MS_HDLD && <p className="mt-1 text-sm text-red-600">{errors.MS_HDLD.message}</p>}
                </div>

                {/* ... các field còn lại giữ nguyên ... */}
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

          {/* Preview realtime */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Preview Phụ Lục Hợp Đồng
            </h2>
            <div className="prose prose-sm md:prose-base max-w-none border border-gray-200 rounded-lg p-6 bg-white min-h-[800px] overflow-auto leading-relaxed">
              {/* Giữ nguyên nội dung preview cũ của bạn */}
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold uppercase">CÔNG TY CỔ PHẦN XUẤT NHẬP KHẨU TASIFISH</h3>
                <p className="text-sm">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                <p className="text-sm">Độc Lập - Tự Do - Hạnh Phúc</p>
                <p className="font-bold mt-4">Số: {formData.MS_HDLD || '...'}</p>
                <h2 className="text-2xl font-bold mt-6">PHỤ LỤC HỢP ĐỒNG LAO ĐỘNG</h2>
              </div>

              {/* ... nội dung preview giữ nguyên ... */}
            </div>
          </div>
        </div>

        <p className="text-center mt-8 text-sm text-gray-500 print:hidden">
          Dữ liệu được bảo mật và chỉ dùng để tạo file hợp đồng. Không lưu trữ.
        </p>

        {/* Iframe ẩn để load và in .docx trực tiếp */}
        <iframe ref={printIframeRef} style={{ display: 'none', width: '100%', height: '100vh' }} />
      </div>
    </div>
  );
}
