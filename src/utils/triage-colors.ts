import type { TriageLevel } from "@/types/patient"

export const getTriageColor = (level: TriageLevel): string => {
  switch (level) {
    case "Immediate":
      return "#FF0808"
    case "Emergency":
      return "#FF8406"
    case "Urgent":
      return "#FFFF09"
    case "Semi":
      return "#089C07"
    case "Nonurgent":
      return "#0A6BCE"
    default:
      return "#0A6BCE"
  }
}

export const getTriageButtonColor = (level: TriageLevel): string => {
  switch (level) {
    case "Immediate":
      return "bg-red-600/60 hover:bg-red-700/60 text-white"
    case "Emergency":
      return "bg-orange-500/60 hover:bg-orange-600/60 text-white"
    case "Urgent":
      return "bg-yellow-300/60 hover:bg-yellow-400/60 text-gray-400/80"
    case "Semi":
      return "bg-green-600/60 hover:bg-green-700/60 text-white"
    case "Nonurgent":
      return "bg-blue-600/60 hover:bg-blue-700/60 text-white"
    default:
      return "bg-gray-500/60 hover:bg-gray-600/60 text-white"
  }
}

export const getTriageBadgeColor = (level: TriageLevel): string => {
  switch (level) {
    case "Immediate":
      return "bg-red-600/60 text-white"
    case "Emergency":
      return "bg-orange-500/60 text-white"
    case "Urgent":
      return "bg-yellow-300/60 text-gray-400/80"
    case "Semi":
      return "bg-green-600/60 text-white"
    case "Nonurgent":
      return "bg-blue-600/60 text-white"
    default:
      return "bg-gray-400/60 text-white"
  }
}


