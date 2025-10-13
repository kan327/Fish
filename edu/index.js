import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

// ES Module versi __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base folder tempat menyimpan semua file
const baseDir = path.join(__dirname, 'data');

// Pastikan folder 'data' selalu ada
fs.mkdirSync(baseDir, { recursive: true });

// Buat direktori baru
function createDirectory(dirName) {
  const dirPath = path.join(baseDir, dirName);
  fs.mkdirSync(dirPath, { recursive: true });
  console.log(`Direktori '${dirName}' dibuat.`);
}

// Buat file baru
function createFile(dirName, fileName, content = '') {
  const filePath = path.join(baseDir, dirName, fileName);
  fs.writeFileSync(filePath, content);
  console.log(`File '${fileName}' dibuat.`);
}

// Baca isi file
function readFile(dirName, fileName) {
  const filePath = path.join(baseDir, dirName, fileName);
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`Isi file '${fileName}':\n${content}`);
}

// Tulis ulang isi file
function writeFile(dirName, fileName, content) {
  const filePath = path.join(baseDir, dirName, fileName);
  fs.writeFileSync(filePath, content);
  console.log(`File '${fileName}' ditulis ulang.`);
}

// Hapus file
function deleteFile(dirName, fileName) {
  const filePath = path.join(baseDir, dirName, fileName);
  fs.unlinkSync(filePath);
  console.log(`File '${fileName}' dihapus.`);
}

// Tampilkan isi folder
function listDirectory(dirName) {
  const dirPath = path.join(baseDir, dirName);
  const files = fs.readdirSync(dirPath);
  console.log(`Isi direktori '${dirName}':`, files);
}

// ======== CONTOH PENGGUNAAN ========
createDirectory('/folder1/mikan');
createFile('folder1', 'contoh.txt', 'Hello, dunia!');
readFile('folder1', 'contoh.txt');
writeFile('folder1', 'contoh.txt', 'Isi baru untuk file.');
readFile('folder1', 'contoh.txt');
listDirectory('folder1');
deleteFile('folder1', 'contoh.txt');
listDirectory('folder1');