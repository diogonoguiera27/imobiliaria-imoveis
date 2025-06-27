import { CarrosselDestaques } from "@/components/home/FeaturedCarousel";
import { ImoveisPopulares } from "@/components/home/PopularProperties";
import { ImoveisPromocao } from "@/components/home/DiscountedProperties";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function HighlightSection() {
  const navigate = useNavigate();

  return (
    <section className="!p-4">
      <CarrosselDestaques />
      <ImoveisPopulares />
      <ImoveisPromocao />

      <div className="w-full !flex !justify-center !mt-12">
        <Button
          onClick={() => navigate("/imoveis-venda")}
          className="!bg-red-500 !text-white !font-semibold !px-6 !py-3 !rounded !shadow-md hover:!bg-red-700 transition-colors duration-200"
        >
          Ver mais destaques
        </Button>
      </div>
    </section>
  );
}
