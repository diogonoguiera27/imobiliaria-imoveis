/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    // 🧭 Container global — centralizado e limitado
    container: {
      center: true, // Centraliza automaticamente
      padding: {
        DEFAULT: "1rem",
        sm: "1rem",
        md: "2rem",
        lg: "3rem",
        xl: "4rem",
        "2xl": "5rem",
      },
      // 📏 Larguras máximas para breakpoints do container
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        "3xl": "1920px", // 🔒 Limite final do layout (1920 px)
        "4xl": "2560px",
        "3k": "3000px",
      },
    },

    extend: {
      // ✨ Animações originais do seu projeto
      animation: {
        overlayShow: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        overlayHide: "overlayHide 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        contentShow: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        contentHide: "contentHide 150ms cubic-bezier(0.16, 1, 0.3, 1)",
      },

    
      screens: {
        "3xl": "1920px", // Monitores grandes (Full HD ultrawide)
        "4xl": "2560px", // 2K / 4K
        "3k": "3000px",  // 3K e maiores
      },

      // 🎯 Travar largura máxima global (para usar como max-w-3xl)
      maxWidth: {
        "3xl": "1920px",
      },
    },
  },
  plugins: [],
};
