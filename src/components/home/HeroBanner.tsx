import bannerImage from "@/assets/BannerInicial.png";

const BannerInicial: React.FC = () => {
  return (
    <section
      className="
        w-screen relative overflow-hidden p-0 m-0
        /* 📱 Mobile: altura menor, sem margin-top extra */
        !h-[320px] sm:!h-[400px]
        /* 💻 Desktop: mantém altura e margem original */
        md:!h-[600px] md:!mt-4
      "
    >
      <img
        src={bannerImage}
        alt="Banner Imobiliária"
        className="w-full h-full object-cover"
      />
    </section>
  );
};

export default BannerInicial;
