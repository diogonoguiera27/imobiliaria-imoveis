import { FC } from "react";

const MyAccountOverview: FC = () => {
  return (
    <div className="!space-y-6">
      {/* Simulações */}
      <div className="!bg-neutral-800 !rounded-xl !p-6 !shadow">
        <h3 className="!text-lg !font-semibold !mb-2 !text-white">Simulações</h3>
        <p className="!text-sm !text-neutral-400">
          Você possui 2 simulações de financiamento em andamento.
        </p>
        <ul className="!mt-2 !text-sm !text-neutral-300 !list-disc !ml-5">
          <li>Casa em Goiânia - R$ 350 mil - Entrada R$ 70 mil</li>
          <li>Apartamento em Aparecida - R$ 250 mil - Entrada R$ 50 mil</li>
        </ul>
      </div>

      {/* Dados pessoais */}
      <div className="!bg-neutral-800 !rounded-xl !p-6 !shadow">
        <h3 className="!text-lg !font-semibold !mb-2 !text-white">Dados pessoais</h3>
        <p className="!text-sm !text-neutral-400">
          Nome: Gilberto Bessa<br />
          Cidade: São Paulo<br />
          Telefone: (11) 98765-4321
        </p>
      </div>

      {/* Dados de acesso */}
      <div className="!bg-neutral-800 !rounded-xl !p-6 !shadow">
        <h3 className="!text-lg !font-semibold !mb-2 !text-white">Dados de acesso</h3>
        <p className="!text-sm !text-neutral-400">
          E-mail: gilberto@example.com<br />
          Senha: ********
        </p>
      </div>
    </div>
  );
};

export default MyAccountOverview;
