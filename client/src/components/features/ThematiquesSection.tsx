import { motion } from "motion/react";
import { useNavigate } from "react-router";
import {
  Lightbulb,
  Cpu,
  Palette,
  Accessibility,
  Rocket,
  ArrowRight,
} from "lucide-react";

const thematiques = [
  {
    name: "Entrepreneuriat",
    icon: <Rocket className="w-8 h-8" />,
    description: "Créez, innovez et lancez vos projets",
  },
  {
    name: "Intelligence Artificielle",
    icon: <Cpu className="w-8 h-8" />,
    description: "Maîtrisez les outils IA du futur",
  },
  {
    name: "Innovation",
    icon: <Lightbulb className="w-8 h-8" />,
    description: "Pensez différemment, créez l'avenir",
  },
  {
    name: "Art & Créativité",
    icon: <Palette className="w-8 h-8" />,
    description: "Exprimez votre vision artistique",
  },
  {
    name: "Accessibilité",
    icon: <Accessibility className="w-8 h-8" />,
    description: "Construisez un numérique inclusif",
  },
];

export default function ThematiquesSection() {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-[#1c2942] mb-4"
          >
            Nos thématiques
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-[#1c2942]/70 max-w-2xl mx-auto"
          >
            Découvrez nos domaines d'expertise pour des formations innovantes et adaptées
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {thematiques.map((theme, index) => (
            <motion.button
              key={theme.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate("/challenges")}
              className="group relative p-6 rounded-2xl bg-[#ebf2fa] border border-[#6d74b5]/10 hover:border-[#6d74b5]/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-left"
            >
              <div className="text-[#6d74b5] mb-4">
                {theme.icon}
              </div>
              <h3 className="font-semibold text-[#1c2942] mb-2 group-hover:text-[#6d74b5] transition-colors">
                {theme.name}
              </h3>
              <p className="text-sm text-[#1c2942]/60 mb-4">
                {theme.description}
              </p>
              <div className="flex items-center text-sm font-medium text-[#6d74b5] opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Explorer</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
