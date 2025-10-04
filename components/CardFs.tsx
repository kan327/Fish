"use client"

import { Download, EllipsisVertical, FishSymbol, Folder, Frame, Maximize2Icon, Minimize2Icon, Pencil, SquareArrowOutUpRight, Trash } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import Image from "next/image"
import { useState } from "react";
import { cn } from "@/lib/utils";

const CardFs = () => {
  const [fitMode, setFitMode] = useState<"cover" | "contain">("contain");

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center rounded-xl rounded-b-none border border-black py-3 px-5 bg-secondary">
        <div className="flex gap-2 items-center">
          <Folder style={{
            stroke: "none",
            fill: "var(--primary)", // jika icon support fill
          }} />
          <span className="font-medium truncate w-40">Folder Name</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <EllipsisVertical className="cursor-pointer" size={20} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Tools</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem><Pencil /> Rename</DropdownMenuItem>
            <DropdownMenuItem><FishSymbol /> Release Fish</DropdownMenuItem>
            <DropdownMenuItem><SquareArrowOutUpRight /> Open in new tab</DropdownMenuItem>
            <DropdownMenuItem><Download /> Download</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-400 hover:!text-red-500 hover:!bg-red-100"
            >
              <Trash color="oklch(70.4% 0.191 22.216)" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="relative h-32 w-full overflow-hidden border-x border-black group">
        <Image
          src="https://placehold.co/40x40.jpg"
          alt="placeholder"
          fill
          className={cn(
            "transition-all duration-300 object-center",
            fitMode === "cover" ? "object-cover" : "object-contain"
          )}
        />

        {/* Toggle button, only visible on hover */}
        <button
          onClick={() => setFitMode(fitMode === "contain" ? "cover" : "contain")}
          className="absolute bottom-2 right-2 z-10 text-xs bg-primary/25 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          {fitMode === "contain" ? <Maximize2Icon size={15} /> : <Minimize2Icon size={15} />}
        </button>
      </div>
      <div className="flex justify-between items-center rounded-xl rounded-t-none border border-black py-3 px-5 bg-secondary">
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
          <FishSymbol size={20} />
        </div>
      </div>
    </div>
  )
}

export default CardFs