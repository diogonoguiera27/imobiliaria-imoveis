import { FC } from "react";
import PropertyCard, { PropertyCardProps } from "../CardProperties";

/**
 * Wrapper que adapta o PropertyCard para grids responsivos.
 * Faz o card preencher 100% da célula, sem largura fixa.
 */
const PropertyCardGridWrapper: FC<PropertyCardProps> = (props) => {
  return (
    <div className="w-full h-full flex">
      <div className="w-full h-full [&>div]:!w-full [&>div]:!max-w-none">
        <PropertyCard {...props} />
      </div>
    </div>
  );
};

export default PropertyCardGridWrapper;
