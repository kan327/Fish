"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type FSNode = string | { name: string; children: FSNode[] };
type DirectoryNode = { name: string; children: FSNode[] };

export default function FSPage() {
  const [path, setPath] = useState("/root");
  const [tree, setTree] = useState<DirectoryNode | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchDir(p: string) {
    setLoading(true);
    try {
      const res = await axios.get("/api/fs", {
        params: { p: encodeURIComponent(p) },
      });
      setTree(res.data);
      setPath(p);
    } catch (err) {
      alert("Error: " + err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDir("/root");
  }, []);

  // === CRUD actions ===
  async function createFolder() {
    const name = prompt("Folder name?");
    if (!name) return;
    await axios.post("/api/fs", { path, folderName: name });
    await fetchDir(path);
  }

  async function uploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const form = new FormData();
    form.append("path", path);
    form.append("file", file);
    await axios.post("/api/fs", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    await fetchDir(path);
  }

  async function renameNode(nodeName: string) {
    const newName = prompt("New name?", nodeName);
    if (!newName || newName === nodeName) return;
    await axios.put("/api/fs", { path: path + "/" + nodeName, newName });
    await fetchDir(path);
  }

  async function deleteNode(nodeName: string) {
    if (!confirm(`Delete ${nodeName}?`)) return;
    await axios.delete("/api/fs", {
      params: { p: encodeURIComponent(path + "/" + nodeName) },
    });
    await fetchDir(path);
  }

  // === UI ===
  return (
    <div className="p-6 w-full">
      <h1 className="text-xl font-bold mb-4">File Manager</h1>

      <div className="mb-2">
        <span className="font-mono">{path}</span>
      </div>

      <div className="space-x-2 mb-4">
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded"
          onClick={createFolder}
        >
          + Folder
        </button>
        <label className="px-3 py-1 bg-green-500 text-white rounded cursor-pointer">
          + File
          <input
            type="file"
            onChange={uploadFile}
            className="hidden"
          />
        </label>
      </div>

      {loading && <p>Loading...</p>}

      <ul className="space-y-1">
        {tree?.children?.map((child, i) =>
          typeof child === "string" ? (
            <li key={i} className="flex justify-between items-center">
              <span>📄 {child}</span>
              <div className="space-x-2">
                <button
                  className="px-2 py-0.5 bg-yellow-500 text-white rounded"
                  onClick={() => renameNode(child)}
                >
                  Rename
                </button>
                <button
                  className="px-2 py-0.5 bg-red-500 text-white rounded"
                  onClick={() => deleteNode(child)}
                >
                  Delete
                </button>
              </div>
            </li>
          ) : (
            <li key={i} className="flex justify-between items-center">
              <span
                className="cursor-pointer text-blue-600"
                onClick={() => fetchDir(path + "/" + child.name)}
              >
                📂 {child.name}
              </span>
              <div className="space-x-2">
                <button
                  className="px-2 py-0.5 bg-yellow-500 text-white rounded"
                  onClick={() => renameNode(child.name)}
                >
                  Rename
                </button>
                <button
                  className="px-2 py-0.5 bg-red-500 text-white rounded"
                  onClick={() => deleteNode(child.name)}
                >
                  Delete
                </button>
              </div>
            </li>
          )
        )}
      </ul>

      {path !== "/root" && (
        <div className="mt-4">
          <button
            className="px-3 py-1 bg-gray-400 text-white rounded"
            onClick={() => fetchDir(path.split("/").slice(0, -1).join("/") || "/root")}
          >
            ⬅ Back
          </button>
        </div>
      )}
    </div>
  );
}
