/**
 * Page de présentation de l'espace Écoles
 */
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/Button";
import { SEO } from "@/components/shared/SEO";
import {
  GraduationCap,
  Users,
  CheckCircle,
  FileText,
  Trophy,
  HeadphonesIcon,
  ArrowRight,
  Building2,
  Clock,
  Shield,
  Sparkles,
  Target,
  Zap,
  BookOpen,
  Mic,
  ClipboardCheck,
  MessageCircle,
} from "lucide-react";
import PartnerLogosSlider from "@/components/features/PartnerLogosSlider";
import ThematiquesSection from "@/components/features/ThematiquesSection";

const avantages = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Urgence intervizion",
    description: "Nous proposons une solution pour trouver un intervenant au dernier moment en cas d'imprévu.",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Réservation en ligne",
    description: "Rencontrez des intervenants en prenant un rendez-vous avec l'intervenant depuis son emploi du temps.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Des pages personnalisées",
    description: "Chaque intervenant dispose d'une page avec son profil, ses compétences, son expérience et ses disponibilités.",
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Un système de filtre",
    description: "Nous avons mis en place un système de filtre pour simplifier vos recherches d'intervenants.",
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Prise en charge de la facturation",
    description: "Nous traitons toutes les factures de nos intervenants afin de faciliter votre gestion administrative.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Des intervenants de confiance",
    description: "Nous avons sélectionné des professionnels passionnés afin de vous proposer des intervenants de qualité.",
  },
];

export default function EspaceEcolesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <SEO
        title="Espace Écoles - Trouvez vos intervenants experts"
        description="Grandes écoles, trouvez des intervenants experts qualifiés pour vos formations. Réservation en ligne, profils vérifiés, accompagnement personnalisé."
        keywords="intervenant école, formateur grande école, expert formation, intervenant professionnel, recrutement formateur"
        canonical="https://www.vizionacademy.fr/espace-ecoles"
      />
      {/* Hero Section */}
      <section
        className="relative py-20 sm:py-28 overflow-hidden"
        style={{ backgroundColor: "#1c2942" }}
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop')`,
          }}
        />
        {/* Color Overlay */}
        <div className="absolute inset-0 bg-[#1c2942]/80" />

        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#6d74b5]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#fdf1f7]/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 bg-white/10 text-white border border-white/20">
                <GraduationCap className="w-4 h-4" />
                Espace Écoles
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
                Trouvez les{" "}
                <span className="bg-gradient-to-r from-[#6d74b5] to-[#fdf1f7] bg-clip-text text-transparent">
                  meilleurs experts
                </span>{" "}
                pour vos formations
              </h1>

              <p className="text-lg sm:text-xl text-white/80 mb-8 leading-relaxed">
                Vizion Academy connecte votre établissement avec un réseau d'intervenants
                qualifiés. Simplifiez votre gestion et offrez des formations d'excellence à vos étudiants.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => navigate("/intervenants")}
                  className="bg-[#6d74b5] hover:bg-[#5a61a0] text-white px-8 py-3"
                >
                  Voir les intervenants
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  onClick={() => navigate("/contact")}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-3"
                >
                  Nous contacter
                </Button>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Partner Logos Slider */}
      <PartnerLogosSlider
        title="Ils nous font confiance"
        subtitle="Découvrez les établissements qui recrutent leurs intervenants avec Vizion Academy"
      />

      {/* Thématiques Section */}
      <ThematiquesSection />

      {/* Section Que cherchez-vous ? */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image à gauche */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop"
                  alt="Discussion en équipe"
                  className="w-full h-[500px] object-cover"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c2942]/40 to-transparent" />
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#6d74b5]/20 rounded-2xl -z-10" />
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#ebf2fa] rounded-2xl -z-10" />
            </motion.div>

            {/* Contenu à droite */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 bg-[#6d74b5]/10 text-[#6d74b5] border border-[#6d74b5]/20">
                <MessageCircle className="w-4 h-4" />
                Nos services
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-[#1c2942] mb-8">
                Que{" "}
                <span className="bg-gradient-to-r from-[#6d74b5] to-[#1c2942] bg-clip-text text-transparent">
                  cherchez-vous
                </span>{" "}
                ?
              </h2>

              <div className="space-y-6">
                {/* Modules de cours */}
                <div className="flex gap-4 p-5 bg-[#ebf2fa]/50 rounded-xl border border-[#ebf2fa] hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 bg-[#6d74b5] rounded-xl flex items-center justify-center text-white shrink-0">
                    <BookOpen className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1c2942] mb-1">Modules de cours</h3>
                    <p className="text-[#1c2942]/70">
                      Les intervenants ont construit des modules de cours adaptables à vos objectifs pédagogiques
                    </p>
                  </div>
                </div>

                {/* Conférences */}
                <div className="flex gap-4 p-5 bg-[#ebf2fa]/50 rounded-xl border border-[#ebf2fa] hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 bg-[#6d74b5] rounded-xl flex items-center justify-center text-white shrink-0">
                    <Mic className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1c2942] mb-1">Conférences</h3>
                    <p className="text-[#1c2942]/70">
                      Des formats conférences à réserver directement auprès des intervenants
                    </p>
                  </div>
                </div>

                {/* Jurys d'examens */}
                <div className="flex gap-4 p-5 bg-[#ebf2fa]/50 rounded-xl border border-[#ebf2fa] hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 bg-[#6d74b5] rounded-xl flex items-center justify-center text-white shrink-0">
                    <ClipboardCheck className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1c2942] mb-1">Jurys d'examens</h3>
                    <p className="text-[#1c2942]/70">
                      Des profils aux compétences variées pour noter au mieux vos étudiants
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Avantages Section */}
      <section
        className="py-20"
        style={{ background: "linear-gradient(180deg, white 0%, #ebf2fa 100%)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 bg-[#6d74b5]/10 text-[#6d74b5] border border-[#6d74b5]/20"
            >
              <Sparkles className="w-4 h-4" />
              Nos avantages
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl font-bold text-[#1c2942] mb-4"
            >
              Pourquoi choisir{" "}
              <span className="bg-gradient-to-r from-[#6d74b5] to-[#1c2942] bg-clip-text text-transparent">
                Vizion Academy
              </span>{" "}
              ?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-[#1c2942]/70 max-w-2xl mx-auto"
            >
              Une plateforme conçue pour simplifier la vie des établissements d'enseignement
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {avantages.map((avantage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-[#ebf2fa] hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-[#6d74b5]/10 rounded-xl flex items-center justify-center text-[#6d74b5] mb-4">
                  {avantage.icon}
                </div>
                <h3 className="text-lg font-bold text-[#1c2942] mb-2">{avantage.title}</h3>
                <p className="text-[#1c2942]/70">{avantage.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ backgroundColor: "#1c2942" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 bg-[#6d74b5] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Zap className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Prêt à transformer vos formations ?
            </h2>

            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Rejoignez les établissements qui font confiance à Vizion Academy pour
              trouver les meilleurs intervenants et proposer des expériences pédagogiques uniques.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/intervenants")}
                className="bg-[#6d74b5] hover:bg-[#5a61a0] text-white px-8 py-3"
              >
                Découvrir nos intervenants
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={() => navigate("/contact")}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-3"
              >
                Nous contacter
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
