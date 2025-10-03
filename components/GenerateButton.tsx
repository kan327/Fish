import { ButtonHTMLAttributes, ReactNode } from "react";

type SButtonProps = {
  children?: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * Spesial Button
 * Props:
 *  - onClick: function (opsional)
 *  - className: string (opsional tambahan kelas Tailwind)
 */
export default function SButton({ children = null, className = "", ...rest }: SButtonProps) {
  return (
    // Wrapper untuk membuat efek border gradient yang rapi
    <span
      className={`rounded-md cursor-pointer bg-gradient-to-r from-pink-200 via-fuchsia-100 to-secondary ${className}`}
      aria-hidden="true"
    >
      <button
        type="button"
        // Tombol bagian dalam: warna latar, radius, shadow, transition & animasi interaksi
        className="
          cursor-pointer
          w-full
          group
          relative
          rounded-md
          px-3
          py-2
          bg-white/10
          backdrop-blur-sm
          text-foreground
          font-medium
          text-sm
          shadow-sm
          transition-transform
          duration-150
          ease-out
          transform
          hover:scale-105
          hover:shadow-lg
          active:scale-95
          active:translate-y-0.5
          border-pink-400/15 border
        "
        aria-label="Generate Ai"
        {...rest} 
      >
        <span className="items-center gap-2 flex justify-center">
          {children}
        </span>

        {/* subtle shine effect on hover using gradient overlay */}
        <span
          aria-hidden="true"
          className="
            absolute inset-0 rounded-md
            opacity-0
            group-hover:opacity-20
            transition-opacity
            duration-300
            pointer-events-none
            bg-white/5
            mix-blend-screen
          "
        />
      </button>
    </span>
  );
}
