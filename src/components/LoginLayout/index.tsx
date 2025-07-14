import React from 'react'
import ImoFamilia from '@/assets/imofamilia.png.png';

interface LoginLayoutProps {
  children: React.ReactNode;
}

const LoginLayout: React.FC<LoginLayoutProps> = ({ children }) => {
  return (
    <div className="!min-h-screen !bg-red-600 !flex !items-center !justify-center">
      <div className="!max-w-6xl w-full !bg-white !rounded-3xl !shadow-lg flex !overflow-hidden">

        {/* Ilustração lateral */}
        <div className="!w-full lg:!w-1/2 !h-full">
          <img
            src={ImoFamilia}
            alt="Family holding key in front of house"
            className="w-full h-full object-cover"
          />
          
        </div>
        {/* Conteúdo do formulário */}
        <div className="w-1/2 !bg-[#94141d] !text-white !p-10 !lex !flex-col !justify-center">
          {children}
        </div>
      </div>
    </div>
  );
};

export default LoginLayout;
