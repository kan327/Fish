"use client"

import { Archive, Download, EllipsisVertical, File, FileText, FishSymbol, Folder, Frame, Maximize2Icon, Minimize2Icon, Pencil, Ship, SquareArrowOutUpRight, Trash } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import Image from "next/image"
import { useState } from "react";
import { cn, getFileType } from "@/lib/utils";
import { Dialog, DialogTrigger } from "./ui/dialog";
import UploadForm from "./UploadForm";
import EditForm from "./EditForm";
import DeleteForm from "./DeleteForm";
import { FSNode } from "@/lib/fs-utils";
import { FilePreview, FileIcon } from "./FilePreview";

const CardMenu = ({ setOpenEdit, isFolder, setOpenDelete, openEdit, fileName, path, fetchDir, openDelete }: {
  setOpenEdit: (p: boolean) => void
  setOpenDelete: (p: boolean) => void
  openEdit: boolean
  openDelete: boolean
  isFolder?: boolean | "" | null
  fileName: string
  path: string
  fetchDir: (p: string) => void
}) => (
  <>
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVertical className="cursor-pointer" size={20} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Tools</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => setOpenEdit(true)} >
          <Pencil /> Rename
        </DropdownMenuItem>
        {isFolder &&
          <DropdownMenuItem><Ship /> Release To Ocean</DropdownMenuItem>
        }
        <DropdownMenuItem><SquareArrowOutUpRight /> Open in new tab</DropdownMenuItem>
        <DropdownMenuItem><Download /> Download</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-400 hover:!text-red-500 hover:!bg-red-100"
          onSelect={() => setOpenDelete(true)}
        >
          <Trash color="oklch(70.4% 0.191 22.216)" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <Dialog open={openEdit} onOpenChange={setOpenEdit}>
      <EditForm oldName={fileName} onOpenChange={setOpenEdit} path={path} fetchDir={fetchDir} />
    </Dialog>
    <Dialog open={openDelete} onOpenChange={setOpenDelete}>
      <DeleteForm nameItem={fileName} onOpenChange={setOpenDelete} path={path} fetchDir={fetchDir} />
    </Dialog></>
)

const CardFs = ({
  path,
  child,
  isSelected,
  fetchDir,
  layout = "grid",
  ...divprops
}: React.HTMLAttributes<HTMLDivElement> & {
  path: string,
  child: FSNode | null,
  fetchDir: (p: string) => void,
  layout?: "grid" | "list"
  isSelected?: boolean,
}) => {
  const [fitMode, setFitMode] = useState<"cover" | "contain">("contain");
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const isFolder = child && typeof child !== "string" && "children" in child;
  const fileName = !isFolder && typeof child === "string" ? child : child?.name || "Unknown";
  const fileType = getFileType(fileName);

  return (
    <div className="flex flex-col cursor-pointer" {...divprops} >
      {layout == "grid" ? (
        <>
          {/* header */}
          <div className={cn("flex justify-between items-center rounded-xl rounded-b-none border border-black py-3 px-5 pr-3",
            isSelected && "bg-secondary border-primary"
          )}>
            <div className="flex gap-2 items-center">
              <FileIcon className={cn(isSelected && "fill-primary stroke-secondary")} fileName={fileName} isFolder={isFolder ? true : false} />
              <span className="font-medium truncate max-w-40">{fileName}</span>
            </div>

            <CardMenu
              fileName={fileName}
              isFolder={isFolder}
              path={path}
              fetchDir={fetchDir}
              openEdit={openEdit}
              setOpenEdit={setOpenEdit}
              openDelete={openDelete}
              setOpenDelete={setOpenDelete}
            />
          </div>

          {/* preview */}
          <div className={cn("relative h-32 w-full overflow-hidden border-x border-black group",
            isSelected && "bg-secondary/15 border-primary"
          )}>
            <FilePreview className={cn(isSelected && "fill-accent stroke-background")} url={"/storage" + path + "/" + fileName} fileName={fileName} fitMode={fitMode} isFolder={isFolder ? true : false} />
            {(getFileType(fileName) === "image" || getFileType(fileName) === "video") && (
              <button
                onClick={() => setFitMode(fitMode === "contain" ? "cover" : "contain")}
                className="cursor-pointer absolute bottom-2 right-2 z-10 text-xs bg-primary/25 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                {fitMode === "contain" ? <Maximize2Icon size={15} /> : <Minimize2Icon size={15} />}
              </button>
            )}
          </div>
          {/* Footer */}
          <div className={cn("flex justify-between items-center rounded-xl rounded-t-none border border-black py-3 px-5",
            isSelected && "bg-secondary border-primary"
          )}>
            <div className="flex gap-2 items-center">
              <Image
                src="https://i.pravatar.cc/40"
                alt="avatar"
                width={20}
                height={20}
                className="w-6 h-6 rounded-full border border-primary cursor-pointer"
              />
              <span className="font-medium truncate w-40">You</span>
            </div>

            <div className="flex">
              {isFolder && (
                <Folder className="stroke-primary fill-primary" size={18} />
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={cn("flex p-2 border rounded-xl border-primary", isSelected && "bg-secondary")}>
            <div className="flex gap-2 items-center">
              <FileIcon fileName={fileName} isFolder={isFolder ? true : false} className={cn("w-8 h-8", isSelected && "fill-primary stroke-secondary")} />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{fileName}</p>
                <p className="text-xs text-muted-foreground">{fileType}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              {isFolder && (
                <Folder className="stroke-primary fill-primary" size={18} />
              )}
              <CardMenu
                fileName={fileName}
                isFolder={isFolder}
                path={path}
                fetchDir={fetchDir}
                openEdit={openEdit}
                setOpenEdit={setOpenEdit}
                openDelete={openDelete}
                setOpenDelete={setOpenDelete}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default CardFs