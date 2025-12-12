import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { getPublicIntervenantById, getDocumentDownloadUrl, type Intervenant, type Document } from "@/services/intervenants";
import { checkFavorite, toggleFavorite } from "@/services/favorites";
import { useAuth } from "@/hooks/useAuth";
import { PageContainer } from "@/components/ui/PageContainer";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { motion } from "motion/react";
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  FileText,
  Download,
  ArrowLeft,
  ExternalLink,
  Linkedin,
  Globe,
  Phone,
  Play,
  Award,
  CheckCircle,
  Heart,
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
          err instanceof Error ? err.message : "Erreur lors du chargement du profil";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIntervenant();
  }, [id]);

  // Vérifier si l'intervenant est dans les favoris
  useEffect(() => {
    const checkIfFavorite = async () => {
      if (isEcole && id) {
        try {
          const response = await checkFavorite(id);
          setIsFavorite(response.isFavorite);
        } catch (err) {
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

  const profileImageUrl = getProfileImageUrl();
  const cvDocument = getCVDocument();
  const diplomes = getDiplomes();
  const fullName =
    [intervenant?.firstName, intervenant?.lastName].filter(Boolean).join(" ") ||
    "Intervenant";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageContainer maxWidth="5xl" className="py-12">
          <div className="animate-pulse">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-40 h-40 bg-gray-200 rounded-full mx-auto md:mx-0"></div>
                <div className="flex-1 space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </div>
    );
  }

  if (error || !intervenant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageContainer maxWidth="5xl" className="py-12">
          <Alert type="error">{error || "Intervenant non trouvé"}</Alert>
          <div className="mt-6 text-center">
            <Link to="/intervenants">
              <Button variant="secondary">
                <ArrowLeft className="w-4 h-4" />
                Retour aux intervenants
              </Button>
            </Link>
          </div>
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-mesh relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        </div>

        <PageContainer maxWidth="5xl" className="relative z-10 py-12">
          <Link
            to="/intervenants"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux intervenants
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20"
          >
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              {/* Photo de profil */}
              <div className="shrink-0">
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt={`Photo de ${fullName}`}
                    className="w-40 h-40 rounded-full object-cover border-4 border-white/30 shadow-xl"
                  />
                ) : (
                  <div className="w-40 h-40 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/30">
                    <User className="w-20 h-20 text-white/60" />
                  </div>
                )}
              </div>

              {/* Informations principales */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-white">{fullName}</h1>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Vérifié
                  </span>
                  {isEcole && (
                    <button
                      onClick={handleToggleFavorite}
                      disabled={isLoadingFavorite}
                      className={`p-2 rounded-full transition-all ${
                        isFavorite
                          ? "bg-rose-500/30 text-rose-300 hover:bg-rose-500/40"
                          : "bg-white/10 text-white/60 hover:bg-rose-500/20 hover:text-rose-300"
                      } ${isLoadingFavorite ? "opacity-50 cursor-not-allowed" : ""}`}
                      title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                    >
                      <Heart className={`w-5 h-5 ${isFavorite ? "fill-rose-300" : ""}`} />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 justify-center md:justify-start text-white/80 mb-6">
                  {intervenant.city && (
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {intervenant.city}
                    </span>
                  )}
                  {intervenant.yearsExperience && (
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {intervenant.yearsExperience} ans d'expérience
                    </span>
                  )}
                  {intervenant.siret && (
                    <span className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      SIRET: {intervenant.siret}
                    </span>
                  )}
                </div>

                {/* Expertises */}
                {intervenant.expertises && intervenant.expertises.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-6">
                    {intervenant.expertises.map((expertise, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-amber-400/20 text-amber-200 rounded-full text-sm font-medium"
                      >
                        {expertise}
                      </span>
                    ))}
                  </div>
                )}

                {/* Liens externes */}
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  {intervenant.linkedinUrl && (
                    <a
                      href={intervenant.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </a>
                  )}
                  {intervenant.website && (
                    <a
                      href={intervenant.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      Site web
                    </a>
                  )}
                  {intervenant.user?.email && (
                    <a
                      href={`mailto:${intervenant.user.email}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      Contact
                    </a>
                  )}
                  {intervenant.phone && (
                    <a
                      href={`tel:${intervenant.phone}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      Téléphone
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </PageContainer>
      </div>

      <PageContainer maxWidth="5xl" className="py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio */}
            {intervenant.bio && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-600" />
                  À propos
                </h2>
                <p className="text-gray-600 whitespace-pre-line">{intervenant.bio}</p>
              </motion.div>
            )}

            {/* Vidéo de présentation */}
            {intervenant.videoUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Play className="w-5 h-5 text-indigo-600" />
                  Vidéo de présentation
                </h2>
                <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
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
            {/* Documents */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Documents
              </h2>

              <div className="space-y-3">
                {cvDocument && (
                  <a
                    href={getDocumentDownloadUrl(intervenant.id, cvDocument.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                        <FileText className="w-5 h-5 text-indigo-600" />
                      </div>
                      <span className="font-medium text-gray-900">CV</span>
                    </div>
                    <Download className="w-5 h-5 text-indigo-600" />
                  </a>
                )}

                {diplomes.length > 0 && (
                  <>
                    <div className="border-t border-gray-100 pt-3 mt-3">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        Diplômes ({diplomes.length})
                      </h3>
                    </div>
                    {diplomes.map((diplome) => (
                      <a
                        key={diplome.id}
                        href={getDocumentDownloadUrl(intervenant.id, diplome.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                            <Award className="w-5 h-5 text-amber-600" />
                          </div>
                          <span className="font-medium text-gray-900 truncate max-w-[150px]">
                            {diplome.fileName}
                          </span>
                        </div>
                        <Download className="w-5 h-5 text-amber-600" />
                      </a>
                    ))}
                  </>
                )}

                {!cvDocument && diplomes.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    Aucun document disponible
                  </p>
                )}
              </div>
            </motion.div>

            {/* CTA Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gradient-mesh rounded-2xl p-6 text-white"
            >
              <h3 className="text-lg font-bold mb-2">Intéressé par ce profil ?</h3>
              <p className="text-white/80 text-sm mb-4">
                Contactez cet intervenant pour discuter de vos besoins.
              </p>
              {intervenant.user?.email ? (
                <a href={`mailto:${intervenant.user.email}`}>
                  <Button className="w-full bg-white text-indigo-600 hover:bg-gray-100">
                    <Mail className="w-4 h-4" />
                    Envoyer un message
                  </Button>
                </a>
              ) : (
                <Link to="/contact">
                  <Button className="w-full bg-white text-indigo-600 hover:bg-gray-100">
                    <ExternalLink className="w-4 h-4" />
                    Nous contacter
                  </Button>
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
