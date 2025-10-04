"use client";

import { Button } from "./ui/button"
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group"
import FileUploader from "./FileUploader"
import { useState } from "react"

const UploadForm = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [type, setType] = useState<"folder" | "file">("folder");

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
        <ToggleGroup type="single" value={type} onValueChange={(val) => val && setType(val as "folder" | "file")}>
          <ToggleGroupItem value="folder">Folder</ToggleGroupItem>
          <ToggleGroupItem value="file">File</ToggleGroupItem>
        </ToggleGroup>

        {/* Jika folder */}
        {type === "folder" && (
          <div className="grid gap-2">
            <Label htmlFor="folder-name">Folder Name</Label>
            <Input id="folder-name" placeholder="Enter folder name" />
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
          <Button variant="outline">Cancel</Button>
          <Button>Create</Button>
        </div>
      </div>
    </DialogContent>
  )
}

export default UploadForm