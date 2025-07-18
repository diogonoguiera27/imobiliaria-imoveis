import { Calendar } from "lucide-react";

interface Visit {
  id: number;
  data: string;
  hora: string;
  endereco: string;
  status: string;
}

interface ScheduledVisitsProps {
  visits: Visit[];
}

export default function ScheduledVisits({ visits }: ScheduledVisitsProps) {
  return (
    <div className="!bg-neutral-800 !rounded-xl !p-6 !shadow-xl">
      <h3 className="!text-lg !font-semibold !mb-4 flex items-center gap-2">
        <Calendar className="text-blue-400" /> Visitas Agendadas
      </h3>
      <div className="!space-y-4">
        {visits.map((visita) => (
          <div
            key={visita.id}
            className="!bg-neutral-900 !rounded-lg !p-4 !border !border-neutral-700"
          >
            <p className="!text-sm !text-neutral-300">
              <span className="!font-medium">Data:</span> {visita.data} às {visita.hora}
            </p>
            <p className="!text-sm !text-neutral-300">
              <span className="!font-medium">Endereço:</span> {visita.endereco}
            </p>
            <p className="!text-sm">
              <span className="!font-medium">Status:</span>{" "}
              <span
                className={`!font-bold ${
                  visita.status === "Confirmada"
                    ? "!text-green-500"
                    : "!text-yellow-400"
                }`}
              >
                {visita.status}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
