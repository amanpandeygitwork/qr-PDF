import express from "express";
import qrcode from "qrcode";
import PDFDocument from "pdfkit";
import fs from "fs";

const app = express();
app.use(express.json());

app.get("/qrcode", async (req, res) => {
  const data = createQRS();
  const urls = data.urls;

  try {
    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=qrcodes.pdf");
    doc.pipe(res);

    let posY = 10;
    for (let i = 0; i < urls.length; i++) {
      const qrCodeImage = await qrcode.toDataURL(urls[i], {
        width: 100,
      });
      doc.image(qrCodeImage, 10, posY);
      posY += 100;
    }

    doc.end();
  } catch (err) {
    res.status(500).send("Error while generating qrcode");
  }
});

function createQRS() {
  const dataJSON = fs.readFileSync("./data.json");
  const data = JSON.parse(dataJSON);
  return data;
}

app.listen(3000, () => {
  console.log("server running at port 3000");
});
