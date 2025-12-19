/**
 * Page de présentation de l'espace Intervenants
 */
import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate, Link } from "react-router";
import { Button } from "@/components/ui/Button";
import { SEO } from "@/components/shared/SEO";
import {
  Users,
  CheckCircle,
  FileText,
  Trophy,
  ArrowRight,
  Clock,
  Sparkles,
  Star,
  Briefcase,
  Calendar,
  Building2,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Quote,
  Zap,
  Shield,
  Eye,
  UserCheck,
  FileCheck,
  Rocket,
  HelpCircle,
} from "lucide-react";
import PartnerLogosSlider from "@/components/features/PartnerLogosSlider";

const avantages = [
  {
    icon: <Calendar className="w-6 h-6" />,
    title: "Liberté totale",
    description: "Choisissez vos missions et gérez votre emploi du temps selon vos disponibilités.",
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "0 factures à faire",
    description: "Nous gérons toute la partie administrative et facturation pour vous.",
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: "Visibilité +35 écoles",
    description: "Accédez à un réseau de plus de 35 établissements partenaires.",
  },
  {
    icon: <Trophy className="w-6 h-6" />,
    title: "Animez des challenges",
    description: "Participez à des événements uniques et enrichissez votre expérience.",
  },
];

const etapes = [
  {
    number: "1",
    title: "Inscription",
    description: "Créez votre profil en quelques minutes et présentez vos compétences.",
    icon: <UserCheck className="w-6 h-6" />,
  },
  {
    number: "2",
    title: "Validation",
    description: "Notre équipe vérifie votre profil et vos qualifications.",
    icon: <Shield className="w-6 h-6" />,
  },
  {
    number: "3",
    title: "Publication",
    description: "Votre profil est visible par toutes les écoles partenaires.",
    icon: <Eye className="w-6 h-6" />,
  },
  {
    number: "4",
    title: "Missions",
    description: "Recevez des propositions et choisissez vos interventions.",
    icon: <Rocket className="w-6 h-6" />,
  },
];

const conditions = [
  {
    icon: <Building2 className="w-6 h-6" />,
    title: "Entité juridique",
    description: "Disposer d'une structure juridique (auto-entrepreneur, société, portage salarial).",
  },
  {
    icon: <Briefcase className="w-6 h-6" />,
    title: "Expertise métier",
    description: "Justifier d'une expérience professionnelle significative dans votre domaine.",
  },
  {
    icon: <FileCheck className="w-6 h-6" />,
    title: "Module conceptualisé",
    description: "Avoir préparé au moins un module de formation prêt à être dispensé.",
  },
];

const faqItems = [
  {
    question: "La commission s'applique-t-elle si je travaille déjà avec une école ?",
    answer: "Non, si vous avez renseigné le fait que vous travaillez déjà avec cette école avant votre inscription sur la plateforme, la commission ne s'applique pas pour vos collaborations avec cet établissement.",
  },
  {
    question: "Comment est gérée la facturation ?",
    answer: "Vizion Academy centralise l'intégralité de la facturation. Vous déclarez vos missions terminées, nous générons automatiquement votre facture et la transmettons à l'école. En moyenne, il faut compter un mois d'attente pour le règlement par l'école. Une fois le paiement reçu, nous vous versons immédiatement votre rémunération.",
  },
  {
    question: "Quels types de missions puis-je avoir ?",
    answer: "Cours magistraux, ateliers pratiques, conférences, challenges pédagogiques, accompagnement de projets étudiants, jurys de soutenance... Les formats sont variés selon vos compétences et préférences.",
  },
  {
    question: "Comment fixer mes tarifs ?",
    answer: "Vous fixez librement vos tarifs horaires ou journaliers selon votre expérience et expertise. Notre équipe peut vous conseiller sur les tarifs du marché selon votre domaine d'intervention.",
  },
];

