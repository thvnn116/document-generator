import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

export default function handler(req, res) {
  try {
    const templatePath = path.resolve("./templates/phuluc-hopdong-sach.docx");
    const content = fs.readFileSync(templatePath, "binary");

    const zip = new PizZip(content);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      delimiters: { start: '{{', end: '}}' },  // thêm dòng này
    });

    doc.setData({
      MS_HDLD: "001/2026",
      HO_TEN: "Nguyễn Văn A",
      NGAY_SINH: "01/01/1998",
      GIOI_TINH: "Nam",
      NGHE_NGHIEP: "Nhân viên",
      BO_PHAN: "Kho vận",
      MS_NV: "TSF001",
      DC_THUONG_TRU: "Vĩnh Long",
      SO_CMND: "123456789",
      NGAY_CAP: "01/01/2020",
      HOC_VAN: "12/12",
      CHUYEN_NGANH: "Không",
      MS_HD: "HD001",
      NGAY_KY_HD: "01/01/2025",
      MUC_LUONG: "15.000.000",
      NGAY_HL: "01/03/2026"
    });

    doc.render();

    const buf = doc.getZip().generate({
      type: "nodebuffer",
    });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=phuluc-hopdong.docx"
    );

    res.send(buf);

  } catch (error) {
  console.error("Docxtemplater error:", error);
  if (error.properties && error.properties.errors) {
    console.error("Detailed errors:", JSON.stringify(error.properties.errors, null, 2));
  }
  res.status(500).json({
    error: error.message,
    details: error.properties ? error.properties : "No details"
  });
}
}
