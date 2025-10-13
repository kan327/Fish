import React from "react"
import { cn, formatBytes, parseSizeToBytes } from "@/lib/utils"
import { Button } from "./ui/button"
import { AlertTriangle, RefreshCcw } from "lucide-react"
import { Skeleton } from "./ui/skeleton"
import { toast } from "sonner"

interface StorageInfoProps {
  refetch: () => void
  isLoading: boolean
  used: string // contoh: "112.8 KB", "32.21 MB", "1 GB"
  max?: number // default 1 GB (ubah ke 8GB kalau mau)
}

export function StorageInfo({ refetch, isLoading, used, max = 2 * 1024 ** 3 }: StorageInfoProps) {
  const usedBytes = parseSizeToBytes(used)
  const percent = (usedBytes / max) * 100
  const freeBytes = max - usedBytes
  const isFull = usedBytes >= max

  const getBarColor = () => {
    if (isFull) return "from-red-500 to-red-600"
    if (percent > 80) return "from-orange-400 to-orange-500"
    if (percent > 60) return "from-yellow-400 to-yellow-500"
    return "from-primary to-purple-600"
  }

  return (
    <div
      className={cn(
        "bg-gradient-to-br p-4 rounded-xl shadow-sm border transition-colors duration-300",
        isFull ? "from-red-50 to-red-100 border-red-300" : "from-purple-50 to-secondary border-primary"
      )}
    >
      <div className="flex justify-between text-xs font-medium text-gray-600 mb-2">
        <span>{isLoading ? (
          <Skeleton className="w-8 h-5 bg-secondary" />
        ) : used}</span>
        <span>{isLoading ? (
          <Skeleton className="w-8 h-5 bg-secondary" />
        ) : formatBytes(Math.max(freeBytes, 0))}</span>
      </div>

      {/* Progress bar */}
      <div className="relative w-full h-3 bg-secondary rounded-full overflow-hidden mb-2">
        <div
          className={cn(
            "absolute left-0 top-0 h-full transition-all duration-500",
            `bg-gradient-to-r ${getBarColor()}`
          )}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
      {/* Info */}
      {isLoading ? (
        <Skeleton className="w-22 h-5 bg-secondary mb-2" />
      ) : (
        <p
          className={cn(
            "text-xs font-medium mb-2 transition-colors flex items-center gap-1 justify-between",
            isFull ? "text-red-600" : "text-gray-700"
          )}
        >
          {isFull
            ? `You've hit your ${formatBytes(max)} Plan.`
            : `${percent.toFixed(1)}% of ${formatBytes(max)} used`
          }
          <RefreshCcw size={18} className={cn("cursor-pointer bg-secondary rounded-full p-1", isFull ? "hover:bg-red-600 hover:stroke-white" : "hover:bg-primary hover:stroke-white")} onClick={() => refetch()} />
        </p>
      )}

      {/* Tombol */}
      <Button
        className={cn(
          "w-full text-sm py-1.5 rounded-lg transition",
          isFull
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-primary hover:bg-primary/80 text-white"
        )}
        onClick={() => toast("Upgrade storage feature coming soon !", {
          action: {
            label: "Okay",
            onClick: () => toast("but, thanks for interesting !"),
          },
        })}
      >
        {isFull ? (
          <span className="flex items-center justify-center gap-1">
            <AlertTriangle className="w-4 h-4" /> Upgrade Now
          </span>
        ) : (
          "Upgrade"
        )}
      </Button>
    </div>
  )
}
