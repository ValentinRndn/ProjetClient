import { motion } from "motion/react";

// Liste des écoles partenaires - Ligne 1
const partnersRow1 = [
  { name: "AMOS", logo: "/logos/logo_amos.png" },
  { name: "EDBS", logo: "/logos/logo_edbs.png" },
  { name: "EEMI", logo: "/logos/logo_eemi.png" },
  { name: "EFAB", logo: "/logos/logo_efab.png" },
  { name: "EFAP", logo: "/logos/logo_efap.png" },
  { name: "EFET", logo: "/logos/logo_efet.png" },
  { name: "ENHDE", logo: "/logos/logo_enhde.png" },
  { name: "ESIS", logo: "/logos/logo_esis.png" },
  { name: "ESUPCOM", logo: "/logos/logo_esupcom.png" },
  { name: "ICAN", logo: "/logos/logo_ican.png" },
];

// Liste des écoles partenaires - Ligne 2
const partnersRow2 = [
  { name: "ICART", logo: "/logos/logo_icart.png" },
  { name: "INSEEC", logo: "/logos/logo_inseec.png" },
  { name: "ISA", logo: "/logos/logo_isa.png" },
  { name: "ISFJ", logo: "/logos/logo_isfj.png" },
  { name: "MAESTRIS", logo: "/logos/logo_maestris.png" },
  { name: "MDS", logo: "/logos/logo_mds.png" },
  { name: "MODART", logo: "/logos/logo_modart.png" },
  { name: "NEXA", logo: "/logos/logo_nexa.png" },
  { name: "PPA", logo: "/logos/logo_ppa.png" },
  { name: "SCPA", logo: "/logos/logo_scpa.png" },
];

interface PartnerLogosSliderProps {
  title?: string;
  subtitle?: string;
}

export default function PartnerLogosSlider({
  title = "+ de 350 établissements",
  subtitle = "recrutent leurs intervenants avec Vizion Academy"
}: PartnerLogosSliderProps) {
  // Dupliquer les logos pour créer l'effet infini
  const row1Logos = [...partnersRow1, ...partnersRow1, ...partnersRow1];
  const row2Logos = [...partnersRow2, ...partnersRow2, ...partnersRow2];

  return (
    <section className="py-16 bg-[#1c2942] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            {title}
          </h2>
          <p className="text-lg text-white/80">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Slider Row 1 - Left to Right */}
      <div className="relative mb-6">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#1c2942] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#1c2942] to-transparent z-10" />

        <motion.div
          className="flex gap-8 items-center"
          animate={{
            x: [0, -1920],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {row1Logos.map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="flex-shrink-0 w-32 h-20 bg-white rounded-xl flex items-center justify-center p-4 shadow-lg"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
                onError={(e) => {
                  // Fallback to text if image doesn't load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = `<span class="text-xs font-semibold text-[#1c2942] text-center">${partner.name}</span>`;
                }}
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Slider Row 2 - Right to Left */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#1c2942] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#1c2942] to-transparent z-10" />

        <motion.div
          className="flex gap-8 items-center"
          animate={{
            x: [-1920, 0],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {row2Logos.map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="flex-shrink-0 w-32 h-20 bg-white rounded-xl flex items-center justify-center p-4 shadow-lg"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
                onError={(e) => {
                  // Fallback to text if image doesn't load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = `<span class="text-xs font-semibold text-[#1c2942] text-center">${partner.name}</span>`;
                }}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
