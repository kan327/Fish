"use client";

import { Button } from "./ui/button"
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group"
import FileUploader from "./FileUploader"
import { useEffect, useState } from "react"
import axios from "axios";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const DeleteForm = ({ fetchDir, path, onOpenChange, nameItem }: { fetchDir: (p: string) => void, path: string, onOpenChange: (param: boolean) => void, nameItem: string }) => {
  const [confirmName, setConfirmName] = useState("");
  const [confirmFailed, setConfirmFailed] = useState(false);

  async function deleteNode() {
    try {
      if (confirmName !== nameItem) {
        setConfirmFailed(true);
        return;
      }
      setConfirmFailed(false);
      await axios.delete("/api/fs", {
        params: { p: encodeURIComponent(path + "/" + nameItem) },
      });
      fetchDir(path);
      toast.success(`${confirmName} Deleted successfully`);
      setConfirmName("");
      onOpenChange(false);
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
  

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Delete</DialogTitle>
        <DialogDescription>
          This action cannot be undone. Are you sure to delete this? <br /><span className="font-bold">{nameItem}</span>
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-4">
        <div className="grid gap-2">
          <Label htmlFor="folder-name">Type the name item to confirm</Label>
          <Input value={confirmName} onChange={(e) => setConfirmName(e.target.value)} id="folder-name" placeholder="Enter folder name" className={cn("focus-visible:border-destructive focus-visible:ring-destructive/40", confirmFailed && "border-destructive")} />
          {confirmFailed && (
            <span className="text-destructive text-sm">the confirm name not match with the item name</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="destructive" onClick={deleteNode}>Delete</Button>
        </div>
      </div>
    </DialogContent>
  )
}

export default DeleteForm