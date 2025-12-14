import { Calendar, Receipt, Zap, ArrowDown, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export function IntervenantsHero() {
  return (
    <section className="relative bg-[#1c2942] py-24 sm:py-32 overflow-hidden min-h-[70vh] flex items-center">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop')`,
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
            <Sparkles className="w-4 h-4 text-[#6d74b5]" />
            100% GRATUIT
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

        {/* Key Points */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14 max-w-5xl mx-auto"
        >
          {[
            {
              icon: <Receipt className="w-6 h-6 text-white" />,
              title: "Facturation simplifiée",
              description: "Prise en charge complète de la facturation pour faciliter votre gestion administrative.",
            },
            {
              icon: <Zap className="w-6 h-6 text-white" />,
              title: "Remplacement express",
              description: "Système d'urgence pour remplacer vos intervenants en cas de besoin.",
            },
            {
              icon: <Calendar className="w-6 h-6 text-white" />,
              title: "Réservation rapide",
              description: "Réservez un créneau de rencontre en moins de 2 minutes.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-center w-14 h-14 bg-[#6d74b5] rounded-xl mb-4 mx-auto shadow-lg group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold text-center mb-2 text-[#1c2942]">{item.title}</h3>
              <p className="text-center text-sm text-[#1c2942]/70">
                {item.description}
              </p>
            </div>
          ))}
        </motion.div>

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
