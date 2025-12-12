import multer from "multer";
import path from "path";
//apenas o utilizador pode fazer upload de ficheiros
const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, "uploads/"); },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + Math.round(Math.random()*1E9) + ext);
  }
});
const upload = multer({ storage, limits: { fileSize: 10*1024*1024 } });
export default upload;
