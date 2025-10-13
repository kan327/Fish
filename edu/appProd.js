import fs from 'fs';
import readline from 'readline';
import { fileURLToPath } from 'url';
import path from 'path';
import chalk from 'chalk';
import figlet from 'figlet';

// (Opsional) ascii-art bisa dipakai untuk header atau efek lain
// import art from 'ascii-art';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseDir = path.join(__dirname, 'data');
fs.mkdirSync(baseDir, { recursive: true });

// ========== Utility logging & styling ==========

// Tema warna
const style = {
  header: chalk.bold.cyan,
  menu: chalk.bold.yellow,
  prompt: chalk.green,
  info: chalk.blue,
  success: chalk.greenBright,
  error: chalk.redBright,
  warning: chalk.hex('#FFA500'),
  reset: chalk.reset
};

export async function showSplash(mode = "default") {
  // definisi pesan untuk tiap mode
  const messages = {
    default: ["⏳ Loading", "⏳ Loading.", "⏳ Loading..", "⏳ Loading..."],
    started: [
      `🚀${" "}Starting up.`,
      `🚀${" "}Starting up..`,
      `⏳${" "}Loading modules.`,
      `⏳${" "}Loading modules..`,
      `⏳${" "}Loading modules...`,
      `⚙️ ${" "}Initializing system.`,
      `📡${" "}Connecting services.`,
      `📡${" "}Connecting services..`,
      `📡${" "}Connecting services...`,
      `✅${" "}Started successfully!`,
    ],
    closed: [
      `💾${" "}Saving states.`,
      `💾${" "}Saving states..`,
      `💾${" "}Saving states...`,
      `⚙️ ${" "}Closing processes.`,
      `⚙️ ${" "}Closing processes..`,
      `⚙️ ${" "}Closing processes...`,
      `🧹${" "}Cleaning up resources.`,
      `🧹${" "}Cleaning up resources..`,
      `✅${" "}Closed System! Bye.`,
      `✅${" "}Closed System! Bye..`,
    ],
  };

  // ambil list sesuai mode
  const steps = messages[mode] || messages.default;

  for (const msg of steps) {
    process.stdout.write(style.prompt(msg));
    await new Promise((r) => setTimeout(r, Math.floor(Math.random() * (900 - 50 + 1)) + 50)); // delay antar pesan
    process.stdout.write("\r"); // timpa baris
  }

  // beri jeda terakhir agar pesan terakhir tampil bersih
  console.log(style.success("\n✔️ Done!\n"));
}

function ascii(type = "default") {
  // Logo ASCII dari file
  try {
    let ascii
    if(type == "default") ascii = fs.readFileSync('./logo.txt', 'utf8');
    if(type == "eyes")ascii = fs.readFileSync('./logoMini.txt', 'utf8');
    console.log(style.success(ascii));
  } catch (err) {
    logWarning('Logo ASCII (logo.txt) tidak ditemukan.');
  }
}

function printHeader(type = "default", text = "FISH CLI", load = "no-data") {
  console.clear(); // bersihkan terminal di awal
  ascii(type)

  if(load == "load") {
    console.log('\n');
    console.log(style.info('Now Connecting To :'))
  } else
    if(load == "clear") {
      console.log('\n');
      console.log(style.info('Connected To System Successfully !'))
    }
  // Judul besar dengan figlet
  const title = figlet.textSync(text, {
    font: 'Standard',
    horizontalLayout: 'default',
    verticalLayout: 'default'
  });

  console.log(style.header(title));
  console.log(style.menu('📁 Utility CLI untuk mengelola file & direktori'));
  console.log(style.info('💻 Github: Kan327'));
  console.log(style.info('🛠️  Versi: 1.0.0'));
  console.log(style.info('📅 ' + new Date().toLocaleString()));
  console.log('\n');
}


