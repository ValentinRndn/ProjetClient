/**
 * Page de présentation de l'espace Écoles
 */
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/Button";
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
} from "lucide-react";

const avantages = [
  {
    icon: <Users className="w-6 h-6" />,
    title: "Réseau d'experts vérifiés",
    description: "Accédez à des intervenants qualifiés et sélectionnés pour leur expertise et leur pédagogie.",
  },
  {
    icon: <Trophy className="w-6 h-6" />,
    title: "Challenges clés en main",
    description: "Des projets pédagogiques innovants prêts à lancer pour dynamiser vos formations.",
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Gestion administrative simplifiée",
    description: "Nous prenons en charge la facturation des intervenants. 0 facture à gérer pour vous.",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Gain de temps",
    description: "Trouvez le bon intervenant en quelques clics grâce à notre moteur de recherche avancé.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Intervenants certifiés",
    description: "Tous nos experts sont vérifiés et leurs compétences validées par notre équipe.",
  },
  {
    icon: <HeadphonesIcon className="w-6 h-6" />,
    title: "Support dédié",
    description: "Une équipe à votre écoute pour vous accompagner tout au long de vos projets.",
  },
];

const etapes = [
  {
    numero: "01",
    titre: "Créez votre compte",
    description: "Inscrivez votre établissement en quelques minutes et accédez à la plateforme.",
  },
  {
    numero: "02",
    titre: "Recherchez un intervenant",
    description: "Parcourez notre réseau d'experts par domaine, disponibilité ou localisation.",
  },
  {
    numero: "03",
    titre: "Contactez et collaborez",
    description: "Échangez directement avec les intervenants et déclarez vos collaborations.",
  },
  {
    numero: "04",
    titre: "On s'occupe du reste",
    description: "Facturation, mandats, administratif... Nous gérons tout pour vous.",
  },
];

export default function EspaceEcolesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
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

      {/* Comment ça marche Section */}
      <section
        className="py-20"
        style={{ background: "linear-gradient(135deg, #ebf2fa 0%, #fdf1f7 100%)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 bg-white text-[#6d74b5] border border-[#6d74b5]/20"
            >
              <Target className="w-4 h-4" />
              Comment ça marche
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl font-bold text-[#1c2942] mb-4"
            >
              Démarrez en{" "}
              <span className="bg-gradient-to-r from-[#6d74b5] to-[#1c2942] bg-clip-text text-transparent">
                4 étapes simples
              </span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {etapes.map((etape, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-white/50 h-full">
                  <div className="text-4xl font-extrabold text-[#6d74b5]/20 mb-4">
                    {etape.numero}
                  </div>
                  <h3 className="text-lg font-bold text-[#1c2942] mb-2">{etape.titre}</h3>
                  <p className="text-[#1c2942]/70 text-sm">{etape.description}</p>
                </div>
                {index < etapes.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-[#6d74b5]/30" />
                  </div>
                )}
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
