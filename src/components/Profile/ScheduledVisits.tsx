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
    <div className="!bg-gradient-to-br !from-white !via-red-50 !to-red-100 !rounded-xl !p-6 !shadow-xl">
      <h3 className="!text-lg !font-semibold !mb-4 !text-gray-800 flex items-center gap-2">
        <Calendar className="!text-red-500" /> Visitas Agendadas
      </h3>
      <div className="!space-y-4">
        {visits.map((visita) => (
          <div
            key={visita.id}
            className="!bg-white !rounded-lg !p-4 !border !border-red-100 !shadow-sm"
          >
            <p className="!text-sm !text-gray-700">
              <span className="!font-medium">Data:</span> {visita.data} às {visita.hora}
            </p>
            <p className="!text-sm !text-gray-700">
              <span className="!font-medium">Endereço:</span> {visita.endereco}
            </p>
            <p className="!text-sm">
              <span className="!font-medium text-gray-700">Status:</span>{" "}
              <span
                className={`!font-bold ${
                  visita.status === "Confirmada"
                    ? "!text-green-600"
                    : "!text-yellow-500"
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
