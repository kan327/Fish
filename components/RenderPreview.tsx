import { formatBytes } from "@/lib/utils";
import { FileText } from "lucide-react";
import Image from "next/image";

/**
 * Render file preview component (image, video, or generic file)
 * @param file - File object (browser File)
 * @param fileUrl - optional preloaded URL (e.g. from server or object URL)
 * @returns JSX.Element preview
 */
export const RenderPreview = ({ file, fileUrl }: {
  file: File;
  fileUrl?: string;
}) => {
  const mime = file.type;
  const ext = file.name.split(".").pop()?.toLowerCase();

  // 🖼 Gambar
  if (mime.startsWith("image/")) {
    return (
      <Image
        src={fileUrl || URL.createObjectURL(file)}
        alt={file.name}
        width={400}
        height={300}
        className="w-full rounded-xl object-cover object-top"
      />
    );
  }

  // 🎥 Video
  if (mime.startsWith("video/")) {
    return (
      <video
        src={fileUrl || URL.createObjectURL(file)}
        controls
        className="w-full rounded-xl max-h-[300px] object-cover"
      />
    );
  }

  // 📄 Dokumen / Archive / File lainnya
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <FileText size={48} className="text-primary mb-2" />
      <p className="text-sm font-medium text-primary">{file.name}</p>
      <p className="text-xs text-gray-400">{formatBytes(file.size)}</p>
      {ext && (
        <p className="text-[10px] text-gray-500 mt-1 uppercase">.{ext}</p>
      )}
    </div>
  );
};