import { FC } from "react";

const MyAccountOverview: FC = () => {
  return (
    <div className="!space-y-6">
      {/* Simulações */}
      <div className="!bg-gradient-to-br !from-white !via-red-50 !to-red-100 !rounded-xl !p-6 !shadow-xl !border !border-red-100">
        <h3 className="!text-lg !font-semibold !mb-2 !text-gray-800">Simulações</h3>
        <p className="!text-sm !text-gray-600">
          Você possui 2 simulações de financiamento em andamento.
        </p>
        <ul className="!mt-2 !text-sm !text-gray-800 !list-disc !ml-5">
          <li>Casa em Goiânia - <span className="!text-green-600">R$ 350 mil</span> - Entrada <span className="!text-green-600">R$ 70 mil</span></li>
          <li>Apartamento em Aparecida - <span className="!text-green-600">R$ 250 mil</span> - Entrada <span className="!text-green-600">R$ 50 mil</span></li>
        </ul>
      </div>

      {/* Dados pessoais */}
      <div className="!bg-gradient-to-br !from-white !via-red-50 !to-red-100 !rounded-xl !p-6 !shadow-xl !border !border-red-100">
        <h3 className="!text-lg !font-semibold !mb-2 !text-gray-800">Dados pessoais</h3>
        <p className="!text-sm !text-gray-700">
          Nome: <strong>Gilberto Bessa</strong><br />
          Cidade: <strong>São Paulo</strong><br />
          Telefone: <strong>(11) 98765-4321</strong>
        </p>
      </div>

      {/* Dados de acesso */}
      <div className="!bg-gradient-to-br !from-white !via-red-50 !to-red-100 !rounded-xl !p-6 !shadow-xl !border !border-red-100">
        <h3 className="!text-lg !font-semibold !mb-2 !text-gray-800">Dados de acesso</h3>
        <p className="!text-sm !text-gray-700">
          E-mail: <strong>gilberto@example.com</strong><br />
          Senha: <strong>********</strong>
        </p>
      </div>
    </div>
  );
};

export default MyAccountOverview;
