/**
 * Page de présentation des Challenges
 * Couleurs spécifiques : #28303a (fond sombre), #ffffff (texte), #dbbacf (accent rose)
 */
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/Button";
import {
  Trophy,
  Users,
  Sparkles,
  ArrowRight,
  Target,
  Zap,
  Lightbulb,
  Play,
  GraduationCap,
  Rocket,
  HeadphonesIcon,
  Megaphone,
  Cpu,
  Leaf,
  MessageCircle,
  Monitor,
  Palette,
  Languages,
  PiggyBank,
  MapPin,
  Gift,
  CheckCircle,
  Video,
  Camera,
  Film,
  Building2,
} from "lucide-react";

const avantages = [
  {
    icon: <Lightbulb className="w-6 h-6" />,
    title: "Expériences immersives",
    description: "Des challenges engageants qui plongent les étudiants dans des situations concrètes et stimulantes.",
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Clé en main",
    description: "Tout est préparé : livrables, grilles d'évaluation, supports pédagogiques et planning.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Travail en équipe",
    description: "Des projets collaboratifs qui développent les soft skills et l'esprit d'équipe.",
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    title: "Thématiques actuelles",
    description: "IA, entrepreneuriat, RSE, digital... Des sujets en phase avec le monde professionnel.",
  },
  {
    icon: <Trophy className="w-6 h-6" />,
    title: "Compétition saine",
    description: "Des lots et récompenses pour motiver les étudiants et valoriser leurs efforts.",
  },
  {
    icon: <HeadphonesIcon className="w-6 h-6" />,
    title: "Accompagnement expert",
    description: "Des intervenants professionnels pour guider et coacher les participants.",
  },
];

const etapes = [
  {
    numero: "01",
    titre: "Choisissez votre challenge",
    description: "Parcourez notre catalogue et sélectionnez le challenge adapté à vos objectifs pédagogiques.",
  },
  {
    numero: "02",
    titre: "On planifie ensemble",
    description: "Nous adaptons le challenge à votre calendrier, vos effectifs et vos contraintes.",
  },
  {
    numero: "03",
    titre: "Lancement du challenge",
    description: "Vos étudiants vivent une expérience unique avec nos intervenants experts.",
  },
  {
    numero: "04",
    titre: "Évaluation et restitution",
    description: "Jurys, pitchs, remise des prix... Une conclusion mémorable pour les participants.",
  },
];

const thematiques = [
  { name: "Marketing", icon: <Megaphone className="w-6 h-6" /> },
  { name: "Intelligences artificielles", icon: <Cpu className="w-6 h-6" /> },
  { name: "RSE", icon: <Leaf className="w-6 h-6" /> },
  { name: "Communication", icon: <MessageCircle className="w-6 h-6" /> },
  { name: "Entrepreneuriat", icon: <Rocket className="w-6 h-6" /> },
  { name: "Digital", icon: <Monitor className="w-6 h-6" /> },
  { name: "Créativité", icon: <Lightbulb className="w-6 h-6" /> },
  { name: "Art", icon: <Palette className="w-6 h-6" /> },
  { name: "Langues étrangères", icon: <Languages className="w-6 h-6" /> },
  { name: "Finance", icon: <PiggyBank className="w-6 h-6" /> },
];

