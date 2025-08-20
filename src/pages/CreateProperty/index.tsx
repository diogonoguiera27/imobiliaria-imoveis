
import { PropertyForm } from "@/components/PropertyForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


export default function CreatePropertyPage() {
  return (
    <div className="!max-w-6xl !mx-auto !p-6 !bg-neutral-100">
      <Card className="!bg-white !rounded-2xl !shadow-sm !border !border-neutral-200">
        <CardHeader className="!px-6 !py-4 !border-b !border-neutral-200">
          <CardTitle className="!text-xl !font-semibold">Cadastrar Imóvel</CardTitle>
          <p className="!text-sm !text-neutral-500 !mt-1">
            Preencha os dados do imóvel abaixo
          </p>
        </CardHeader>

        <CardContent className="!px-0 !py-0">
          <PropertyForm />
        </CardContent>
      </Card>
    </div>
  );
}
