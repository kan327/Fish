// app/api/fs/route.ts
import { NextResponse } from "next/server";
import { addFolder, addFile, validateRootPath, loadFS, findDirectory, deleteNode, renameNode } from "@/lib/fs-utils";
import { promises as fs } from "fs";
import path from "path";

// Handle POST (buat folder atau upload file)
export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    
    // === CASE 1: multipart upload (add file) ===
    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const pathStr = form.get("path") as string;
      const file = form.get("file") as File;

      if (!pathStr || !file) {
        return NextResponse.json({ error: "path and file required" }, { status: 400 });
      }

      // simpan file ke tmp dulu
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const tmpFilePath = path.join(process.cwd(), "tmp-upload-" + Date.now());
      await fs.writeFile(tmpFilePath, buffer);

      await addFile(pathStr, file.name, tmpFilePath);

      return NextResponse.json({ ok: true, message: "File uploaded" });
    }
    
    // === CASE 2: JSON payload (add folder) ===
    const body = await req.json();
    const { path: pathStr, folderName } = body;
    
    if (!pathStr || !folderName) {
      return NextResponse.json({ error: "path and folderName required" }, { status: 400 });
    }
    
    // return NextResponse.json({ error: "masuk kah?" }, { status: 400 });
    await addFolder(pathStr, folderName);

    return NextResponse.json({ ok: true, message: "Folder created" });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const p = searchParams.get("p") || "/root";

    // decode agar dari %2Froot%2F... -> "/root/..."
    const pathStr = decodeURIComponent(p);

    // validasi path
    const parts = validateRootPath(pathStr);
    const tree = await loadFS();

    // kalau dia minta persis "/root" -> return root
    if (parts.length === 1) {
      return NextResponse.json(tree);
    }

    // cari directory target
    const dir = findDirectory(tree, parts);
    if (!dir) {
      return NextResponse.json({ error: "Directory not found" }, { status: 404 });
    }

    return NextResponse.json(dir);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const p = searchParams.get("p");
    if (!p) {
      return NextResponse.json({ error: "p query param required" }, { status: 400 });
    }

    const pathStr = decodeURIComponent(p);
    await deleteNode(pathStr);

    return NextResponse.json({ ok: true, message: `Deleted ${pathStr}` });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { path: pathStr, newName } = body;

    if (!pathStr || !newName) {
      return NextResponse.json({ error: "path and newName required" }, { status: 400 });
    }

    await renameNode(pathStr, newName);

    return NextResponse.json({ ok: true, message: `Renamed to ${newName}` });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}