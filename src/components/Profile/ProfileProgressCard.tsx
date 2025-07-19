export default function ProfileProgressCard() {
  return (
    <div className="!bg-gradient-to-br !from-white !via-red-50 !to-red-100 !rounded-xl !p-6 !shadow-xl">
      <h3 className="!text-lg !font-semibold !mb-2 !text-gray-800">
        Complete seu perfil
      </h3>
      <p className="!text-sm !text-gray-600 !mb-4">
        Perfis completos atraem mais oportunidades!
      </p>

      {/* Barra de progresso */}
      <div className="!w-full !bg-red-100 !h-2 !rounded-full !mb-4">
        <div className="!bg-green-500 !h-2 !rounded-full !w-1/2" />
      </div>

      {/* Etapas do perfil */}
      <div className="!grid !grid-cols-2 md:!grid-cols-3 !gap-2 !text-sm">
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
            className="!bg-white !text-gray-800 !rounded-lg !py-2 !px-3 !text-left !border !border-red-200 hover:!border-purple-500 !transition"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
