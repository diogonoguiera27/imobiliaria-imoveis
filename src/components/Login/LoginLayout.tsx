import React from 'react'
import ImoFamilia from '@/assets/imofamilia.png';

interface LoginLayoutProps {
  children: React.ReactNode;
}

const LoginLayout: React.FC<LoginLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white !px-4">
      <div className="!max-w-6xl w-full !bg-white !rounded-3xl !shadow-lg flex flex-col md:flex-row !overflow-hidden">

        {/* Coluna da imagem → aparece já no tablet (md:768px) */}
        <div className="hidden md:!flex md:!w-1/2">
          <img
            src={ImoFamilia}
            alt="Family holding key in front of house"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Coluna do formulário */}
        <div className="!w-full md:!w-1/2 !bg-[#f33235] !text-white !p-10 !flex !flex-col !justify-center">
          <div className="w-full !max-w-md mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginLayout;
