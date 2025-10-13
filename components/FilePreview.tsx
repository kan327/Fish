import { cn, getFileType } from "@/lib/utils";
import { Archive, Clapperboard, Disc3, File, FileAudio, FileText, Folder, Image as ImgIco, Play, SquarePlay } from "lucide-react";
import Image from "next/image";

export const FilePreview = ({ url, fileName, fitMode, isFolder = false, className }: { url: string; fileName: string; fitMode: "cover" | "contain", isFolder: boolean, className?: string }) => {
  const type = getFileType(fileName);

  switch (type) {
    case "image":
      return (
        <Image
          src={url}
          alt={fileName}
          fill
          className={cn(
            "transition-all duration-300 object-center",
            fitMode === "cover" ? "object-cover" : "object-contain",
            className
          )}
        />
      );

    case "video":
      return (
        <div>
          <Play 
            className="cursor-pointer absolute top-1/2 right-1/2 z-10 text-xs bg-primary/25 text-white p-1 rounded-full  translate-x-1/2 -translate-y-1/2 group-hover:opacity-0 transition-opacity duration-300"
          />
          <video
            src={url}
            className={cn(
              "transition-all duration-300 object-center",
              fitMode === "cover" ? "object-cover" : "object-contain",
              className
            )}
            controls={false}
            muted
            preload="metadata"
          />
        </div>
      );

    case "document":
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-700">
          <FileText className={cn("stroke-secondary", className)} size={50} />
          <p className="text-sm mt-2 break-words w-full text-center px-5">{fileName.split(".").pop()?.toLowerCase() || ""}</p>
        </div>
      );

    case "audio":
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-700">
          <Disc3 className={cn("stroke-secondary", className)} size={50} />
          <p className="text-sm mt-2 break-words w-full text-center px-5">{fileName.split(".").pop()?.toLowerCase() || ""}</p>
        </div>
      );

    case "archive":
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-700">
          <Archive className={cn("stroke-secondary", className)} size={50} />
          <p className="text-sm mt-2 break-words w-full text-center px-5">{fileName.split(".").pop()?.toLowerCase() || ""}</p>
        </div>
      );

    default:
      if (isFolder) {
        return (
          <div className="flex flex-col items-center justify-center h-full text-gray-700">
            <Folder className={cn("stroke-secondary", className)} size={50} />
            <p className="text-sm mt-2 break-words w-full text-center px-5">{fileName}</p>
          </div>
        );
      }
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-700">
          <File className={cn("stroke-secondary", className)} size={50} />
          <p className="text-sm mt-2 break-words w-full text-center px-5">{fileName.split(".").pop()?.toLowerCase() || ""}</p>
        </div>
      );
  }
};

export const FileIcon = ({ fileName, isFolder, size = 20, className = "stroke-primary" }: { fileName: string, isFolder: boolean, size?: number, className?: string }) => {
  const type = getFileType(fileName);

  if (isFolder) {
    return <Folder className={className} size={size} />;
  }
  switch (type) {
    case "image":
      return <ImgIco className={className} size={size} />;
    case "video":
      return <SquarePlay className={className} size={size} />;
    case "document":
      return <FileText className={className} size={size} />;
    case "audio":
      return <Disc3 className={className} size={size} />;
    case "archive":
      return <Archive className={className} size={size} />;
    default:
      return <File className={className} size={size} />;
  }
};