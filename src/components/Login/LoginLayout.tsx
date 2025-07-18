import React from 'react'
import ImoFamilia from '@/assets/imofamilia.png';

interface LoginLayoutProps {
  children: React.ReactNode;
}

const LoginLayout: React.FC<LoginLayoutProps> = ({ children }) => {
  return (
     <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="!max-w-6xl w-full !bg-white !rounded-3xl !shadow-lg flex !overflow-hidden">

        
        <div className="!w-full lg:!w-1/2 flex">
          <img
            src={ImoFamilia}
            alt="Family holding key in front of house"
            className="w-full h-full object-cover"
          />
          
        </div>
        <div className="w-1/2 !bg-[#f33235]  !text-white !p-10 !lex !flex-col !justify-center">
          {children}
        </div>
      </div>
    </div>
  );
};

export default LoginLayout;