// lib/fs.ts
import fs from "fs";
import path from "path";

export type FileNode = string;
export type DirectoryNode = { name: string; children: FSNode[] };
export type FSNode = FileNode | DirectoryNode;
export type FileSystemTree = DirectoryNode;

const PROJECT_ROOT = process.cwd();
export const FS_JSON = path.join(PROJECT_ROOT, "filesystem.json");
export const STORAGE_ROOT = path.join(PROJECT_ROOT, "storage", "root");

// Simple in-process mutex to avoid concurrent writes in single Node process.
// NOTE: doesn't protect across multiple processes/instances.
let mutex: Promise<void> = Promise.resolve();
async function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const start = mutex;
  let done!: () => void;
  mutex = new Promise<void>((res) => (done = res));
  await start;
  try {
    return await fn();
  } finally {
    done();
  }
}

export async function loadFS(): Promise<FileSystemTree> {
  try {
    const raw = await fs.promises.readFile(FS_JSON, "utf8");
    return JSON.parse(raw) as FileSystemTree;
  } catch (e) {
    // jika belum ada, bikin default root
    const root: FileSystemTree = { name: "root", children: [] };
    await saveFS(root);
    return root;
  }
}

export async function saveFS(tree: FileSystemTree): Promise<void> {
  await withLock(async () => {
    const tmp = FS_JSON + ".tmp";
    await fs.promises.writeFile(tmp, JSON.stringify(tree, null, 2), "utf8");
    await fs.promises.rename(tmp, FS_JSON);
  });
}

// normalize path string like "/root/games/mario" -> ["root","games","mario"]
export function splitPath(p: string): string[] {
  // pakai posix agar konsisten di windows/unix
  const np = path.posix.normalize(p);
  const parts = np.split("/").filter(Boolean);
  return parts;
}

// pastikan path valid dan dimulai dengan "root"
export function validateRootPath(p: string) {
  const parts = splitPath(p);
  if (parts.length === 0 || parts[0] !== "root") {
    throw new Error("Path must start with /root");
  }
  return parts;
}

export function joinToStorage(parts: string[]) {
  // ignore first "root" because STORAGE_ROOT already points ke ./storage/root
  const relative = parts.slice(1);
  return path.join(STORAGE_ROOT, ...relative);
}

// cari directory node berdasarkan path
export function findDirectory(tree: FileSystemTree, parts: string[]): DirectoryNode | null {
  // parts: ["root","games","mario"]
  let cur: DirectoryNode | null = tree;
  if (parts[0] !== tree.name) return null;
  for (let i = 1; i < parts.length; i++) {
    const seg = parts[i];
    const next = cur.children.find((c) => typeof c !== "string" && c.name === seg) as DirectoryNode | undefined;
    if (!next) return null;
    cur = next;
  }
  return cur;
}
  
// add folder (both in filesystem.json and on disk)
export async function addFolder(pathStr: string, folderName: string): Promise<void> {
  const parts = validateRootPath(pathStr);
  // await withLock(async () => {
    const tree = await loadFS();
    const dir = findDirectory(tree, parts);
    if (!dir) throw new Error("Parent path not found");

    // cek duplicate
    const exists = dir.children.some((c) => (typeof c === "string" ? c === folderName : c.name === folderName));
    if (exists) throw new Error("Name already exists in target directory");

    // update json structure
    const newDir: DirectoryNode = { name: folderName, children: [] };
    dir.children.push(newDir);
    await saveFS(tree);

    // create on disk
    const storagePath = joinToStorage([...parts, folderName]);
    await fs.promises.mkdir(storagePath, { recursive: true });
  // });
}

// add file (fileContentPath: temp path dari formidable)
export async function addFile(pathStr: string, filename: string, tmpFilePath: string): Promise<void> {
  const parts = validateRootPath(pathStr);
  // await withLock(async () => {
    const tree = await loadFS();
    const dir = findDirectory(tree, parts);
    if (!dir) throw new Error("Parent path not found");

    const exists = dir.children.some((c) => (typeof c === "string" ? c === filename : c.name === filename));
    if (exists) throw new Error("Name already exists in target directory");

    // move file ke storage
    const destDir = joinToStorage(parts);
    await fs.promises.mkdir(destDir, { recursive: true });
    const destPath = path.join(destDir, filename);
    await fs.promises.rename(tmpFilePath, destPath);

    // update json
    dir.children.push(filename);
    await saveFS(tree);
  // });
}

// delete node (file or folder). For folder, delete recursively.
export async function deleteNode(pathStr: string): Promise<void> {
  const parts = validateRootPath(pathStr);
  if (parts.length === 1) throw new Error("Cannot delete root");

  // await withLock(async () => {
    const tree = await loadFS();
    const parentParts = parts.slice(0, -1);
    const name = parts[parts.length - 1];
    const parent = findDirectory(tree, parentParts);
    if (!parent) throw new Error("Parent not found");

    const idx = parent.children.findIndex((c) => (typeof c === "string" ? c === name : c.name === name));
    if (idx === -1) throw new Error("Node not found");

    // remove from json
    parent.children.splice(idx, 1);
    await saveFS(tree);

    // remove from disk
    const target = joinToStorage(parts);
    // gunakan rm -r (Node 12.10+)
    await fs.promises.rm(target, { recursive: true, force: true });
  // });
}

// rename node (update name in json and move on disk)
export async function renameNode(pathStr: string, newName: string): Promise<void> {
  const parts = validateRootPath(pathStr);
  if (parts.length === 1) throw new Error("Cannot rename root");

  // await withLock(async () => {
    const tree = await loadFS();
    const parentParts = parts.slice(0, -1);
    const oldName = parts[parts.length - 1];
    const parent = findDirectory(tree, parentParts);
    if (!parent) throw new Error("Parent not found");

    const idx = parent.children.findIndex((c) => (typeof c === "string" ? c === oldName : c.name === oldName));
    if (idx === -1) throw new Error("Node not found");

    // check duplicate newName
    const dup = parent.children.some((c) => (typeof c === "string" ? c === newName : c.name === newName));
    if (dup) throw new Error("Name already exists in target directory");

    // update json
    const node = parent.children[idx];
    if (typeof node === "string") {
      parent.children[idx] = newName;
    } else {
      node.name = newName;
    }
    await saveFS(tree);

    // move on disk
    const oldPath = joinToStorage(parts);
    const newPath = joinToStorage([...parentParts, newName]);
    await fs.promises.mkdir(path.dirname(newPath), { recursive: true });
    await fs.promises.rename(oldPath, newPath);
  // });
}
