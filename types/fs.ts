export type FileNode = string;

export type DirectoryNode = {
  name: string;
  children: FSNode[];
};

export type FSNode = FileNode | DirectoryNode;

export type FileSystemTree = DirectoryNode; // root selalu directory


export const supportedFileTypes: { [key: string]: string[] } = {
      // 🖼 Gambar
      "image/*": [".png", ".jpeg", ".jpg", ".svg", ".webp"],
      // 🎥 Video
      "video/*": [".mp4", ".mov", ".avi", ".webm"],
      // 📄 Dokumen
      "application/pdf": [".pdf"],
      "application/msword": [".doc", ".docx"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
        ".docx",
      ],
      "application/vnd.ms-excel": [".xls", ".xlsx"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-powerpoint": [".ppt", ".pptx"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": [
        ".pptx",
      ],
      "text/plain": [".txt"],
      // 📦 Archive
      "application/zip": [".zip"],
      "application/x-zip-compressed": [".zip", ".rar"],
      "application/x-rar-compressed": [".rar"],
      "application/x-7z-compressed": [".7z"],
      "application/x-tar": [".tar"],
      "application/gzip": [".gz"],
    }