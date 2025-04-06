type TriageLevel = "Immediate" | "Emergency" | "Urgent" | "Semi" | "Nonurgent"

interface TriageStats {
  level: TriageLevel
  patients: number
  avgMinutes: number
  color: string
}

interface TriageCardProps {
  data: TriageStats;
}

export function TriageCard({ data }: TriageCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      <div className="flex items-center gap-2">
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: data.color }}
        />
        <span className="font-medium text-gray-800">{data.level}</span>
      </div>

      <div className="flex justify-between">
        <div>
          <div className="text-2xl font-bold">{data.patients}</div>
          <div className="text-sm text-gray-500">patients</div>
        </div>

        {/* <div className="text-right">
          <div className="text-2xl font-bold">{data.avgMinutes}</div>
          <div className="text-sm text-gray-500">avg min</div>
        </div> */}
      </div>
    </div>
  );
}
