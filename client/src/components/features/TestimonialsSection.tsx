import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Marie Dupont",
    role: "Directrice des Programmes",
    school: "INSEEC Business School",
    logo: "/logos/logo_inseec.png",
    content:
      "Vizion Academy a transformé notre approche pédagogique. Les intervenants sont d'une qualité exceptionnelle et parfaitement adaptés à nos besoins. Le processus de mise en relation est simple et efficace.",
    rating: 5,
  },
  {
    id: 2,
    name: "Pierre Martin",
    role: "Responsable Pédagogique",
    school: "EFAP",
    logo: "/logos/logo_efap.png",
    content:
      "Nous collaborons avec Vizion Academy depuis 2 ans maintenant. Leur réseau d'experts nous permet d'offrir des formations de pointe à nos étudiants. Un partenaire de confiance.",
    rating: 5,
  },
  {
    id: 3,
    name: "Sophie Laurent",
    role: "Directrice Académique",
    school: "ICAN",
    logo: "/logos/logo_ican.png",
    content:
      "Les challenges pédagogiques proposés par Vizion Academy sont innovants et engageants. Nos étudiants adorent ! La gestion administrative simplifiée est un vrai plus.",
    rating: 5,
  },
  {
    id: 4,
    name: "Thomas Bernard",
    role: "Responsable Formation",
    school: "MAESTRIS",
    logo: "/logos/logo_maestris.png",
    content:
      "Une plateforme intuitive et un accompagnement de qualité. Vizion Academy comprend vraiment les enjeux de l'enseignement supérieur.",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-20 bg-[#ebf2fa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 bg-white text-[#6d74b5] border border-[#6d74b5]/20">
            <span className="w-1.5 h-1.5 bg-[#6d74b5] rounded-full" />
            Témoignages
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-[#1c2942]">
            Ce que nos partenaires{" "}
            <span className="bg-gradient-to-r from-[#6d74b5] to-[#1c2942] bg-clip-text text-transparent">
              disent de nous
            </span>
          </h2>
          <p className="text-[#1c2942]/70 text-lg sm:text-xl max-w-2xl mx-auto">
            Découvrez les retours de nos écoles partenaires sur leur expérience avec Vizion Academy
          </p>
        </div>

        {/* Testimonial Card */}
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white rounded-3xl shadow-xl p-8 md:p-12">
            {/* Quote Icon */}
            <div className="absolute -top-6 left-8 w-12 h-12 bg-[#6d74b5] rounded-full flex items-center justify-center shadow-lg">
              <Quote className="w-6 h-6 text-white" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="pt-4"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(currentTestimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                {/* Content */}
                <blockquote className="text-lg md:text-xl text-[#1c2942]/80 leading-relaxed mb-8">
                  "{currentTestimonial.content}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#ebf2fa] rounded-xl flex items-center justify-center p-2">
                      <img
                        src={currentTestimonial.logo}
                        alt={currentTestimonial.school}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = `<span class="text-xs font-bold text-[#1c2942]">${currentTestimonial.school}</span>`;
                        }}
                      />
                    </div>
                    <div>
                      <p className="font-bold text-[#1c2942]">{currentTestimonial.name}</p>
                      <p className="text-sm text-[#1c2942]/60">{currentTestimonial.role}</p>
                      <p className="text-sm font-medium text-[#6d74b5]">{currentTestimonial.school}</p>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex gap-2">
                    <button
                      onClick={prevTestimonial}
                      className="w-10 h-10 rounded-full border border-[#1c2942]/20 flex items-center justify-center text-[#1c2942] hover:bg-[#1c2942] hover:text-white transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextTestimonial}
                      className="w-10 h-10 rounded-full border border-[#1c2942]/20 flex items-center justify-center text-[#1c2942] hover:bg-[#1c2942] hover:text-white transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-[#6d74b5] w-6"
                      : "bg-[#1c2942]/20 hover:bg-[#1c2942]/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
          {[
            { value: "98%", label: "Taux de satisfaction" },
            { value: "350+", label: "Écoles partenaires" },
            { value: "5000+", label: "Étudiants formés" },
            { value: "4.8/5", label: "Note moyenne" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#6d74b5] to-[#1c2942] bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="text-sm text-[#1c2942]/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
