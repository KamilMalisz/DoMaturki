// /utils/imgFileUpload.js

import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url); // Uzyskiwanie pełnej ścieżki do bieżącego pliku
const __dirname = path.dirname(__filename); // Uzyskiwanie katalogu nadrzędnego dla bieżącego pliku

// Definicja filtra plików, który akceptuje tylko obrazy o rozszerzeniach .jpeg, .jpg, .png
const fileFilter = (req, file, cb) => {
  const filetypes = /.jpeg|.jpg|.png/; // Definiowanie dozwolonych typów plików za pomocą wyrażenia regularnego
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (extname) {
    return cb(null, true); // Akceptowanie pliku, jeśli rozszerzenie jest dozwolone
  } else {
    cb("Error: Images Only!"); // Odrzucenie pliku z komunikatem o błędzie, jeśli rozszerzenie jest niedozwolone
  }
};

// Funkcja do tworzenia dynamicznej konfiguracji storage dla multer
const createStorage = (uploadPath) => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      // Funkcja określająca katalog docelowy dla przesyłanych plików
      const finalPath =
        // Ustalanie ścieżki docelowej; użycie podanej ścieżki lub domyślnego katalogu
        uploadPath || path.join(__dirname, "../public/img/files");
      cb(null, finalPath); // Przekazanie ścieżki docelowej do multer
    },
    filename: function (req, file, cb) {
      // Funkcja określająca nazwę pliku po zapisaniu
      cb(null, `${Date.now()}_${file.originalname}`); // Ustawienie nazwy pliku jako znacznik czasu + oryginalna nazwa pliku
    },
  });
};

// Funkcja do tworzenia dynamicznego middleware do przesyłania plików
const createUploadMiddleware = (uploadPath) => {
  return multer({
    storage: createStorage(uploadPath), // Użycie niestandardowej konfiguracji storage
    limits: { fileSize: 10000000 }, // Ustawienie limitu rozmiaru pliku na 10 MB
    fileFilter,
  });
};

export default createUploadMiddleware;
