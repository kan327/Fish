export type FileNode = string;

export type DirectoryNode = {
  name: string;
  children: FSNode[];
};

export type FSNode = FileNode | DirectoryNode;

export type FileSystemTree = DirectoryNode; // root selalu directory
