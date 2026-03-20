import fs from 'fs';
import path from 'path';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const data = req.body;

    // Validate cơ bản (có thể mở rộng sau)
    if (!data.MS_HDLD || !data.HO_TEN) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    const templatePath = path.resolve('./templates/phuluc-hopdong.docx'); // file template cũ của bạn
    const content = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(content);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      delimiters: { start: '{{', end: '}}' }, // explicit để vững chắc
    });

    doc.setData(data); // dùng data từ form
    doc.render();

    const buf = doc.getZip().generate({ type: 'nodebuffer' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename=phuluc-hopdong.docx');
    res.send(buf);
  } catch (error) {
    console.error('Lỗi generate:', error);
    res.status(500).json({ error: error.message || 'Lỗi hệ thống khi tạo file' });
  }
}
