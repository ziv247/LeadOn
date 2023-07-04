import jsPDF from "jspdf";
import JSZip from "jszip";
import { useContext, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import Pdf from "./Pdf";
import "../../src/arial-normal.js";
import { Store } from "../Store.js";

const DownloadButton = ({ post }) => {
  const aTag = useRef();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const [zipFile, setZipFile] = useState();

  const onClickHandler = async (e) => {
    const promises = post.what.files.map(async (url) => {
      const res = await fetch(url);
      const blob = await res.blob();
      return blob;
    });
    const res = await Promise.all(promises);
    const zip = new JSZip();
    res.forEach((blob, idx) => {
      zip.file(getFileName(idx), blob);
    });

    zip.file("details.pdf", pdfGenerate());

    const readme = zip.folder("readme");
    readme?.file("readme.txt", "Created with JSZip");

    const zipFile = await zip.generateAsync({ type: "blob" });
    console.log(zipFile);
    // pdfGenerate();
    downloadZip(zipFile);
  };

  const downloadZip = (file) => {
    const url = URL.createObjectURL(file);
    aTag.current.href = url;
    aTag.current.click();
  };

  const pdfGenerate = async () => {
    const doc = new jsPDF("portrait", "px", "a4", false);
    doc.addFont("arial-normal.ttf", "arial", "normal");
    doc.setFont("arial");
    doc.setR2L(true);
    let y = 40;
    doc.setFontSize(16);
    doc.text("גוף הפוסט:", 400, y, { align: "right", baseline: "bottom" });
    y += 15;
    doc.setFontSize(12);

    doc.text("  " + post.what.text, 400, y, { align: "right" });
    y += 20;
    doc.setFontSize(16);

    doc.text("קבוצות:", 400, y, { align: "right" });
    y += 15;
    doc.setFontSize(12);

    post.where.map((grp) => {
      doc.text("  " + grp.name, 400, y, { align: "right" });
      y += 15;
    });
    y += 5;
    doc.setFontSize(16);

    doc.text("ימים:", 400, y, { align: "right" });
    y += 15;
    doc.setFontSize(12);

    post.when.checkedDays.map((day) => {
      doc.text("  " + day, 400, y, { align: "right" });
      y += 15;
    });
    y += 5;
    doc.text("שעות:", 400, y, { align: "right" });
    y += 15;
    doc.text(post.when.startDate + " - " + post.when.endDate, 400, y, {
      align: "right",
    });

    return doc.output("blob");
  };

  const getFileName = (idx) => {
    return !post.what.isVideo ? `image${idx + 1}.jpg` : "video.mp4";
  };

  return (
    <div>
      <Button onClick={onClickHandler}>הורדה</Button>
      <a
        ref={aTag}
        style={{ display: "none" }}
        download={userInfo.name +"_"+new Date().toDateString()+".zip"}
      ></a>
    </div>
  );
};
export default DownloadButton;
