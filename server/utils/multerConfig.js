// server/utils/multerConfig.js
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Correct ESM dirname/filename handling
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root uploads folder
const UPLOAD_ROOT = path.join(__dirname, "..", "uploads");

// Sub-folders
const PDF_DIR = path.join(UPLOAD_ROOT, "pdf");
const CASES_DIR = path.join(UPLOAD_ROOT, "cases");

// Ensure folders exist
[UPLOAD_ROOT, PDF_DIR, CASES_DIR].forEach((p) => {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

// ✅ Storage rule
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "questionPdf") cb(null, PDF_DIR);
    else cb(null, CASES_DIR); // inputFile, outputFile
  },
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/\s+/g, "_");
    const ts = Date.now();
    cb(null, `${ts}__${safe}`);
  },
});

// ✅ File filter
const allowed = {
  questionPdf: ["application/pdf"],
  inputFile: ["text/plain", "application/octet-stream"],
  outputFile: ["text/plain", "application/octet-stream"],
};

const fileFilter = (req, file, cb) => {
  const ok = (allowed[file.fieldname] || []).includes(file.mimetype);
  if (!ok) return cb(new Error(`Invalid file type for ${file.fieldname}`));
  cb(null, true);
};

// ✅ Limits
const limits = { fileSize: 10 * 1024 * 1024 }; // 10MB

// ✅ Base upload middleware
export const upload = multer({ storage, fileFilter, limits });

// ✅ Assignment-specific upload middleware
export const uploadAssignmentFiles = upload.fields([
  { name: "questionPdf", maxCount: 1 },
  { name: "inputFile", maxCount: 1 },
  { name: "outputFile", maxCount: 1 },
]);

// ✅ Public base url (/uploads...)
export const UPLOADS_PUBLIC_BASE = "/uploads";

// ✅ Export paths
export const PATHS = { UPLOAD_ROOT, PDF_DIR, CASES_DIR };
