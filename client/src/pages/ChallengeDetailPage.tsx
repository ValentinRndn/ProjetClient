import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import {
  Clock,
  Users,
  Trophy,
  Zap,
  Target,
  Lightbulb,
  CheckCircle,
  Sparkles,
  BookOpen,
  Star,
  GraduationCap,
  ArrowLeft,
  Mail,
  Play,
  Wrench,
  ListChecks,
  MapPin,
  Gift,
  Phone,
} from "lucide-react";
import { getPublicChallengeById, type Challenge } from "@/services/challenges";
import api from "@/lib/api";

// Helper pour extraire l'ID YouTube
function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11
    ? `https://www.youtube.com/embed/${match[2]}`
    : null;
}

// Composant Simulateur de Prix
function PriceSimulator({ challengeTitle }: { challengeTitle: string }) {
  const [formData, setFormData] = useState({
    nbStudents: "20",
    duration: "1",
    durationUnit: "days",
    hasLots: "non",
    lieu: "non",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.phone) {
      setSubmitError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await api.post("/contact", {
        name: "Demande de devis",
        email: formData.email,
        phone: formData.phone,
        subject: `Demande de devis - ${challengeTitle}`,
        message: `Demande de devis pour le challenge "${challengeTitle}"

Nombre d'étudiants: ${formData.nbStudents}
Durée: ${formData.duration} ${formData.durationUnit === "days" ? "journée(s)" : "demi-journée(s)"}
Lots à gagner: ${formData.hasLots === "oui" ? "Oui" : "Non"}
Lieu: ${formData.lieu === "oui" ? "Oui (H7 Lyon)" : "Non (dans vos locaux)"}

Contact: ${formData.email} / ${formData.phone}`,
      });
      setSubmitSuccess(true);
    } catch {
      setSubmitError("Erreur lors de l'envoi. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div
        className="rounded-2xl shadow-xl p-6 text-center"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", borderColor: "rgba(219, 186, 207, 0.2)", borderWidth: 1 }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: "rgba(219, 186, 207, 0.2)" }}
        >
          <CheckCircle className="w-8 h-8" style={{ color: "#dbbacf" }} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Demande envoyée !</h3>
        <p className="text-white/70">Nous vous recontacterons dans les plus brefs délais.</p>
      </div>
    );
  }

  const inputStyle = "w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/40 focus:ring-2 focus:ring-[#dbbacf] focus:border-transparent";
  const selectStyle = "w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/20 text-white focus:ring-2 focus:ring-[#dbbacf] focus:border-transparent appearance-none cursor-pointer";

  return (
    <div
      className="rounded-2xl shadow-xl p-6"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", borderColor: "rgba(219, 186, 207, 0.2)", borderWidth: 1 }}
    >
      <h3 className="text-xl font-bold text-white text-center mb-6">Simulateur de Prix</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre d'étudiants */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-white/80 mb-2">
            <Users className="w-4 h-4" style={{ color: "#dbbacf" }} />
            Nombre d'étudiants
          </label>
          <input
            type="number"
            value={formData.nbStudents}
            onChange={(e) => setFormData({ ...formData, nbStudents: e.target.value })}
            className={inputStyle}
            min="1"
          />
        </div>

        {/* Durée */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-white/80 mb-2">
            <Clock className="w-4 h-4" style={{ color: "#dbbacf" }} />
            Durée du challenge
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className={`${inputStyle} w-24`}
              min="1"
            />
            <select
              value={formData.durationUnit}
              onChange={(e) => setFormData({ ...formData, durationUnit: e.target.value })}
              className={`${selectStyle} flex-1`}
            >
              <option value="days" style={{ backgroundColor: "#28303a" }}>Journée(s)</option>
              <option value="half-days" style={{ backgroundColor: "#28303a" }}>Demi-journée(s)</option>
            </select>
          </div>
        </div>

        {/* Lots à gagner */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-white/80 mb-2">
            <Gift className="w-4 h-4" style={{ color: "#dbbacf" }} />
            Lots à gagner ?
          </label>
          <select
            value={formData.hasLots}
            onChange={(e) => setFormData({ ...formData, hasLots: e.target.value })}
            className={selectStyle}
          >
            <option value="non" style={{ backgroundColor: "#28303a" }}>Non</option>
            <option value="oui" style={{ backgroundColor: "#28303a" }}>Oui</option>
          </select>
        </div>

        {/* Lieu */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-white/80 mb-2">
            <MapPin className="w-4 h-4" style={{ color: "#dbbacf" }} />
            Lieux spécifiques ?
          </label>
          <select
            value={formData.lieu}
            onChange={(e) => setFormData({ ...formData, lieu: e.target.value })}
            className={selectStyle}
          >
            <option value="non" style={{ backgroundColor: "#28303a" }}>Non (dans vos locaux)</option>
            <option value="oui" style={{ backgroundColor: "#28303a" }}>Oui (H7 Lyon)</option>
          </select>
        </div>

        {/* Email */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-white/80 mb-2">
            <Mail className="w-4 h-4" style={{ color: "#dbbacf" }} />
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="votre@email.fr"
            className={inputStyle}
            required
          />
        </div>

        {/* Téléphone */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-white/80 mb-2">
            <Phone className="w-4 h-4" style={{ color: "#dbbacf" }} />
            Téléphone *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="06 12 34 56 78"
            className={inputStyle}
            required
          />
        </div>

        {submitError && (
          <p className="text-red-400 text-sm">{submitError}</p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-xl font-semibold"
          style={{ backgroundColor: "#dbbacf", color: "#28303a" }}
        >
          <Mail className="w-5 h-5 mr-2" />
          {isSubmitting ? "Envoi en cours..." : "Demander un devis"}
        </Button>
      </form>
    </div>
  );
}

export default function ChallengeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChallenge = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);
        const data = await getPublicChallengeById(id);
        setChallenge(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors du chargement du challenge";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallenge();
  }, [id]);

  const handleContact = () => {
    navigate("/contact", {
      state: {
        subject: `Demande de devis - Challenge: ${challenge?.title}`,
        message: `Bonjour,\n\nJe suis intéressé(e) par le challenge "${challenge?.title}" et souhaiterais obtenir un devis.\n\nMerci de me recontacter.`,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#28303a" }}>
        {/* Hero skeleton */}
        <div className="pt-8 pb-32">
          <div className="max-w-6xl mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-4 bg-white/20 rounded w-40 mb-8"></div>
              <div className="space-y-4">
                <div className="h-8 bg-white/20 rounded-full w-32"></div>
                <div className="h-10 bg-white/20 rounded w-3/4"></div>
                <div className="flex gap-3">
                  <div className="h-8 bg-white/20 rounded-full w-24"></div>
                  <div className="h-8 bg-white/20 rounded-full w-24"></div>
                  <div className="h-8 bg-white/20 rounded-full w-24"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 -mt-24">
          <div className="rounded-3xl p-8 animate-pulse" style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}>
            <div className="h-6 bg-white/10 rounded w-1/4 mb-4"></div>
            <div className="h-24 bg-white/10 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#28303a" }}>
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Alert type="error">{error || "Challenge non trouvé"}</Alert>
          <div className="mt-6 text-center">
            <Link to="/tous-les-challenges">
              <Button variant="secondary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux challenges
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const youtubeEmbedUrl = challenge.videoUrl ? getYouTubeEmbedUrl(challenge.videoUrl) : null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#28303a" }}>
      {/* Hero Section */}
      <div className="pt-8 pb-40 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          {/* Retour */}
          <Link
            to="/tous-les-challenges"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Retour aux challenges
          </Link>

          {/* Header du challenge avec image à droite */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Contenu texte à gauche */}
            <div>
              {/* Tags */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-4 flex flex-wrap gap-2"
              >
                {challenge.tags && challenge.tags.length > 0 ? (
                  challenge.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{ backgroundColor: "rgba(219, 186, 207, 0.3)", color: "#dbbacf" }}
                    >
                      #{tag}
                    </span>
                  ))
                ) : (
                  <span
                    className="px-4 py-2 rounded-full text-sm font-medium shadow-lg inline-flex items-center gap-2"
                    style={{ backgroundColor: "#dbbacf", color: "#28303a" }}
                  >
                    <Sparkles className="w-4 h-4" />
                    {challenge.thematique}
                  </span>
                )}
              </motion.div>

              {/* Titre */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight"
              >
                {challenge.title}
              </motion.h1>

              {/* Description courte */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="text-xl text-white/80 mb-6"
              >
                {challenge.description}
              </motion.p>

              {/* Bouton Contact */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Button
                  variant="primary"
                  className="py-3 px-8 rounded-xl shadow-lg text-[#28303a] font-semibold"
                  style={{ backgroundColor: "#dbbacf" }}
                  onClick={handleContact}
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Contactez nous
                </Button>
              </motion.div>
            </div>

            {/* Image mise en avant à droite */}
            {challenge.imageUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex justify-center lg:justify-end"
              >
                <img
                  src={challenge.imageUrl}
                  alt={challenge.title}
                  className="w-full max-w-md h-auto object-cover rounded-2xl shadow-2xl border-2"
                  style={{ borderColor: "rgba(219, 186, 207, 0.3)" }}
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-6xl mx-auto px-4 -mt-24 pb-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vidéo YouTube ou Image */}
            {youtubeEmbedUrl ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="rounded-2xl shadow-xl overflow-hidden"
                style={{ borderColor: "rgba(219, 186, 207, 0.2)", borderWidth: 1 }}
              >
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={youtubeEmbedUrl}
                    title={challenge.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </motion.div>
            ) : challenge.imageUrl ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="rounded-2xl shadow-xl overflow-hidden"
                style={{ borderColor: "rgba(219, 186, 207, 0.2)", borderWidth: 1 }}
              >
                <img
                  src={challenge.imageUrl}
                  alt={challenge.title}
                  className="w-full h-auto object-cover"
                />
              </motion.div>
            ) : null}

            {/* Pour conclure, c'est quoi ? */}
            {challenge.conclusion && challenge.conclusion.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="rounded-2xl shadow-xl p-6 md:p-8"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", borderColor: "rgba(219, 186, 207, 0.2)", borderWidth: 1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: "rgba(219, 186, 207, 0.2)" }}
                  >
                    <ListChecks className="w-5 h-5" style={{ color: "#dbbacf" }} />
                  </div>
                  <h2 className="text-xl font-bold text-white">Pour conclure, {challenge.title} c'est quoi ?</h2>
                </div>
                <div className="space-y-4">
                  {challenge.conclusion.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-4 rounded-xl"
                      style={{ backgroundColor: "rgba(219, 186, 207, 0.1)" }}
                    >
                      <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#dbbacf" }} />
                      <span className="text-white/80">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Horaires et public */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-2xl shadow-xl p-6"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", borderColor: "rgba(219, 186, 207, 0.2)", borderWidth: 1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: "rgba(219, 186, 207, 0.2)" }}
                >
                  <Clock className="w-5 h-5" style={{ color: "#dbbacf" }} />
                </div>
                <h2 className="text-lg font-bold text-white">Horaires et public</h2>
              </div>

              <div className="space-y-3 text-white/80 text-sm">
                {challenge.schedule && (
                  <p>• {challenge.schedule}</p>
                )}
                {!challenge.schedule && challenge.duration && (
                  <p>• Durée: {challenge.duration}</p>
                )}
                {challenge.targetAudience && (
                  <p>• Type de public: {challenge.targetAudience}</p>
                )}
                <p>• Adaptables selon les besoins.</p>
              </div>
            </motion.div>

            {/* Besoins */}
            {challenge.requirements && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="rounded-2xl shadow-xl p-6"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", borderColor: "rgba(219, 186, 207, 0.2)", borderWidth: 1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: "rgba(219, 186, 207, 0.2)" }}
                  >
                    <Wrench className="w-5 h-5" style={{ color: "#dbbacf" }} />
                  </div>
                  <h2 className="text-lg font-bold text-white">Besoins</h2>
                </div>
                <p className="text-white/80 text-sm">{challenge.requirements}</p>
              </motion.div>
            )}

            {/* Le côté Waouh ! */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="rounded-2xl shadow-xl p-6"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", borderColor: "rgba(219, 186, 207, 0.2)", borderWidth: 1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: "rgba(219, 186, 207, 0.2)" }}
                >
                  <Sparkles className="w-5 h-5" style={{ color: "#dbbacf" }} />
                </div>
                <h2 className="text-lg font-bold text-white">Le côté Wahoo !</h2>
              </div>
              <div className="space-y-3">
                {challenge.highlights && challenge.highlights.length > 0 ? (
                  challenge.highlights.map((highlight, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ backgroundColor: "rgba(219, 186, 207, 0.1)" }}
                    >
                      <Trophy className="w-5 h-5" style={{ color: "#dbbacf" }} />
                      <span className="text-sm text-white">{highlight}</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ backgroundColor: "rgba(219, 186, 207, 0.1)" }}
                    >
                      <Trophy className="w-5 h-5" style={{ color: "#dbbacf" }} />
                      <span className="text-sm text-white">Lots à gagner</span>
                    </div>
                    <div
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ backgroundColor: "rgba(219, 186, 207, 0.1)" }}
                    >
                      <Zap className="w-5 h-5" style={{ color: "#dbbacf" }} />
                      <span className="text-sm text-white">Expérience immersive</span>
                    </div>
                    <div
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ backgroundColor: "rgba(219, 186, 207, 0.1)" }}
                    >
                      <Users className="w-5 h-5" style={{ color: "#dbbacf" }} />
                      <span className="text-sm text-white">Jury professionnel</span>
                    </div>
                  </>
                )}
              </div>
            </motion.div>

            {/* Simulateur de Prix */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
            >
              <PriceSimulator challengeTitle={challenge.title} />
            </motion.div>

            {/* Retour */}
            <Link to="/tous-les-challenges" className="block">
              <Button
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/5 py-3 rounded-xl"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Voir tous les challenges
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
