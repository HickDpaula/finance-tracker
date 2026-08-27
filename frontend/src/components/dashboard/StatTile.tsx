import type { LucideIcon } from 'lucide-react'

interface StatTileProps {
  label: string
  value: string
  icon: LucideIcon
  accentColor: string
  accentBg: string
}

export function StatTile({ label, value, icon: Icon, accentColor, accentBg }: StatTileProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#141414] p-5">
      <div
        className="mb-4 flex h-9 w-9 items-center justify-center rounded-md"
        style={{ backgroundColor: accentBg, color: accentColor }}
      >
        <Icon size={18} />
      </div>
      <p className="text-sm text-[#898781]">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
    </div>
  )
}
