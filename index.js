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

    let posY = 0;
    let posX = 0;
    let noOfQRs = 0;
    for (let i = 0; i < urls.length; i++) {
      if (posX == 600) {
        posY += 100;
        posX = 0;
      }
      if (noOfQRs == 48) {
        noOfQRs = 0;
        doc.addPage();
        posX = 0;
        posY = 0;
      }
      const qrCodeImage = await qrcode.toDataURL(urls[i], {
        width: 100,
      });
      noOfQRs++;
      doc.image(qrCodeImage, posX, posY);
      posX += 100;
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
