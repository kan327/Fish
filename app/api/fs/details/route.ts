import { readdir, stat } from "fs/promises";
import { join, basename, extname } from "path";
import { NextResponse } from "next/server";
import { formatBytes } from "@/lib/utils";
import { url } from "inspector";


async function getFolderSize(folderPath: string): Promise<number> {
  let total = 0;
  const items = await readdir(folderPath, { withFileTypes: true });

  for (const item of items) {
    const fullPath = join(folderPath, item.name);

    if (item.isDirectory()) {
      total += await getFolderSize(fullPath); // Rekursif
    } else {
      const fileStat = await stat(fullPath);
      total += fileStat.size;
    }
  }

  return total;
}


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const p = searchParams.get("p");
    if (!p) {
      return NextResponse.json({ error: "path param required" }, { status: 400 });
    }

    const pathStr = decodeURIComponent(p);
    const filePath = join(process.cwd(), "public", "storage", pathStr);

    let stats;

    try {
      stats = await stat(filePath);
    } catch (err) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const name = basename(filePath);
    const ext = stats.isFile() ? extname(filePath) : "";

    if (stats.isDirectory()) {
      stats.size = await getFolderSize(filePath); // hitung total isi folder
    }

    return NextResponse.json({
      url: "/storage" + pathStr,      // URL untuk akses file via browser
      name,                           // Nama file atau folder
      ext,                            // Ekstensi (misal: .txt, .jpg) atau kosong jika folder
      size: formatBytes(stats.size),
      createdAt: stats.birthtime,
      modifiedAt: stats.mtime,
      isDirectory: stats.isDirectory(),
      isFile: stats.isFile(),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
