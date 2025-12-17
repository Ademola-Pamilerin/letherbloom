interface PlanCardProps {
  name: string;
  description: string;
  featured?: boolean;
}

export default function PlanCard({
  name,
  description,
  featured = false,
}: PlanCardProps) {
  return (
    <div
      className={`flex flex-col w-full rounded-lg p-6 shadow transition-transform ${
        featured
          ? "border-2 border-rose-600 shadow-lg scale-110 bg-rose-50"
          : "bg-white"
      }`}
    >
      <h4 className="font-semibold">{name}</h4>
      <p className="mt-2 flex-grow text-sm text-zinc-600">{description}</p>
    </div>
  );
}
