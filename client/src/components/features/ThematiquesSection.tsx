import { motion } from "motion/react";
import {
  Megaphone,
  Cpu,
  Leaf,
  MessageCircle,
  Rocket,
  Monitor,
  Lightbulb,
  Palette,
  Languages,
  PiggyBank,
} from "lucide-react";

const thematiques = [
  {
    name: "Marketing",
    icon: <Megaphone className="w-7 h-7" />,
  },
  {
    name: "Intelligences artificielles",
    icon: <Cpu className="w-7 h-7" />,
  },
  {
    name: "RSE",
    icon: <Leaf className="w-7 h-7" />,
  },
  {
    name: "Communication",
    icon: <MessageCircle className="w-7 h-7" />,
  },
  {
    name: "Entrepreneuriat",
    icon: <Rocket className="w-7 h-7" />,
  },
  {
    name: "Digital",
    icon: <Monitor className="w-7 h-7" />,
  },
  {
    name: "Créativité",
    icon: <Lightbulb className="w-7 h-7" />,
  },
  {
    name: "Art",
    icon: <Palette className="w-7 h-7" />,
  },
  {
    name: "Langues étrangères",
    icon: <Languages className="w-7 h-7" />,
  },
  {
    name: "Finance",
    icon: <PiggyBank className="w-7 h-7" />,
  },
];

export default function ThematiquesSection() {
  return (
    <section className="py-20 relative overflow-hidden" style={{ background: "linear-gradient(180deg, white 0%, #fdf1f7 50%, white 100%)" }}>
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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {thematiques.map((theme, index) => (
            <motion.div
              key={theme.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="p-5 rounded-2xl bg-[#ebf2fa] border border-[#6d74b5]/10 text-center"
            >
              <div className="text-[#6d74b5] mb-3 flex justify-center">
                {theme.icon}
              </div>
              <h3 className="font-semibold text-[#1c2942] text-sm">
                {theme.name}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
