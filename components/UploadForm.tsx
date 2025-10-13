"use client";

import { Button } from "./ui/button"
import { DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group"
import FileUploader from "./FileUploader"
import { useState } from "react"
import axios from "axios";
import { toast } from "sonner";

const UploadForm = ({ fetchDir, path, onOpenChange }: { fetchDir: (p: string) => void, path: string, onOpenChange: (param :boolean) => void }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [type, setType] = useState<"folder" | "file">("folder");
  const [name, setName] = useState("");

  async function createFolder() {
    if (!name) return;
    try {
      await axios.post("/api/fs", { path, folderName: name });
      fetchDir(path);
      toast.success(`Folder ${name} created successfully`);
      setName("");
      setFiles([]);
    } catch (err) {
      toast("Error has been Occured", {
        description: "The Change was not saved",
        // action: {
        //   label: "Undo",
        //   onClick: () => console.log("Undo"),
        // },
      })
    }
  }
  async function uploadFile() {
    if (files.length === 0) return;
    const form = new FormData();
    form.append("path", path);
    form.append("file", files[0]);
    try {
      await axios.post("/api/fs", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(`File ${name} created successfully`);
      onOpenChange(false);
      setName("");
      setFiles([]);
    } catch (error) {
      toast("Error has been Occured", {
        description: "The Change was not saved",
        // action: {
        //   label: "Undo",
        //   onClick: () => console.log("Undo"),
        // },
      })
    }
    fetchDir(path);
  }

  const handleSubmit = async () => {
    if (type === "folder") {
      await createFolder();
    } else {
      await uploadFile();
    }
  }

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Create new {type}</DialogTitle>
        <DialogDescription>
          Choose whether you want to create a folder or file.
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-4">
        {/* Toggle jenis */}
        <ToggleGroup className="w-full" type="single" value={type} onValueChange={(val) => val && setType(val as "folder" | "file")}>
          <ToggleGroupItem className="cursor-pointer" value="folder">Folder</ToggleGroupItem>
          <ToggleGroupItem className="cursor-pointer" value="file">File</ToggleGroupItem>
        </ToggleGroup>

        {/* Jika folder */}
        {type === "folder" && (
          <div className="grid gap-2">
            <Label htmlFor="folder-name">Folder Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} id="folder-name" placeholder="Enter folder name" />
          </div>
        )}

        {/* Jika file */}
        {type === "file" && (
          // <div className="grid gap-2">
          //   <Label>Upload File</Label>
          //   <div
          //     {...getRootProps()}
          //     className={`flex h-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          //       }`}
          //   >
          //     <input {...getInputProps()} />
          //     {isDragActive ? (
          //       <p>Drop file here...</p>
          //     ) : (
          //       <p>Drag & drop file here, or <span className="text-blue-600">click to upload</span></p>
          //     )}
          //   </div>
          //   {files.length > 0 && (
          //     <ul className="text-sm mt-2">
          //       {files.map((file) => (
          //         <li key={file.name}>
          //           {file.name} ({Math.round(file.size / 1024)} KB)
          //         </li>
          //       ))}
          //     </ul>
          //   )}
          // </div>
          <div className="max-h-[400px]">
            <FileUploader
              fieldChange={(selectedFiles) => setFiles(selectedFiles)}
              mediaUrl=""
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit}>Create</Button>
        </div>
      </div>
    </DialogContent>
  )
}

export default UploadForm