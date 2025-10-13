import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
import figlet from "figlet";
import inquirer from "inquirer";
import ora from "ora";

// ======================================================
// KONFIGURASI & STYLING
// ======================================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseDir = path.join(__dirname, '../public/storage/root');
fs.mkdirSync(baseDir, { recursive: true });

const style = {
  header: chalk.bold.cyan,
  menu: chalk.bold.yellow,
  info: chalk.blue,
  success: chalk.greenBright,
  error: chalk.redBright,
  warning: chalk.hex("#FFA500"),
};

// Logging Helper
const log = {
  info: (msg) => console.log(style.info("ℹ️  " + msg)),
  ok: (msg) => console.log(style.success("✅ " + msg)),
  warn: (msg) => console.log(style.warning("⚠️  " + msg)),
  err: (msg) => console.log(style.error("❌ " + msg)),
};

// ======================================================
// HEADER & LOGO
// ======================================================
function printHeader(type = "default", title = "FISH CLI") {
  console.clear();

  try {
    const ascii = fs.readFileSync(
      type === "eyes" ? "./logoMini.txt" : "./logo.txt",
      "utf8"
    );
    console.log(style.success(ascii));
  } catch {
    log.warn("Logo ASCII tidak ditemukan.");
  }

  const banner = figlet.textSync(title, { font: "Standard" });
  console.log(style.header(banner));
  console.log(style.menu("📁 File System CLI Utility"));
  console.log(
    style.info(
      `💻 Github: kan327 | 🛠️  v1.2.0 | 📅 ${new Date().toLocaleString()}`
    )
  );
  console.log();
}

// ======================================================
// LOADING SIMULATOR (pakai ora spinner)
// ======================================================
async function showLoading(mode = "started") {
  const spinner = ora({
    color: "cyan",
    spinner: "dots",
  });

  const steps = {
    started: [
      "🚀 Starting up",
      "⏳ Loading modules",
      "📡 Connecting services",
      "✅ System initialized!",
      "✌ Welcome",
    ],
    closed: [
      "💾 Saving state",
      "⚙️  Closing processes",
      "🧹 Cleaning resources",
      "✅ System closed successfully!",
      "👋 Bye...",
    ],
  }[mode];

  for (const step of steps) {
    spinner.start(step);
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 500));
  }
  spinner.succeed("✔️  Done!\n");
}

// ======================================================
// FILE SYSTEM OPS
// ======================================================
const fsop = {
  createDir: (dir) => {
    fs.mkdirSync(path.join(baseDir, dir), { recursive: true });
    log.ok(`Direktori '${dir}' berhasil dibuat.`);
  },
  createFile: (dir, file, content = "") => {
    fs.writeFileSync(path.join(baseDir, dir, file), content);
    log.ok(`File '${file}' berhasil dibuat di '${dir}'.`);
  },
  readFile: (dir, file) => {
    try {
      const content = fs.readFileSync(path.join(baseDir, dir, file), "utf8");
      log.info(`Isi file '${file}':\n`);
      console.log(style.menu(content));
    } catch (e) {
      log.err(e.message);
    }
  },
  writeFile: (dir, file, content) => {
    try {
      fs.writeFileSync(path.join(baseDir, dir, file), content);
      log.ok(`File '${file}' ditulis ulang.`);
    } catch (e) {
      log.err(e.message);
    }
  },
  deleteFile: (dir, file) => {
    try {
      fs.unlinkSync(path.join(baseDir, dir, file));
      log.ok(`File '${file}' dihapus.`);
    } catch (e) {
      log.err(e.message);
    }
  },
  listDir: (dir) => {
    try {
      const files = fs.readdirSync(path.join(baseDir, dir));
      log.info(`Isi direktori '${dir}':`);
      if (!files.length) console.log(chalk.dim("  (kosong)"));
      else files.forEach((f) => console.log("  " + style.menu(f)));
    } catch (e) {
      log.err(e.message);
    }
  },
};

// ======================================================
// MENU UTAMA (pakai inquirer)
// ======================================================
async function main() {
  printHeader("default", "L Lawliet");
  await showLoading("started");
  console.log(style.success("Connected successfully!\n"));

  while (true) {
    printHeader("eyes");
    const { choice } = await inquirer.prompt([
      {
        type: "list",
        name: "choice",
        message: style.prompt
          ? style.prompt("Pilih menu:")
          : "Pilih menu:",
        choices: [
          { name: "📂  Buat Direktori", value: "dir" },
          { name: "📄  Buat File", value: "file" },
          { name: "📖  Baca File", value: "read" },
          { name: "✏️   Tulis Ulang File", value: "write" },
          { name: "🗑️   Hapus File", value: "delete" },
          { name: "📁  Lihat Isi Direktori", value: "list" },
          new inquirer.Separator(),
          { name: "🚪  Keluar", value: "exit" },
          new inquirer.Separator(),
        ],
      },
    ]);

    if (choice === "exit") {
      await showLoading("closed");
      console.clear();
      process.exit(0);
    }

    switch (choice) {
      case "dir": {
        const { dir } = await inquirer.prompt({
          name: "dir",
          message: "Nama direktori:",
        });
        fsop.createDir(dir);
        break;
      }
      case "file": {
        const { dir, file, content } = await inquirer.prompt([
          { name: "dir", message: "Path direktori:" },
          { name: "file", message: "Nama file:" },
          { name: "content", message: "Isi awal file:" },
        ]);
        fsop.createFile(dir, file, content);
        break;
      }
      case "read": {
        const { dir, file } = await inquirer.prompt([
          { name: "dir", message: "Path direktori:" },
          { name: "file", message: "Nama file:" },
        ]);
        fsop.readFile(dir, file);
        break;
      }
      case "write": {
        const { dir, file, content } = await inquirer.prompt([
          { name: "dir", message: "Path direktori:" },
          { name: "file", message: "Nama file:" },
          { name: "content", message: "Isi baru:" },
        ]);
        fsop.writeFile(dir, file, content);
        break;
      }
      case "delete": {
        const { dir, file } = await inquirer.prompt([
          { name: "dir", message: "Path direktori:" },
          { name: "file", message: "Nama file:" },
        ]);
        fsop.deleteFile(dir, file);
        break;
      }
      case "list": {
        const { dir } = await inquirer.prompt({
          name: "dir",
          message: "Path direktori:",
        });
        fsop.listDir(dir);
        break;
      }
    }

    console.log();
    await inquirer.prompt({
      type: "input",
      name: "pause",
      message: chalk.dim("Tekan Enter untuk kembali ke menu..."),
    });
  }
}

main();