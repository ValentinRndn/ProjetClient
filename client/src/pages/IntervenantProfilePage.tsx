import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { motion } from "motion/react";
import {
  getPublicIntervenantById,
  getDocumentDownloadUrl,
  type Intervenant,
  type Document,
} from "@/services/intervenants";
import { checkFavorite, toggleFavorite } from "@/services/favorites";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  FileText,
  Download,
  ArrowLeft,
  Linkedin,
  Globe,
  Phone,
  Play,
  Award,
  CheckCircle,
  Heart,
  GraduationCap,
  Monitor,
  Languages,
  MapPinned,
  Building2,
  Star,
  Sparkles,
} from "lucide-react";

export default function IntervenantProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [intervenant, setIntervenant] = useState<Intervenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);

  const isEcole = user?.role === "ECOLE";

  useEffect(() => {
    const fetchIntervenant = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);
        const data = await getPublicIntervenantById(id);
        setIntervenant(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors du chargement du profil";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIntervenant();
  }, [id]);

  useEffect(() => {
    const checkIfFavorite = async () => {
      if (isEcole && id) {
        try {
          const response = await checkFavorite(id);
          setIsFavorite(response.isFavorite);
        } catch {
          // Ignorer les erreurs silencieusement
        }
      }
    };
    checkIfFavorite();
  }, [isEcole, id]);

  const handleToggleFavorite = async () => {
    if (!id || isLoadingFavorite) return;

    try {
      setIsLoadingFavorite(true);
      const result = await toggleFavorite(id);
      setIsFavorite(result.isFavorite);
    } catch (err) {
      console.error("Erreur lors du toggle favori:", err);
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  const getProfileImageUrl = () => {
    if (!intervenant) return null;

    if (intervenant.documents && intervenant.id) {
      const documents = intervenant.documents as unknown as Document[];
      const profileDoc = documents.find((doc) => doc.type === "PROFILE_IMAGE");
      if (profileDoc) {
        return getDocumentDownloadUrl(intervenant.id, profileDoc.id);
      }
    }

    if (intervenant.profileImage) {
      if (
        intervenant.profileImage.startsWith("http://") ||
        intervenant.profileImage.startsWith("https://")
      ) {
        return intervenant.profileImage;
      }
    }

    return null;
  };

  const getCVDocument = () => {
    if (!intervenant?.documents) return null;
    const documents = intervenant.documents as unknown as Document[];
    return documents.find((doc) => doc.type === "CV") || null;
  };

  const getDiplomes = () => {
    if (!intervenant?.documents) return [];
    const documents = intervenant.documents as unknown as Document[];
    return documents.filter((doc) => doc.type === "DIPLOME");
  };

  const getVideoEmbedUrl = (url: string) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.includes("youtu.be")
        ? url.split("/").pop()
        : new URLSearchParams(url.split("?")[1]).get("v");
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("vimeo.com")) {
      const videoId = url.split("/").pop();
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  const getLanguageLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      debutant: "Débutant",
      intermediaire: "Intermédiaire",
      avance: "Avancé",
      natif: "Natif",
    };
    return labels[level] || level;
  };

  const getAvailabilityModeLabel = (mode: string) => {
    const labels: Record<string, string> = {
      presentiel: "Présentiel",
      hybride: "Hybride",
      distanciel: "Distanciel",
    };
    return labels[mode] || mode;
  };

  const profileImageUrl = getProfileImageUrl();
  const cvDocument = getCVDocument();
  const diplomes = getDiplomes();
  const fullName =
    [intervenant?.firstName, intervenant?.lastName].filter(Boolean).join(" ") ||
    "Intervenant";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1c2942] to-[#ebf2fa]">
        {/* Hero skeleton */}
        <div className="bg-[#1c2942] pt-8 pb-32">
          <div className="max-w-6xl mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-4 bg-white/20 rounded w-40 mb-8"></div>
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-40 h-40 bg-white/20 rounded-full"></div>
                <div className="flex-1 space-y-4">
                  <div className="h-10 bg-white/20 rounded w-3/4"></div>
                  <div className="h-4 bg-white/20 rounded w-1/2"></div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-white/20 rounded-full w-24"></div>
                    <div className="h-8 bg-white/20 rounded-full w-24"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 -mt-24">
          <div className="bg-white rounded-3xl p-8 animate-pulse">
            <div className="h-6 bg-[#ebf2fa] rounded w-1/4 mb-4"></div>
            <div className="h-24 bg-[#ebf2fa] rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !intervenant) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1c2942] to-[#ebf2fa]">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Alert type="error">{error || "Intervenant non trouvé"}</Alert>
          <div className="mt-6 text-center">
            <Link to="/intervenants">
              <Button variant="secondary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux intervenants
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ebf2fa]">
      {/* Hero Section avec fond coloré */}
      <div className="bg-gradient-to-br from-[#1c2942] via-[#2a3a5c] to-[#1c2942] pt-8 pb-40 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#6d74b5]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#6d74b5]/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          {/* Retour */}
          <Link
            to="/intervenants"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Retour aux intervenants
          </Link>

          {/* Header du profil */}
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Photo de profil avec bordure colorée */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#6d74b5] to-[#ebf2fa] rounded-full blur-lg opacity-50 scale-110"></div>
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt={`Photo de ${fullName}`}
                  className="relative w-40 h-40 rounded-full object-cover border-4 border-white shadow-2xl"
                />
              ) : (
                <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-[#6d74b5] to-[#1c2942] flex items-center justify-center border-4 border-white shadow-2xl">
                  <User className="w-16 h-16 text-white" />
                </div>
              )}
              {/* Badge vérifié */}
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-2 shadow-lg">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </motion.div>

            {/* Informations principales */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex-1 text-center md:text-left"
            >
              <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start mb-3">
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  {fullName}
                </h1>
                {isEcole && (
                  <button
                    onClick={handleToggleFavorite}
                    disabled={isLoadingFavorite}
                    className={`p-2.5 rounded-full transition-all ${
                      isFavorite
                        ? "bg-rose-500 text-white hover:bg-rose-600"
                        : "bg-white/20 text-white hover:bg-rose-500"
                    } ${isLoadingFavorite ? "opacity-50 cursor-not-allowed" : ""}`}
                    title={
                      isFavorite
                        ? "Retirer des favoris"
                        : "Ajouter aux favoris"
                    }
                  >
                    <Heart
                      className={`w-5 h-5 ${isFavorite ? "fill-white" : ""}`}
                    />
                  </button>
                )}
              </div>

              {/* Métadonnées */}
              <div className="flex flex-wrap gap-4 justify-center md:justify-start text-white/80 mb-6">
                {intervenant.city && (
                  <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-sm">
                    <MapPin className="w-4 h-4" />
                    {intervenant.city}
                  </span>
                )}
                {intervenant.yearsExperience && (
                  <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-sm">
                    <Calendar className="w-4 h-4" />
                    {intervenant.yearsExperience} ans d'expérience
                  </span>
                )}
                {intervenant.siret && (
                  <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-sm">
                    <Briefcase className="w-4 h-4" />
                    SIRET vérifié
                  </span>
                )}
              </div>

              {/* Expertises */}
              {intervenant.expertises && intervenant.expertises.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {intervenant.expertises.map((expertise, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-[#6d74b5] text-white rounded-full text-sm font-medium shadow-lg"
                    >
                      {expertise}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-6xl mx-auto px-4 -mt-24 pb-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            {intervenant.bio && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-[#ebf2fa]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#6d74b5] to-[#1c2942] rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-[#1c2942]">À propos</h2>
                </div>
                <p className="text-[#1c2942]/70 whitespace-pre-line leading-relaxed">
                  {intervenant.bio}
                </p>
              </motion.div>
            )}

            {/* Disponibilités */}
            {((intervenant.availabilityModes && intervenant.availabilityModes.length > 0) || intervenant.availabilityLocation) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-[#ebf2fa]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <MapPinned className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-[#1c2942]">Disponibilités</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {intervenant.availabilityModes?.map((mode, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium border border-emerald-200"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {getAvailabilityModeLabel(mode)}
                      {mode === "presentiel" && intervenant.availabilityLocation && (
                        <span className="text-emerald-600">({intervenant.availabilityLocation})</span>
                      )}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Expériences professionnelles */}
            {intervenant.experiences && intervenant.experiences.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-[#ebf2fa]"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#1c2942] to-[#2a3a5c] rounded-xl flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-[#1c2942]">Expériences professionnelles</h2>
                </div>
                <div className="space-y-4">
                  {intervenant.experiences.map((exp, idx) => (
                    <div
                      key={idx}
                      className="relative pl-8 border-l-2 border-[#6d74b5] pb-4 last:pb-0"
                    >
                      <div className="absolute -left-[9px] top-0 w-4 h-4 bg-[#6d74b5] rounded-full border-2 border-white"></div>
                      <div className="bg-gradient-to-r from-[#ebf2fa]/50 to-transparent rounded-xl p-4">
                        <h3 className="font-bold text-[#1c2942] text-lg">{exp.title}</h3>
                        <p className="text-[#6d74b5] font-semibold">{exp.company}</p>
                        <p className="text-[#1c2942]/50 text-sm mt-1">
                          {exp.startDate} - {exp.endDate || "Présent"}
                        </p>
                        {exp.description && (
                          <p className="text-[#1c2942]/70 text-sm mt-2">{exp.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Diplômes */}
            {intervenant.diplomas && intervenant.diplomas.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-[#ebf2fa]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-[#1c2942]">Formation</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {intervenant.diplomas.map((diploma, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200"
                    >
                      <Award className="w-5 h-5 text-amber-600 shrink-0" />
                      <span className="text-[#1c2942] font-medium">{diploma}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Compétences - Logiciels et Langues */}
            {((intervenant.softwares && intervenant.softwares.length > 0) ||
              (intervenant.languages && intervenant.languages.length > 0)) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-[#ebf2fa]"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#6d74b5] to-purple-600 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-[#1c2942]">Compétences</h2>
                </div>

                <div className="space-y-6">
                  {/* Logiciels */}
                  {intervenant.softwares && intervenant.softwares.length > 0 && (
                    <div>
                      <h3 className="flex items-center gap-2 text-sm font-semibold text-[#1c2942]/60 uppercase tracking-wide mb-3">
                        <Monitor className="w-4 h-4" />
                        Logiciels maîtrisés
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {intervenant.softwares.map((software, idx) => (
                          <span
                            key={idx}
                            className="px-4 py-2 bg-[#1c2942] text-white rounded-lg text-sm font-medium"
                          >
                            {software}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Langues */}
                  {intervenant.languages && intervenant.languages.length > 0 && (
                    <div>
                      <h3 className="flex items-center gap-2 text-sm font-semibold text-[#1c2942]/60 uppercase tracking-wide mb-3">
                        <Languages className="w-4 h-4" />
                        Langues parlées
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {intervenant.languages.map((lang, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-gradient-to-br from-[#ebf2fa] to-white rounded-xl border border-[#6d74b5]/20 text-center"
                          >
                            <p className="font-bold text-[#1c2942]">{lang.language}</p>
                            <p className="text-xs text-[#6d74b5] font-medium">{getLanguageLevelLabel(lang.level)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Vidéo de présentation */}
            {intervenant.videoUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-[#ebf2fa]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Play className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-[#1c2942]">Vidéo de présentation</h2>
                </div>
                <div className="aspect-video rounded-xl overflow-hidden bg-[#1c2942]">
                  <iframe
                    src={getVideoEmbedUrl(intervenant.videoUrl)}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Vidéo de présentation"
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-xl p-6 border border-[#ebf2fa]"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#6d74b5] to-[#1c2942] rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-bold text-[#1c2942]">Contact</h2>
              </div>

              <div className="space-y-3">
                {intervenant.user?.email && (
                  <a
                    href={`mailto:${intervenant.user.email}`}
                    className="flex items-center gap-3 p-3 bg-[#ebf2fa] rounded-xl hover:bg-[#6d74b5]/10 transition-colors group"
                  >
                    <Mail className="w-5 h-5 text-[#6d74b5]" />
                    <span className="text-sm text-[#1c2942] truncate group-hover:text-[#6d74b5] transition-colors">
                      {intervenant.user.email}
                    </span>
                  </a>
                )}
                {intervenant.phone && (
                  <a
                    href={`tel:${intervenant.phone}`}
                    className="flex items-center gap-3 p-3 bg-[#ebf2fa] rounded-xl hover:bg-[#6d74b5]/10 transition-colors group"
                  >
                    <Phone className="w-5 h-5 text-[#6d74b5]" />
                    <span className="text-sm text-[#1c2942] group-hover:text-[#6d74b5] transition-colors">
                      {intervenant.phone}
                    </span>
                  </a>
                )}
                {intervenant.linkedinUrl && (
                  <a
                    href={intervenant.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-[#ebf2fa] rounded-xl hover:bg-[#0077b5]/10 transition-colors group"
                  >
                    <Linkedin className="w-5 h-5 text-[#0077b5]" />
                    <span className="text-sm text-[#1c2942] group-hover:text-[#0077b5] transition-colors">LinkedIn</span>
                  </a>
                )}
                {intervenant.website && (
                  <a
                    href={intervenant.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-[#ebf2fa] rounded-xl hover:bg-[#6d74b5]/10 transition-colors group"
                  >
                    <Globe className="w-5 h-5 text-[#6d74b5]" />
                    <span className="text-sm text-[#1c2942] group-hover:text-[#6d74b5] transition-colors">Site web</span>
                  </a>
                )}
              </div>
            </motion.div>

            {/* Documents */}
            {(cvDocument || diplomes.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white rounded-2xl shadow-xl p-6 border border-[#ebf2fa]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-[#1c2942]">Documents</h2>
                </div>
                <div className="space-y-2">
                  {cvDocument && (
                    <a
                      href={getDocumentDownloadUrl(
                        intervenant.id,
                        cvDocument.id
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-[#ebf2fa] rounded-xl hover:bg-[#6d74b5]/10 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <FileText className="w-4 h-4 text-[#6d74b5]" />
                        </div>
                        <span className="text-sm font-medium text-[#1c2942]">
                          CV
                        </span>
                      </div>
                      <Download className="w-4 h-4 text-[#6d74b5] group-hover:scale-110 transition-transform" />
                    </a>
                  )}

                  {diplomes.map((diplome) => (
                    <a
                      key={diplome.id}
                      href={getDocumentDownloadUrl(
                        intervenant.id,
                        diplome.id
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-[#ebf2fa] rounded-xl hover:bg-[#6d74b5]/10 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <Award className="w-4 h-4 text-amber-500" />
                        </div>
                        <span className="text-sm font-medium text-[#1c2942] truncate max-w-[120px]">
                          {diplome.fileName}
                        </span>
                      </div>
                      <Download className="w-4 h-4 text-[#6d74b5] group-hover:scale-110 transition-transform" />
                    </a>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-gradient-to-br from-[#1c2942] to-[#2a3a5c] rounded-2xl shadow-xl p-6 text-white"
            >
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-amber-400" />
                <span className="font-bold">Profil vérifié</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {intervenant.yearsExperience && (
                  <div className="text-center p-3 bg-white/10 rounded-xl">
                    <p className="text-2xl font-bold">{intervenant.yearsExperience}</p>
                    <p className="text-xs text-white/70">ans d'exp.</p>
                  </div>
                )}
                {intervenant.expertises && (
                  <div className="text-center p-3 bg-white/10 rounded-xl">
                    <p className="text-2xl font-bold">{intervenant.expertises.length}</p>
                    <p className="text-xs text-white/70">expertises</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

    </div>
  );
}
