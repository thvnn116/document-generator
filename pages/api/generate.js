import { vanbanTypes } from '../../config/vanban-types';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { loaiVanBan, ...data } = req.body;

    const typeConfig = vanbanTypes.find(t => t.code === loaiVanBan);
    if (!typeConfig) {
      return res.status(400).json({ error: 'Loại văn bản không hợp lệ' });
    }

    const templatePath = path.join(process.cwd(), 'templates', typeConfig.templateFile);

    if (!fs.existsSync(templatePath)) {
      return res.status(404).json({ error: `Không tìm thấy template: ${typeConfig.templateFile}` });
    }

    const content = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(content);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      delimiters: { start: '{{', end: '}}' },   // ← Dòng quan trọng này
    });

    console.log(`Đang render template: ${typeConfig.templateFile}`);
    console.log("Dữ liệu:", JSON.stringify(data, null, 2));

    doc.setData(data);
    doc.render();

    const buf = doc.getZip().generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename=${typeConfig.templateFile}`);
    res.send(buf);

  } catch (error) {
    console.error("=== LỖI RENDER DOCX ===");
    console.error(error);

    res.status(500).json({
      error: 'Lỗi khi tạo văn bản',
      message: error.message,
      details: error.properties ? error.properties : error.toString()
    });
  }
}
