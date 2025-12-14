import Hero from "@/components/features/Hero";
import { motion } from "motion/react";
import PartnerLogosSlider from "@/components/features/PartnerLogosSlider";
import ThematiquesSection from "@/components/features/ThematiquesSection";
import WhyChooseUs from "@/components/features/WhyChooseUs";
import TestimonialsSection from "@/components/features/TestimonialsSection";

export default function HomePage() {
  return (
    <>
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
