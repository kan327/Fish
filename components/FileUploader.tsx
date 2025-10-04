"use client";

import React, { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import Image from "next/image";
import { CloudUpload, FileText } from "lucide-react";
import { formatBytes } from "@/lib/utils";
import { RenderPreview } from "./RenderPreview";
import { supportedFileTypes } from "@/types/fs";

type FileUploaderProps = {
  fieldChange: (FILES: File[]) => void;
  mediaUrl?: string;
};

const FileUploader = ({ fieldChange, mediaUrl = "" }: FileUploaderProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState<string>(mediaUrl);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFiles(acceptedFiles);
      fieldChange(acceptedFiles);

      // generate URL preview hanya untuk file pertama
      if (acceptedFiles.length > 0) {
        const url = URL.createObjectURL(acceptedFiles[0]);
        setFileUrl(url);
      }
    },
    [fieldChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: supportedFileTypes,
  });

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col items-center justify-center bg-secondary rounded-xl cursor-pointer transition-all duration-300 ${
        isDragActive ? "border-2 border-primary/50 bg-primary/10" : ""
      }`}
    >
      <input {...getInputProps()} className="cursor-pointer" />

      {files.length > 0 ? (
        <>
          <div className="flex flex-1 justify-center w-full p-4">
            <RenderPreview file={files[0]}/>
          </div>
          <p className="text-primary text-center text-[14px] font-normal leading-[140%] w-full p-4 border-t border-t-primary">
            Click or drag to replace
          </p>
        </>
      ) : (
        <div className="flex justify-center items-center flex-col p-7">
          <CloudUpload width={96} height={77} />
          <h3 className="base-medium text-foreground mb-2">Drag & drop here</h3>
          {/* <p className="text-light-4 small-regular mb-6 text-center">
            Image, Doc
          </p> */}

          <Button>Select</Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
