import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// helper untuk format ukuran file
export const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export function parseSizeToBytes(size: string): number {
  const units = ["B", "KB", "MB", "GB", "TB"]
  const [valueStr, unitRaw] = size.trim().split(" ")
  const value = parseFloat(valueStr)
  const unit = unitRaw?.toUpperCase().replace("BYTES", "B") || "B"
  const power = units.indexOf(unit)
  return value * Math.pow(1024, power >= 0 ? power : 0)
}

export const getFileType = (fileName: string): string => {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext)) return "image";
  if (["mp4", "mov", "avi", "webm"].includes(ext)) return "video";
  if (["pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "txt"].includes(ext)) return "document";
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return "archive";
  if (["mp3", "wav", "flac", "aac"].includes(ext)) return "audio";
  if (!ext) return "folder";
  return "other";
};