import { FC } from "react";
import PropertyCard, { PropertyCardProps } from "../CardProperties";

/**
 * 📱 Variante Mobile do PropertyCard (corrigida)
 * --------------------------------------------------
 * - Ocupa 95% da viewport real (não do container pai)
 * - Mantém centralização e padding automático
 * - Garante responsividade uniforme entre seções
 */
const PropertyCardMobileWrapper: FC<PropertyCardProps> = (props) => {
  return (
    <div className="!w-[95vw] !max-w-[95vw] !mx-auto">
      <PropertyCard {...props} size="mobile" />
    </div>
  );
};

export default PropertyCardMobileWrapper;
