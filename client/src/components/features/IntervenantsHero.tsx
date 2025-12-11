import { Calendar, Receipt, Zap, ArrowDown, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export function IntervenantsHero() {
  return (
    <section className="relative bg-gradient-mesh text-white py-24 sm:py-32 overflow-hidden min-h-[70vh] flex items-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-300 text-indigo-950 px-6 py-2.5 rounded-full text-sm font-bold mb-8 shadow-xl"
          >
            <Sparkles className="w-4 h-4" />
            100% GRATUIT
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight"
          >
            Trouvez des intervenants
            <br />
            <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
              compétents et passionnés
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-indigo-100/90 max-w-3xl mx-auto mb-12"
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
              icon: <Receipt className="w-6 h-6" />,
              title: "Facturation simplifiée",
              description: "Prise en charge complète de la facturation pour faciliter votre gestion administrative.",
            },
            {
              icon: <Zap className="w-6 h-6" />,
              title: "Remplacement express",
              description: "Système d'urgence pour remplacer vos intervenants en cas de besoin.",
            },
            {
              icon: <Calendar className="w-6 h-6" />,
              title: "Réservation rapide",
              description: "Réservez un créneau de rencontre en moins de 2 minutes.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="group relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300"
            >
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl mb-4 mx-auto shadow-lg group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold text-center mb-2">{item.title}</h3>
              <p className="text-center text-sm text-indigo-100/80">
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
            className="group inline-flex items-center gap-3 bg-white text-indigo-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-indigo-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-white/20 transform hover:scale-[1.02]"
          >
            Voir les intervenants
            <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
          </a>
        </motion.div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent" />
    </section>
  );
}
