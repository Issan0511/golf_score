import type { SVGProps } from "react"

export function GolfIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 18v-6" />
      <path d="M8 18v-1" />
      <path d="M16 18v-3" />
      <path d="M2 9h20" />
      <path d="M16 9a4 4 0 0 0-8 0" />
      <path d="M12 3v6" />
    </svg>
  )
}

