import { DiscountedProperties,FeaturedCarousel,PopularProperties,} from "@/components/Home";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

 function HighlightSection() {
  const navigate = useNavigate();

  return (
    <section className="!p-4">
      <FeaturedCarousel />
      <PopularProperties />
      <DiscountedProperties />

      <div className="w-full !flex !justify-center !mt-12">
        <Button
          onClick={() => navigate("/imoveis-venda")}
          className="!bg-red-500 !text-white !font-semibold !px-6 !py-3 !rounded !shadow-md hover:!bg-red-700 transition-colors duration-200"
        >
          Ver todos os imóveis
        </Button>
      </div>
    </section>
  );
}

export default HighlightSection;