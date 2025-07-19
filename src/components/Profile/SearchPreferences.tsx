type SearchPreferencesProps = {
  type: string;
  cities: string[];
  priceRange: string;
  purpose: string;
};

export default function SearchPreferences({
  type,
  cities,
  priceRange,
  purpose,
}: SearchPreferencesProps) {
  return (
    <div className="!bg-gradient-to-br !from-white !via-red-50 !to-red-100 !rounded-xl !p-6 !shadow-xl">
      <h3 className="!text-lg !font-semibold !mb-4 !text-gray-800">Interesses de Busca</h3>
      <div className="!grid !grid-cols-1 sm:!grid-cols-2 !gap-4 !text-sm">
        <div className="!bg-white !rounded-lg !p-4 !border !border-red-100">
          <p className="!text-gray-500">Tipo</p>
          <p className="!font-semibold !text-gray-800">{type}</p>
        </div>

        <div className="!bg-white !rounded-lg !p-4 !border !border-red-100">
          <p className="!text-gray-500">Cidade de interesse</p>
          <p className="!font-semibold !text-gray-800">{cities.join(", ")}</p>
        </div>

        <div className="!bg-white !rounded-lg !p-4 !border !border-red-100">
          <p className="!text-gray-500">Faixa de preço</p>
          <p className="!font-semibold !text-gray-800">{priceRange}</p>
        </div>

        <div className="!bg-white !rounded-lg !p-4 !border !border-red-100">
          <p className="!text-gray-500">Finalidade</p>
          <p className="!font-semibold !text-gray-800">{purpose}</p>
        </div>
      </div>
    </div>
  );
}
