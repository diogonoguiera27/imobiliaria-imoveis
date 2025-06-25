import bannerImage from "@/assets/BannerInicial.png";


export const BannerInicial: React.FC = () => {
  return (
    <section className="w-screen !h-[600px] relative overflow-hidden p-0 m-0">
      <img
        src={bannerImage}
        alt="Banner Imobiliária"
        className="w-full h-full object-cover"
      />



    </section>
  );
};