// Fungsi log info
function logInfo(msg) {
  console.log(style.info('[INFO] ') + msg);
}
function logSuccess(msg) {
  console.log(style.success('[OK]   ') + msg);
}
function logError(msg) {
  console.log(style.error('[ERROR]') + msg);
}
function logWarning(msg) {
  console.log(style.warning('[WARN] ') + msg);
}

// ========== Fungsi file system ==========

function createDirectory(dirName) {
  const dirPath = path.join(baseDir, dirName);
  fs.mkdirSync(dirPath, { recursive: true });
  logSuccess(`Direktori '${dirName}' dibuat.`);
}

function createFile(dirName, fileName, content = '') {
  const filePath = path.join(baseDir, dirName, fileName);
  fs.writeFileSync(filePath, content);
  logSuccess(`File '${fileName}' dibuat di '${dirName}'.`);
}

function readFile(dirName, fileName) {
  const filePath = path.join(baseDir, dirName, fileName);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    logInfo(`Isi file '${fileName}':`);
    console.log(style.menu(content));
  } catch (err) {
    logError(`Gagal membaca file: ${err.message}`);
  }
}

function writeFile(dirName, fileName, content) {
  const filePath = path.join(baseDir, dirName, fileName);
  try {
    fs.writeFileSync(filePath, content);
    logSuccess(`File '${fileName}' ditulis ulang.`);
  } catch (err) {
    logError(`Gagal menulis file: ${err.message}`);
  }
}

function deleteFile(dirName, fileName) {
  const filePath = path.join(baseDir, dirName, fileName);
  try {
    fs.unlinkSync(filePath);
    logSuccess(`File '${fileName}' dihapus.`);
  } catch (err) {
    logError(`Gagal menghapus file: ${err.message}`);
  }
}

function listDirectory(dirName) {
  const dirPath = path.join(baseDir, dirName);
  try {
    const files = fs.readdirSync(dirPath);
    logInfo(`Isi direktori '${dirName}':`);
    files.forEach(f => {
      console.log('  ' + style.menu(f));
    });
  } catch (err) {
    logError(`Gagal membaca direktori: ${err.message}`);
  }
}

// ========== Input via readline ==========

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const ask = (q) => new Promise(resolve => {
  rl.question(style.prompt(q), resolve);
});

// ========== Menu utama ==========

async function main() {
  printHeader("default", "L Lawliet", "load");
  await showSplash("started");
  printHeader("default", "L Lawliet", "clear");
  await ask('Enter untuk masuk ke FISH CLI System...');
  while (true) {
    console.clear();
    printHeader("eyes");
    console.log(chalk.gray(`📂 Dir saat ini: ${process.cwd()}`));
    console.log(style.menu(
      `[1]Dir  [2]File  [3]Read  [4]Write  [5]Del  [6]List  [0]Exit`
    ));
    console.log();

    const choice = await ask('Pilih menu: ');

    switch (choice) {
      case '1': {
        const dir = await ask('Path direktori: ');
        createDirectory(dir);
        break;
      }
      case '2': {
        const dir = await ask('Path direktori: ');
        const file = await ask('Nama file: ');
        const content = await ask('Isi awal file: ');
        createFile(dir, file, content);
        break;
      }
      case '3': {
        const dir = await ask('Path direktori: ');
        const file = await ask('Nama file: ');
        readFile(dir, file);
        break;
      }
      case '4': {
        const dir = await ask('Path direktori: ');
        const file = await ask('Nama file: ');
        const content = await ask('Isi baru: ');
        writeFile(dir, file, content);
        break;
      }
      case '5': {
        const dir = await ask('Path direktori: ');
        const file = await ask('Nama file: ');
        deleteFile(dir, file);
        break;
      }
      case '6': {
        const dir = await ask('Path direktori: ');
        listDirectory(dir);
        break;
      }
      case '0': {
        rl.close();
        console.log(style.header('Terima kasih. Keluar dari program.'));
        await showSplash("closed");
        console.clear();
        process.exit(0);
      }
      default:
        logWarning('Pilihan tidak valid.');
    }

    await ask('\nTekan Enter untuk melanjutkan...');
  }
}

main();