export default function ChallengesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section - Fond sombre #28303a */}
      <section
        className="relative py-20 sm:py-28 overflow-hidden"
        style={{ backgroundColor: "#28303a" }}
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop')`,
          }}
        />
        {/* Color Overlay */}
        <div className="absolute inset-0 bg-[#28303a]/85" />

        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#dbbacf]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#dbbacf]/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 bg-white/10 text-white border border-white/20">
                <Trophy className="w-4 h-4" />
                Challenges Pédagogiques
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
                Entre{" "}
                <span style={{ color: "#dbbacf" }}>
                  immersion
                </span>{" "}
                et pédagogie, il y a{" "}
                <span style={{ color: "#dbbacf" }}>
                  Vizion Academy
                </span>{" "}
                !
              </h1>

              <p className="text-lg sm:text-xl text-white/80 mb-8 leading-relaxed">
                Transformez l'apprentissage avec nos challenges immersifs clé en main.
                Des projets engageants sur des thématiques actuelles pour développer
                les compétences de vos étudiants.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => navigate("/tous-les-challenges")}
                  className="text-[#28303a] px-8 py-3"
                  style={{ backgroundColor: "#dbbacf" }}
                >
                  Voir tous les challenges
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

      {/* Section Vidéo */}
      <section
        className="py-20"
        style={{ backgroundColor: "#28303a" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 border"
              style={{ backgroundColor: "rgba(219, 186, 207, 0.1)", color: "#dbbacf", borderColor: "rgba(219, 186, 207, 0.3)" }}
            >
              <Play className="w-4 h-4" />
              Découvrez en vidéo
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
            >
              Nos challenges en{" "}
              <span style={{ color: "#dbbacf" }}>
                action
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-white/70 max-w-2xl mx-auto"
            >
              Découvrez comment nos challenges transforment l'expérience d'apprentissage
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ border: "2px solid rgba(219, 186, 207, 0.3)" }}>
              <div className="aspect-video">
                <iframe
                  src="https://www.youtube.com/embed/GQXFJCZ4W0s"
                  title="Vizion Academy - Challenges Pédagogiques"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Avantages Section */}
      <section
        className="py-20"
        style={{ backgroundColor: "#28303a" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 border"
              style={{ backgroundColor: "rgba(219, 186, 207, 0.1)", color: "#dbbacf", borderColor: "rgba(219, 186, 207, 0.3)" }}
            >
              <Sparkles className="w-4 h-4" />
              Nos avantages
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
            >
              Pourquoi choisir nos{" "}
              <span style={{ color: "#dbbacf" }}>
                challenges
              </span>{" "}
              ?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-white/70 max-w-2xl mx-auto"
            >
              Des expériences pédagogiques innovantes conçues pour engager vos étudiants
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
                className="rounded-2xl p-6 border hover:border-[#dbbacf]/50 transition-all"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", borderColor: "rgba(255, 255, 255, 0.1)" }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: "rgba(219, 186, 207, 0.2)", color: "#dbbacf" }}
                >
                  {avantage.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{avantage.title}</h3>
                <p className="text-white/70">{avantage.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Thématiques Section */}
      <section
        className="py-20"
        style={{ backgroundColor: "#28303a" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 border"
              style={{ backgroundColor: "rgba(219, 186, 207, 0.1)", color: "#dbbacf", borderColor: "rgba(219, 186, 207, 0.3)" }}
            >
              <GraduationCap className="w-4 h-4" />
              Nos thématiques
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
            >
              Des sujets en phase avec{" "}
              <span style={{ color: "#dbbacf" }}>
                le monde pro
              </span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {thematiques.map((theme, index) => (
              <motion.div
                key={theme.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="p-5 rounded-2xl text-center border transition-all hover:scale-105"
                style={{
                  backgroundColor: "rgba(219, 186, 207, 0.1)",
                  borderColor: "rgba(219, 186, 207, 0.3)"
                }}
              >
                <div className="mb-3 flex justify-center" style={{ color: "#dbbacf" }}>
                  {theme.icon}
                </div>
                <h3 className="font-semibold text-white text-sm">
                  {theme.name}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ça marche Section */}
      <section
        className="py-20"
        style={{ backgroundColor: "#28303a" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 border"
              style={{ backgroundColor: "rgba(219, 186, 207, 0.1)", color: "#dbbacf", borderColor: "rgba(219, 186, 207, 0.3)" }}
            >
              <Target className="w-4 h-4" />
              Comment ça marche
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
            >
              Lancez un challenge en{" "}
              <span style={{ color: "#dbbacf" }}>
                4 étapes
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
                <div
                  className="rounded-2xl p-6 h-full border"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", borderColor: "rgba(255, 255, 255, 0.1)" }}
                >
                  <div className="text-4xl font-extrabold mb-4" style={{ color: "rgba(219, 186, 207, 0.4)" }}>
                    {etape.numero}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{etape.titre}</h3>
                  <p className="text-white/70 text-sm">{etape.description}</p>
                </div>
                {index < etapes.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6" style={{ color: "rgba(219, 186, 207, 0.5)" }} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Chez toi ou chez moi */}
      <section
        className="py-20"
        style={{ backgroundColor: "#28303a" }}
      >
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
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop"
                  alt="Événement au H7"
                  className="w-full h-[400px] object-cover"
                />
              </div>
            </motion.div>

            {/* Contenu à droite */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 border"
                style={{ backgroundColor: "rgba(219, 186, 207, 0.1)", color: "#dbbacf", borderColor: "rgba(219, 186, 207, 0.3)" }}
              >
                <MapPin className="w-4 h-4" />
                Chez toi ou chez moi ?
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Qui dit nouvelle pédagogie dit{" "}
                <span style={{ color: "#dbbacf" }}>
                  nouveau cadre
                </span>{" "}
                !
              </h2>

              <p className="text-lg text-white/70 leading-relaxed">
                Venez au H7, lieu totem du digital et de l'événementiel sur Lyon pouvant accueillir jusqu'à 400 personnes !
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Lots, accessoires et sorties */}
      <section
        className="py-20"
        style={{ backgroundColor: "#28303a" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Contenu à gauche */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 border"
                style={{ backgroundColor: "rgba(219, 186, 207, 0.1)", color: "#dbbacf", borderColor: "rgba(219, 186, 207, 0.3)" }}
              >
                <Gift className="w-4 h-4" />
                Lots, accessoires et sorties !
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                VIZION ACADEMY fait en sorte que vos étudiants vivent une{" "}
                <span style={{ color: "#dbbacf" }}>
                  vraie expérience pédagogique
                </span>
              </h2>

              <p className="text-lg text-white/70 leading-relaxed">
                en fournissant des lots à gagner, des accessoires et même des excursions possibles dans des musées et bien plus encore !
              </p>
            </motion.div>

            {/* Image à droite */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2070&auto=format&fit=crop"
                  alt="Lots et récompenses"
                  className="w-full h-[400px] object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Vizion Challenge Manager */}
      <section
        className="py-20"
        style={{ backgroundColor: "#28303a" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 border"
              style={{ backgroundColor: "rgba(219, 186, 207, 0.1)", color: "#dbbacf", borderColor: "rgba(219, 186, 207, 0.3)" }}
            >
              <Monitor className="w-4 h-4" />
              Vizion Challenge Manager
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
            >
              Gérez l'intégralité de votre challenge sur{" "}
              <span style={{ color: "#dbbacf" }}>
                une seule plateforme
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-white/70 max-w-3xl mx-auto"
            >
              Un outil complet pour suivre et coordonner toutes les étapes du challenge en temps réel
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pour les étudiants */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl p-6 border"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", borderColor: "rgba(255, 255, 255, 0.1)" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: "rgba(139, 92, 246, 0.2)" }}
              >
                <Users className="w-6 h-6" style={{ color: "#a78bfa" }} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Pour les étudiants</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-white/70">
                  <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#dbbacf" }} />
                  <span>Visualisation en temps réel des rendus et projets</span>
                </li>
                <li className="flex items-start gap-2 text-white/70">
                  <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#dbbacf" }} />
                  <span>Accès aux informations de l'équipe</span>
                </li>
                <li className="flex items-start gap-2 text-white/70">
                  <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#dbbacf" }} />
                  <span>Consultation des consignes et ressources</span>
                </li>
                <li className="flex items-start gap-2 text-white/70">
                  <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#dbbacf" }} />
                  <span>Système de feedback intégré</span>
                </li>
              </ul>
            </motion.div>

            {/* Pour les intervenants */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl p-6 border"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", borderColor: "rgba(255, 255, 255, 0.1)" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: "rgba(219, 186, 207, 0.2)" }}
              >
                <GraduationCap className="w-6 h-6" style={{ color: "#dbbacf" }} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Pour les intervenants</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-white/70">
                  <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#dbbacf" }} />
                  <span>Accès à tout le contenu du challenge</span>
                </li>
                <li className="flex items-start gap-2 text-white/70">
                  <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#dbbacf" }} />
                  <span>Messagerie pour répondre aux questions</span>
                </li>
                <li className="flex items-start gap-2 text-white/70">
                  <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#dbbacf" }} />
                  <span>Publication d'annonces en temps réel</span>
                </li>
                <li className="flex items-start gap-2 text-white/70">
                  <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#dbbacf" }} />
                  <span>Suivi de la progression des équipes</span>
                </li>
              </ul>
            </motion.div>

            {/* Pour l'école */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl p-6 border"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", borderColor: "rgba(255, 255, 255, 0.1)" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: "rgba(52, 211, 153, 0.2)" }}
              >
                <Building2 className="w-6 h-6" style={{ color: "#34d399" }} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Pour l'école</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-white/70">
                  <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#dbbacf" }} />
                  <span>Récupération de tous les projets étudiants</span>
                </li>
                <li className="flex items-start gap-2 text-white/70">
                  <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#dbbacf" }} />
                  <span>Export des notes et évaluations</span>
                </li>
                <li className="flex items-start gap-2 text-white/70">
                  <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#dbbacf" }} />
                  <span>Accès aux documents de cadrage</span>
                </li>
                <li className="flex items-start gap-2 text-white/70">
                  <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#dbbacf" }} />
                  <span>Bibliothèque photos et vidéos du challenge</span>
                </li>
                <li className="flex items-start gap-2 text-white/70">
                  <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#dbbacf" }} />
                  <span>Compilation des feedbacks pour évaluation</span>
                </li>
              </ul>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center text-white/60 mt-12 text-lg"
          >
            Un outil intuitif pour une gestion optimale du challenge de A à Z
          </motion.p>
        </div>
      </section>

      {/* Section Option Premium - Captation vidéo */}
      <section
        className="py-20"
        style={{ backgroundColor: "#28303a" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Contenu à gauche */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 border"
                style={{ backgroundColor: "rgba(219, 186, 207, 0.15)", color: "#dbbacf", borderColor: "rgba(219, 186, 207, 0.4)" }}
              >
                <Camera className="w-4 h-4" />
                Option Premium
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Captation vidéo{" "}
                <span style={{ color: "#dbbacf" }}>professionnelle</span>
              </h2>

              <p className="text-lg text-white/80 mb-8 leading-relaxed">
                Immortalisez votre challenge avec une captation vidéo complète et professionnelle, incluant une vidéo de synthèse d'une minute pour vos communications.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "rgba(109, 116, 181, 0.3)" }}
                  >
                    <Video className="w-5 h-5" style={{ color: "#ebf2fa" }} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Captation intégrale</h4>
                    <p className="text-white/70">Tous les moments clés du challenge filmés en haute qualité</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "rgba(109, 116, 181, 0.3)" }}
                  >
                    <Film className="w-5 h-5" style={{ color: "#ebf2fa" }} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Vidéo de synthèse (1 min)</h4>
                    <p className="text-white/70">Un montage dynamique parfait pour vos réseaux sociaux et communications</p>
                  </div>
                </div>
              </div>

              <div
                className="inline-block rounded-2xl p-6 border"
                style={{ backgroundColor: "rgba(219, 186, 207, 0.1)", borderColor: "rgba(219, 186, 207, 0.3)" }}
              >
                <div className="text-4xl font-extrabold mb-1" style={{ color: "#dbbacf" }}>
                  800€ <span className="text-lg font-normal text-white/70">HT</span>
                </div>
                <p className="text-white/70">Option à ajouter à votre challenge</p>
              </div>
            </motion.div>

            {/* Image à droite */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2071&auto=format&fit=crop"
                  alt="Captation vidéo professionnelle"
                  className="w-full h-[400px] object-cover"
                />
                {/* Badge sur l'image */}
                <div
                  className="absolute bottom-6 left-6 flex items-center gap-3 px-4 py-2 rounded-full"
                  style={{ backgroundColor: "#dbbacf" }}
                >
                  <Camera className="w-5 h-5" style={{ color: "#1c2942" }} />
                  <div>
                    <p className="font-bold text-sm" style={{ color: "#1c2942" }}>Captation en direct</p>
                    <p className="text-xs" style={{ color: "#1c2942", opacity: 0.7 }}>Qualité professionnelle garantie</p>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div
                className="absolute -bottom-4 -right-4 w-24 h-24 rounded-xl -z-10"
                style={{ backgroundColor: "rgba(219, 186, 207, 0.2)" }}
              />
              <div
                className="absolute -top-4 -left-4 w-16 h-16 rounded-xl -z-10"
                style={{ backgroundColor: "rgba(109, 116, 181, 0.3)" }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20"
        style={{ backgroundColor: "#dbbacf" }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: "#28303a" }}
            >
              <Zap className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: "#28303a" }}>
              Prêt à dynamiser vos formations ?
            </h2>

            <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: "#28303a", opacity: 0.8 }}>
              Contactez-nous pour discuter de vos besoins et découvrir le challenge
              idéal pour vos étudiants.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/tous-les-challenges")}
                className="text-white px-8 py-3"
                style={{ backgroundColor: "#28303a" }}
              >
                Explorer les challenges
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={() => navigate("/contact")}
                variant="outline"
                className="px-8 py-3"
                style={{ borderColor: "#28303a", color: "#28303a" }}
              >
                Demander un devis
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
