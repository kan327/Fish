import axios from "axios";
import { Button } from "./ui/button"
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { useEffect, useState } from "react";
import { toast } from "sonner";

const EditForm = ({ fetchDir, path, onOpenChange, oldName }: { fetchDir: (p: string) => void, path: string, onOpenChange: (param: boolean) => void, oldName: string }) => {
  const [newName, setNewName] = useState(oldName);
  useEffect(() => {
    setNewName(oldName);
  }, [oldName]);
  async function renameNode() {
    if (!newName || newName === oldName) return;

    try {
      await axios.put("/api/fs", { path: path + "/" + oldName, newName });
      fetchDir(path);
      toast.success(`${oldName} renamed to ${newName} successfully`, {
        description: "Folder renamed and reloaded.",
      })
      setNewName("");
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
        <DialogTitle>New Name</DialogTitle>
      </DialogHeader>

      <div className="flex flex-col gap-4">
        <Input id="folder-name" onChange={(e) => setNewName(e.target.value)} value={newName} placeholder="Enter New name" />

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => renameNode()}>Rename</Button>
        </div>
      </div>
    </DialogContent>
  )
}

export default EditForm