

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
    <div className="!bg-neutral-800 !rounded-xl !p-6 !shadow-xl">
      <h3 className="!text-lg !font-semibold !mb-4">Interesses de Busca</h3>
      <div className="!grid !grid-cols-1 sm:!grid-cols-2 gap-4 text-sm">
        <div className="!bg-neutral-900 !rounded-lg !p-4">
          <p className="!text-neutral-400">Tipo</p>
          <p className="!font-semibold">{type}</p>
        </div>

        <div className="!bg-neutral-900 !rounded-lg !p-4">
          <p className="!text-neutral-400">Cidade de interesse</p>
          <p className="!font-semibold">{cities.join(", ")}</p>
        </div>

        <div className="!bg-neutral-900 !rounded-lg !p-4">
          <p className="!text-neutral-400">Faixa de preço</p>
          <p className="!font-semibold">{priceRange}</p>
        </div>

        <div className="!bg-neutral-900 !rounded-lg !p-4">
          <p className="!text-neutral-400">Finalidade</p>
          <p className="!font-semibold">{purpose}</p>
        </div>
      </div>
    </div>
  );
}
