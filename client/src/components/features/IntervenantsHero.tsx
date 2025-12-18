import { ArrowDown, Users } from "lucide-react";
import { motion } from "motion/react";

export function IntervenantsHero() {
  return (
    <section className="relative bg-[#1c2942] py-24 sm:py-32 overflow-hidden min-h-[70vh] flex items-center">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop')`,
        }}
      />
      {/* Color Overlay */}
      <div className="absolute inset-0 bg-[#1c2942]/80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-[#ebf2fa] text-[#1c2942] px-6 py-2.5 rounded-full text-sm font-bold mb-8 shadow-xl"
          >
            <Users className="w-4 h-4 text-[#6d74b5]" />
            Nos intervenants
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight text-white"
          >
            Trouvez des intervenants
            <br />
            <span className="text-[#ebf2fa]">
              compétents et passionnés
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-white/80 max-w-3xl mx-auto mb-12"
          >
            Tous nos intervenants sont des professionnels reconnus dans leur domaine,
            sélectionnés pour leur expertise et leur pédagogie.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center"
        >
          <a
            href="#liste-intervenants"
            className="group inline-flex items-center gap-3 bg-[#1c2942] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#1c2942]/90 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-[1.02]"
          >
            Voir les intervenants
            <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
          </a>
        </motion.div>
      </div>

    </section>
  );
}