const testimonials = [
  {
    name: "Marie L.",
    role: "Experte Marketing Digital",
    content: "Grâce à Vizion Academy, j'ai pu développer mon activité d'intervenante tout en gardant une flexibilité totale. La gestion administrative est un vrai plus !",
    rating: 5,
  },
  {
    name: "Thomas B.",
    role: "Consultant Data Science",
    content: "La plateforme m'a permis de toucher des écoles que je n'aurais jamais pu contacter seul. Les missions sont variées et enrichissantes.",
    rating: 5,
  },
  {
    name: "Sophie M.",
    role: "Directrice Artistique",
    content: "Je recommande Vizion Academy à tous les professionnels qui souhaitent transmettre leur savoir. L'équipe est réactive et professionnelle.",
    rating: 5,
  },
];

export default function EspaceIntervenantsPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen">
      <SEO
        title="Espace Intervenants - Devenez formateur expert"
        description="Rejoignez notre réseau d'intervenants experts. Missions flexibles, zéro administratif, visibilité auprès de +35 grandes écoles partenaires."
        keywords="devenir intervenant, formateur indépendant, mission formation, intervenant école, expert pédagogique"
        canonical="https://www.vizionacademy.fr/espace-intervenants"
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
            backgroundImage: `url('https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=2070&auto=format&fit=crop')`,
          }}
        />
        {/* Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, rgba(15, 25, 45, 0.82) 0%, rgba(28, 41, 66, 0.78) 100%)`,
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 bg-white/10 text-white border border-white/20">
                <Users className="w-4 h-4" />
                Espace Intervenants
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
                Rejoignez notre réseau d'experts,{" "}
                <span className="text-[#6d74b5]">
                  Devenez Vizionner
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-white/80 mb-8 leading-relaxed">
                Partagez votre expertise avec les étudiants de demain. Rejoignez un réseau de plus de 35 établissements et développez votre activité d'intervenant en toute liberté.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register/intervenant">
                  <Button
                    className="bg-[#6d74b5] hover:bg-[#5a61a0] text-white px-8 py-3"
                  >
                    Devenir Vizionner
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 px-8 py-3"
                  >
                    Nous contacter
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:flex justify-center"
            >
              <div className="bg-linear-to-br from-white/15 to-white/5 backdrop-blur-md rounded-3xl p-10 border border-white/20 shadow-2xl">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-[#6d74b5]/20 rounded-full mb-6">
                    <Star className="w-10 h-10 text-yellow-400 fill-yellow-400" />
                  </div>
                  <div className="text-8xl font-black text-white mb-1 tracking-tight">98%</div>
                  <div className="text-2xl font-semibold text-white/90 mb-6">de satisfaction</div>
                  <div className="flex justify-center gap-1.5 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-7 h-7 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <div className="bg-white/10 rounded-full px-4 py-2 inline-block">
                    <p className="text-white/70 text-sm">
                      Basé sur les retours de nos Vizionners
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partner Logos Slider */}
      <PartnerLogosSlider
        title="Ils recrutent nos Vizionners"
        subtitle="Découvrez les établissements partenaires qui font confiance à notre réseau d'experts"
      />

      {/* Pourquoi devenir Vizionner Section */}
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
              Pourquoi devenir{" "}
              <span className="text-[#6d74b5]">
                Vizionner
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
              Rejoignez une communauté d'experts et bénéficiez d'avantages exclusifs
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {avantages.map((avantage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-[#ebf2fa] hover:shadow-xl transition-shadow text-center"
              >
                <div className="w-14 h-14 bg-[#6d74b5]/10 rounded-xl flex items-center justify-center text-[#6d74b5] mb-4 mx-auto">
                  {avantage.icon}
                </div>
                <h3 className="text-lg font-bold text-[#1c2942] mb-2">{avantage.title}</h3>
                <p className="text-[#1c2942]/70 text-sm">{avantage.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comment rejoindre Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 bg-[#6d74b5]/10 text-[#6d74b5] border border-[#6d74b5]/20"
            >
              <Zap className="w-4 h-4" />
              Processus simple
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl font-bold text-[#1c2942] mb-4"
            >
              Comment rejoindre{" "}
              <span className="text-[#6d74b5]">
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
              4 étapes simples pour commencer à intervenir
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
            {etapes.map((etape, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative flex flex-col items-center h-full"
              >
                {/* Step number badge - centered above card */}
                <div className="relative z-20 mb-[-28px]">
                  <div className="w-14 h-14 bg-[#6d74b5] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {etape.number}
                  </div>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl pt-10 pb-6 px-6 shadow-lg border border-[#ebf2fa] hover:shadow-xl transition-shadow w-full text-center h-full flex flex-col">
                  <div className="w-12 h-12 bg-[#ebf2fa] rounded-xl flex items-center justify-center text-[#6d74b5] mb-4 mx-auto shrink-0">
                    {etape.icon}
                  </div>
                  <h3 className="text-lg font-bold text-[#1c2942] mb-2">{etape.title}</h3>
                  <p className="text-[#1c2942]/70 text-sm flex-1">{etape.description}</p>
                </div>

              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Conditions Section */}
      <section
        className="py-20"
        style={{ background: "linear-gradient(180deg, #ebf2fa 0%, white 100%)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 bg-[#6d74b5]/10 text-[#6d74b5] border border-[#6d74b5]/20"
            >
              <CheckCircle className="w-4 h-4" />
              Prérequis
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl font-bold text-[#1c2942] mb-4"
            >
              Conditions pour devenir{" "}
              <span className="text-[#6d74b5]">
                Vizionner
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-[#1c2942]/70 max-w-2xl mx-auto"
            >
              Quelques critères essentiels pour rejoindre notre réseau
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {conditions.map((condition, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-[#ebf2fa] text-center h-full flex flex-col"
              >
                <div className="w-14 h-14 bg-[#6d74b5]/10 rounded-xl flex items-center justify-center text-[#6d74b5] mb-4 mx-auto shrink-0">
                  {condition.icon}
                </div>
                <h3 className="text-lg font-bold text-[#1c2942] mb-2">{condition.title}</h3>
                <p className="text-[#1c2942]/70 text-sm flex-1">{condition.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Commission Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-16 max-w-4xl mx-auto"
          >
            <div className="bg-[#1c2942] rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                Commission de <span className="text-[#6d74b5]">20%</span>
              </h3>
              <p className="text-white/80 mb-6">
                Cette commission couvre la mise en relation, la gestion administrative, la facturation et le support continu. Vous n'avez plus qu'à vous concentrer sur ce que vous faites de mieux : transmettre votre expertise.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <span className="px-4 py-2 bg-white/10 rounded-full text-white">
                  ✓ Mise en relation
                </span>
                <span className="px-4 py-2 bg-white/10 rounded-full text-white">
                  ✓ Gestion administrative
                </span>
                <span className="px-4 py-2 bg-white/10 rounded-full text-white">
                  ✓ Facturation
                </span>
                <span className="px-4 py-2 bg-white/10 rounded-full text-white">
                  ✓ Support continu
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 bg-[#6d74b5]/10 text-[#6d74b5] border border-[#6d74b5]/20"
            >
              <GraduationCap className="w-4 h-4" />
              FAQ
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl font-bold text-[#1c2942] mb-4"
            >
              Questions fréquentes
            </motion.h2>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#ebf2fa]/50 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <span className="font-semibold text-[#1c2942]">{item.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-[#6d74b5]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#6d74b5]" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-[#1c2942]/70">{item.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Bouton contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center mt-10"
          >
            <Link to="/contact">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-[#6d74b5] text-[#6d74b5] hover:bg-[#6d74b5] hover:text-white"
              >
                <HelpCircle className="w-5 h-5" />
                Vous n'avez pas trouvé de réponse à votre question ?
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
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
              <Quote className="w-4 h-4" />
              Témoignages
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl font-bold text-[#1c2942] mb-4"
            >
              Ce que disent nos{" "}
              <span className="text-[#6d74b5]">
                Vizionners
              </span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-[#ebf2fa]"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-[#1c2942]/70 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-[#1c2942]">{testimonial.name}</p>
                  <p className="text-sm text-[#6d74b5]">{testimonial.role}</p>
                </div>
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
              <Rocket className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Prêt à devenir Vizionner ?
            </h2>

            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Rejoignez notre communauté d'experts et commencez à partager votre savoir avec les étudiants de demain.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register/intervenant">
                <Button
                  className="bg-[#6d74b5] hover:bg-[#5a61a0] text-white px-8 py-3"
                >
                  Créer mon profil
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-3"
                >
                  Nous contacter
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
