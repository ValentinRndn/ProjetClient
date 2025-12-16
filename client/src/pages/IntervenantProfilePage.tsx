import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
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
      <div className="min-h-screen bg-[#ebf2fa]">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="bg-white rounded-2xl p-8 border border-[#1c2942]/10">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-32 h-32 bg-[#ebf2fa] rounded-2xl mx-auto md:mx-0"></div>
                <div className="flex-1 space-y-4">
                  <div className="h-8 bg-[#ebf2fa] rounded w-3/4"></div>
                  <div className="h-4 bg-[#ebf2fa] rounded w-1/2"></div>
                  <div className="h-24 bg-[#ebf2fa] rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !intervenant) {
    return (
      <div className="min-h-screen bg-[#ebf2fa]">
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
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Retour */}
        <Link
          to="/intervenants"
          className="inline-flex items-center gap-2 text-[#1c2942]/70 hover:text-[#1c2942] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux intervenants
        </Link>

        {/* Carte principale du profil */}
        <div className="bg-white rounded-2xl border border-[#1c2942]/10 overflow-hidden">
          {/* En-tête du profil */}
          <div className="p-6 md:p-8 border-b border-[#1c2942]/10">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              {/* Photo de profil */}
              <div className="shrink-0">
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt={`Photo de ${fullName}`}
                    className="w-28 h-28 rounded-2xl object-cover border-2 border-[#ebf2fa] shadow-sm"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-2xl bg-[#ebf2fa] flex items-center justify-center">
                    <User className="w-12 h-12 text-[#6d74b5]" />
                  </div>
                )}
              </div>

              {/* Informations principales */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start mb-3">
                  <h1 className="text-2xl md:text-3xl font-bold text-[#1c2942]">
                    {fullName}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#ebf2fa] text-[#6d74b5] rounded-lg text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Vérifié
                  </span>
                  {isEcole && (
                    <button
                      onClick={handleToggleFavorite}
                      disabled={isLoadingFavorite}
                      className={`p-2 rounded-lg transition-all ${
                        isFavorite
                          ? "bg-rose-100 text-rose-600 hover:bg-rose-200"
                          : "bg-[#ebf2fa] text-[#1c2942]/40 hover:bg-rose-50 hover:text-rose-500"
                      } ${isLoadingFavorite ? "opacity-50 cursor-not-allowed" : ""}`}
                      title={
                        isFavorite
                          ? "Retirer des favoris"
                          : "Ajouter aux favoris"
                      }
                    >
                      <Heart
                        className={`w-5 h-5 ${isFavorite ? "fill-rose-600" : ""}`}
                      />
                    </button>
                  )}
                </div>

                {/* Métadonnées */}
                <div className="flex flex-wrap gap-4 justify-center md:justify-start text-[#1c2942]/70 text-sm mb-4">
                  {intervenant.city && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#6d74b5]" />
                      {intervenant.city}
                    </span>
                  )}
                  {intervenant.yearsExperience && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#6d74b5]" />
                      {intervenant.yearsExperience} ans d'expérience
                    </span>
                  )}
                  {intervenant.siret && (
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-[#6d74b5]" />
                      SIRET: {intervenant.siret}
                    </span>
                  )}
                </div>

                {/* Expertises */}
                {intervenant.expertises && intervenant.expertises.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {intervenant.expertises.map((expertise, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-[#ebf2fa] text-[#6d74b5] rounded-full text-sm font-medium"
                      >
                        {expertise}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Corps du profil */}
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[#1c2942]/10">
            {/* Colonne principale */}
            <div className="lg:col-span-2 p-6 md:p-8 space-y-8">
              {/* Bio */}
              {intervenant.bio && (
                <div>
                  <h2 className="text-lg font-semibold text-[#1c2942] mb-3 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#6d74b5]" />
                    À propos
                  </h2>
                  <p className="text-[#1c2942]/70 whitespace-pre-line leading-relaxed">
                    {intervenant.bio}
                  </p>
                </div>
              )}

              {/* Disponibilités */}
              {((intervenant.availabilityModes && intervenant.availabilityModes.length > 0) || intervenant.availabilityLocation) && (
                <div>
                  <h2 className="text-lg font-semibold text-[#1c2942] mb-3 flex items-center gap-2">
                    <MapPinned className="w-5 h-5 text-[#6d74b5]" />
                    Disponibilités
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {intervenant.availabilityModes?.map((mode, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        {getAvailabilityModeLabel(mode)}
                        {mode === "presentiel" && intervenant.availabilityLocation && (
                          <span className="text-emerald-600">({intervenant.availabilityLocation})</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Diplômes */}
              {intervenant.diplomas && intervenant.diplomas.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-[#1c2942] mb-3 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-[#6d74b5]" />
                    Diplômes
                  </h2>
                  <div className="space-y-2">
                    {intervenant.diplomas.map((diploma, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 bg-[#ebf2fa]/50 rounded-xl"
                      >
                        <div className="w-8 h-8 bg-[#6d74b5]/10 rounded-lg flex items-center justify-center">
                          <Award className="w-4 h-4 text-[#6d74b5]" />
                        </div>
                        <span className="text-[#1c2942]">{diploma}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Expériences professionnelles */}
              {intervenant.experiences && intervenant.experiences.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-[#1c2942] mb-3 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-[#6d74b5]" />
                    Expériences professionnelles
                  </h2>
                  <div className="space-y-4">
                    {intervenant.experiences.map((exp, idx) => (
                      <div
                        key={idx}
                        className="relative pl-6 border-l-2 border-[#6d74b5]/30"
                      >
                        <div className="absolute -left-[9px] top-0 w-4 h-4 bg-[#6d74b5] rounded-full"></div>
                        <div className="bg-[#ebf2fa]/50 rounded-xl p-4">
                          <h3 className="font-semibold text-[#1c2942]">{exp.title}</h3>
                          <p className="text-[#6d74b5] text-sm font-medium">{exp.company}</p>
                          <p className="text-[#1c2942]/50 text-xs mt-1">
                            {exp.startDate} - {exp.endDate || "Présent"}
                          </p>
                          {exp.description && (
                            <p className="text-[#1c2942]/70 text-sm mt-2">{exp.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Logiciels maîtrisés */}
              {intervenant.softwares && intervenant.softwares.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-[#1c2942] mb-3 flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-[#6d74b5]" />
                    Logiciels maîtrisés
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {intervenant.softwares.map((software, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-[#1c2942]/5 text-[#1c2942] rounded-lg text-sm font-medium"
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
                  <h2 className="text-lg font-semibold text-[#1c2942] mb-3 flex items-center gap-2">
                    <Languages className="w-5 h-5 text-[#6d74b5]" />
                    Langues
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {intervenant.languages.map((lang, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-[#ebf2fa]/50 rounded-xl text-center"
                      >
                        <p className="font-medium text-[#1c2942]">{lang.language}</p>
                        <p className="text-xs text-[#6d74b5]">{getLanguageLevelLabel(lang.level)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Vidéo de présentation */}
              {intervenant.videoUrl && (
                <div>
                  <h2 className="text-lg font-semibold text-[#1c2942] mb-3 flex items-center gap-2">
                    <Play className="w-5 h-5 text-[#6d74b5]" />
                    Vidéo de présentation
                  </h2>
                  <div className="aspect-video rounded-xl overflow-hidden bg-[#ebf2fa]">
                    <iframe
                      src={getVideoEmbedUrl(intervenant.videoUrl)}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Vidéo de présentation"
                    />
                  </div>
                </div>
              )}

              {/* Message si pas de contenu principal */}
              {!intervenant.bio &&
               !intervenant.videoUrl &&
               (!intervenant.diplomas || intervenant.diplomas.length === 0) &&
               (!intervenant.experiences || intervenant.experiences.length === 0) &&
               (!intervenant.softwares || intervenant.softwares.length === 0) &&
               (!intervenant.languages || intervenant.languages.length === 0) &&
               (!intervenant.availabilityModes || intervenant.availabilityModes.length === 0) && (
                <p className="text-[#1c2942]/50 text-center py-8">
                  Aucune information supplémentaire disponible.
                </p>
              )}
            </div>

            {/* Sidebar */}
            <div className="p-6 md:p-8 space-y-6 bg-[#ebf2fa]/30">
              {/* Contact */}
              <div>
                <h2 className="text-lg font-semibold text-[#1c2942] mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#6d74b5]" />
                  Contact
                </h2>
                <div className="space-y-2">
                  {intervenant.user?.email && (
                    <a
                      href={`mailto:${intervenant.user.email}`}
                      className="flex items-center gap-3 p-3 bg-white rounded-xl hover:bg-[#ebf2fa] transition-colors border border-[#1c2942]/10"
                    >
                      <Mail className="w-4 h-4 text-[#6d74b5]" />
                      <span className="text-sm text-[#1c2942] truncate">
                        {intervenant.user.email}
                      </span>
                    </a>
                  )}
                  {intervenant.phone && (
                    <a
                      href={`tel:${intervenant.phone}`}
                      className="flex items-center gap-3 p-3 bg-white rounded-xl hover:bg-[#ebf2fa] transition-colors border border-[#1c2942]/10"
                    >
                      <Phone className="w-4 h-4 text-[#6d74b5]" />
                      <span className="text-sm text-[#1c2942]">
                        {intervenant.phone}
                      </span>
                    </a>
                  )}
                  {intervenant.linkedinUrl && (
                    <a
                      href={intervenant.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-white rounded-xl hover:bg-[#ebf2fa] transition-colors border border-[#1c2942]/10"
                    >
                      <Linkedin className="w-4 h-4 text-[#6d74b5]" />
                      <span className="text-sm text-[#1c2942]">LinkedIn</span>
                    </a>
                  )}
                  {intervenant.website && (
                    <a
                      href={intervenant.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-white rounded-xl hover:bg-[#ebf2fa] transition-colors border border-[#1c2942]/10"
                    >
                      <Globe className="w-4 h-4 text-[#6d74b5]" />
                      <span className="text-sm text-[#1c2942]">Site web</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Documents */}
              {(cvDocument || diplomes.length > 0) && (
                <div>
                  <h2 className="text-lg font-semibold text-[#1c2942] mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#6d74b5]" />
                    Documents
                  </h2>
                  <div className="space-y-2">
                    {cvDocument && (
                      <a
                        href={getDocumentDownloadUrl(
                          intervenant.id,
                          cvDocument.id
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-white rounded-xl hover:bg-[#ebf2fa] transition-colors border border-[#1c2942]/10 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-[#ebf2fa] rounded-lg flex items-center justify-center group-hover:bg-[#6d74b5]/20 transition-colors">
                            <FileText className="w-4 h-4 text-[#6d74b5]" />
                          </div>
                          <span className="text-sm font-medium text-[#1c2942]">
                            CV
                          </span>
                        </div>
                        <Download className="w-4 h-4 text-[#6d74b5]" />
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
                        className="flex items-center justify-between p-3 bg-white rounded-xl hover:bg-[#ebf2fa] transition-colors border border-[#1c2942]/10 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-[#ebf2fa] rounded-lg flex items-center justify-center group-hover:bg-[#6d74b5]/20 transition-colors">
                            <Award className="w-4 h-4 text-[#6d74b5]" />
                          </div>
                          <span className="text-sm font-medium text-[#1c2942] truncate max-w-[120px]">
                            {diplome.fileName}
                          </span>
                        </div>
                        <Download className="w-4 h-4 text-[#6d74b5]" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Contact */}
              {intervenant.user?.email && (
                <div className="bg-[#1c2942] rounded-xl p-5 text-white">
                  <h3 className="font-semibold mb-2">
                    Intéressé par ce profil ?
                  </h3>
                  <p className="text-white/70 text-sm mb-4">
                    Contactez cet intervenant pour discuter de vos besoins.
                  </p>
                  <a href={`mailto:${intervenant.user.email}`}>
                    <Button className="w-full bg-white text-[#1c2942] hover:bg-[#ebf2fa]">
                      <Mail className="w-4 h-4 mr-2" />
                      Envoyer un message
                    </Button>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
