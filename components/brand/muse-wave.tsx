import { cn } from "@/lib/utils"

type MuseWaveProps = {
  variant?: "default" | "inverted"
  className?: string
}

/** Brand wave divider from public/UI-elements */
export function MuseWave({ variant = "default", className }: MuseWaveProps) {
  const src =
    variant === "inverted"
      ? "/UI-elements/Group%2019.svg"
      : "/UI-elements/Group%2018.svg"

  return (
    <div
      className={cn("w-full overflow-hidden pointer-events-none select-none", className)}
      aria-hidden
    >
      <img
        src={src}
        alt=""
        className="w-full min-w-[800px] h-auto max-h-24 sm:max-h-32 object-cover object-center"
      />
    </div>
  )
}
