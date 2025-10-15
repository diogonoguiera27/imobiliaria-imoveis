import { FC } from "react";
import PropertyCard, { PropertyCardProps } from "../CardProperties";

/**
 * Variante mobile do PropertyCard.
 * Remove as larguras fixas e faz o card preencher 95% do espaço disponível.
 * Ideal para uso em carrosséis e seções com containers responsivos.
 */
const PropertyCardMobileWrapper: FC<PropertyCardProps> = (props) => {
  return (
    <div className="!w-full !flex !justify-center">
      <div className=" !max-w-none [&>div]:!w-full [&>div]:!max-w-none">
        <PropertyCard {...props} />
      </div>
    </div>
  );
};

export default PropertyCardMobileWrapper;
