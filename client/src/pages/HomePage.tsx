import Hero from "@/components/features/Hero";
import { motion } from "motion/react";
import PartnerLogosSlider from "@/components/features/PartnerLogosSlider";
import ThematiquesSection from "@/components/features/ThematiquesSection";
import WhyChooseUs from "@/components/features/WhyChooseUs";
import TestimonialsSection from "@/components/features/TestimonialsSection";
import { SEO } from "@/components/shared/SEO";

export default function HomePage() {
  return (
    <>
      <SEO
        title="Accueil - Challenges immersifs et intervenants experts"
        description="Vizion Academy connecte les grandes écoles avec des intervenants experts et propose des challenges immersifs clé en main pour enrichir vos formations."
        keywords="challenges étudiants, intervenants écoles, formation grandes écoles, challenges immersifs, hackathon, business game"
        canonical="https://www.vizionacademy.fr/"
      />
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        <Hero />
      </motion.section>
      <PartnerLogosSlider />
      <ThematiquesSection />
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        <WhyChooseUs />
      </motion.section>
      <TestimonialsSection />
    </>
  );
}
