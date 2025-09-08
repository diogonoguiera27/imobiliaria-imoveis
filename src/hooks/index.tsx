import React, { ReactNode } from "react";
import { AuthProvider } from "./auth";
import { ContactProvider } from "./contact/ContactProvider";

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => (
  <AuthProvider>
    <ContactProvider>
    {children}
    </ContactProvider>
    </AuthProvider>
);

export default AppProvider;
