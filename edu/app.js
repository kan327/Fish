import fs from 'fs';
import readline from 'readline';
import { fileURLToPath } from 'url';
import path from 'path';

// Setup __dirname (karena pakai ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseDir = path.join(__dirname, 'data');
fs.mkdirSync(baseDir, { recursive: true });

// Fungsi dasar file system
function createDirectory(dirName) {
  const dirPath = path.join(baseDir, dirName);
  fs.mkdirSync(dirPath, { recursive: true });
  console.log(`Direktori '${dirName}' dibuat.`);
}

function createFile(dirName, fileName, content = '') {
  const filePath = path.join(baseDir, dirName, fileName);
  fs.writeFileSync(filePath, content);
  console.log(`File '${fileName}' dibuat.`);
}

function readFile(dirName, fileName) {
  const filePath = path.join(baseDir, dirName, fileName);
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`Isi file '${fileName}':\n${content}`);
}

function writeFile(dirName, fileName, content) {
  const filePath = path.join(baseDir, dirName, fileName);
  fs.writeFileSync(filePath, content);
  console.log(`File '${fileName}' ditulis ulang.`);
}

function deleteFile(dirName, fileName) {
  const filePath = path.join(baseDir, dirName, fileName);
  fs.unlinkSync(filePath);
  console.log(`File '${fileName}' dihapus.`);
}

function listDirectory(dirName) {
  const dirPath = path.join(baseDir, dirName);
  const files = fs.readdirSync(dirPath);
  console.log(`Isi direktori '${dirName}':`, files);
}

// Fungsi readline wrapper untuk input async
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const ask = (question) => new Promise(resolve => rl.question(question, resolve));

// Fungsi utama menu
async function main() {
  while (true) {
    console.clear();
    console.log("===================================");
    console.log("=== MENU FILE SYSTEM SEDERHANA ===");
    console.log("[1] Buat Direktori");
    console.log("[2] Buat File");
    console.log("[3] Baca File");
    console.log("[4] Tulis Ulang File");
    console.log("[5] Hapus File");
    console.log("[6] Lihat Isi Direktori");
    console.log("[0] Keluar");
    console.log("===================================");

    const choice = await ask("\nPilih menu: ");

    // console.clear();

    switch (choice) {
      case '1': {
        const dir = await ask("Path direktori: ");
        createDirectory(dir);
        break;
      }
      case '2': {
        const dir = await ask("Path direktori: ");
        const file = await ask("Nama file: ");
        const content = await ask("Isi awal file: ");
        createFile(dir, file, content);
        break;
      }
      case '3': {
        const dir = await ask("Path direktori: ");
        const file = await ask("Nama file: ");
        readFile(dir, file);
        break;
      }
      case '4': {
        const dir = await ask("Path direktori: ");
        const file = await ask("Nama file: ");
        const content = await ask("Isi baru: ");
        writeFile(dir, file, content);
        break;
      }
      case '5': {
        const dir = await ask("Path direktori: ");
        const file = await ask("Nama file: ");
        deleteFile(dir, file);
        break;
      }
      case '6': {
        const dir = await ask("Path direktori: ");
        listDirectory(dir);
        break;
      }
      case '0':
        rl.close();
        console.log("Keluar dari program.");
        process.exit();
      default:
        console.log("Pilihan tidak valid.");
    }

    await ask("\nTekan Enter untuk melanjutkan...");
  }
}

main();