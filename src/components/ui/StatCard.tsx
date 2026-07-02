import Link from "next/link"

interface StatCardProps {
  label: string
  value: string | number
  color: string
  icon: React.ReactNode
  href?: string
}

const colorMap: Record<string, string> = {
  green:  "var(--ne-accent)",
  blue:   "#339af0",
  orange: "#f59f00",
  red:    "#f03e3e",
  cyan:   "#22d3ee",
  purple: "#a78bfa",
  pink:   "#f472b6",
  teal:   "#14b8a6",
}

export default function StatCard({ label, value, color, icon, href }: StatCardProps) {
  const accentColor = colorMap[color] ?? colorMap.green
  const inner = (
    <div
      className="ne-stat-card"
      style={{
        ['--card-accent' as string]: accentColor,
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          background: `${accentColor}22`,
          color: accentColor,
          fontSize: '20px',
        }}
      >
        {icon}
      </div>
      <div>
        <p className="ne-stat-label">{label}</p>
        <p className="ne-stat-value">{value}</p>
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} style={{ display: 'block', textDecoration: 'none' }}>
        {inner}
      </Link>
    )
  }
  return inner
}
