export default function ProfileProgressCard() {
  return (
    <div className="!bg-neutral-800 !rounded-xl !p-6 !shadow-xl">
      <h3 className="!text-lg !font-semibold !mb-2">
        Complete seu perfil
      </h3>
      <p className="!text-sm !text-neutral-400 !mb-4">
        Perfis completos atraem mais oportunidades!
      </p>
      <div className="!w-full !bg-neutral-700 !h-2 !rounded-full !mb-4">
        <div className="!bg-green-500 !h-2 !rounded-full !w-1/2" />
      </div>
      <div className="!grid !grid-cols-2 md:!grid-cols-3 !gap-2 text-sm">
        {[
          "Informações básicas",
          "Foto do perfil",
          "Imagem de capa",
          "Links",
          "Sobre você",
          "Destaques",
          "Habilidades",
          "Momento de carreira",
        ].map((item, idx) => (
          <div
            key={idx}
            className="!bg-neutral-900 !rounded-lg !py-2 !px-3 !text-left !border !border-neutral-700 hover:!border-purple-500"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
