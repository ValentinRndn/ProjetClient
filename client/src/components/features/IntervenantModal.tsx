/**
 * Modal pour afficher les détails d'un intervenant
 */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import {
  X,
  User,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  FileText,
  Download,
  Linkedin,
  Globe,
  Phone,
  Play,
  Award,
  CheckCircle,
  Heart,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  type Intervenant,
  type Document,
  getDocumentDownloadUrl,
} from "@/services/intervenants";
import { checkFavorite, toggleFavorite } from "@/services/favorites";
import { useAuth } from "@/hooks/useAuth";

interface IntervenantModalProps {
  intervenant: Intervenant | null;
  isOpen: boolean;
  onClose: () => void;
}

export function IntervenantModal({
  intervenant,
  isOpen,
  onClose,
}: IntervenantModalProps) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);

  const isEcole = user?.role === "ECOLE";

  // Vérifier si l'intervenant est dans les favoris
  useEffect(() => {
    const checkIfFavorite = async () => {
      if (isEcole && intervenant?.id) {
        try {
          const response = await checkFavorite(intervenant.id);
          setIsFavorite(response.isFavorite);
        } catch {
          // Ignorer les erreurs
        }
      }
    };
    if (isOpen && intervenant) {
      checkIfFavorite();
    }
  }, [isEcole, intervenant?.id, isOpen]);

  // Fermer avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleToggleFavorite = async () => {
    if (!intervenant?.id || isLoadingFavorite) return;

    try {
      setIsLoadingFavorite(true);
      const result = await toggleFavorite(intervenant.id);
      setIsFavorite(result.isFavorite);
    } catch (err) {
      console.error("Erreur lors du toggle favori:", err);
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  if (!intervenant) return null;

  const getProfileImageUrl = () => {
    if (intervenant.documents && intervenant.id) {
      const documents = intervenant.documents as unknown as Document[];
      const profileDoc = documents.find((doc) => doc.type === "PROFILE_IMAGE");
      if (profileDoc) {
        return getDocumentDownloadUrl(intervenant.id, profileDoc.id);
      }
    }
    if (intervenant.profileImage?.startsWith("http")) {
      return intervenant.profileImage;
    }
    return null;
  };

  const getCVDocument = () => {
    if (!intervenant.documents) return null;
    const documents = intervenant.documents as unknown as Document[];
    return documents.find((doc) => doc.type === "CV") || null;
  };

  const getDiplomes = () => {
    if (!intervenant.documents) return [];
    const documents = intervenant.documents as unknown as Document[];
    return documents.filter((doc) => doc.type === "DIPLOME");
  };

  const profileImageUrl = getProfileImageUrl();
  const cvDocument = getCVDocument();
  const diplomes = getDiplomes();
  const fullName =
    [intervenant.firstName, intervenant.lastName].filter(Boolean).join(" ") ||
    intervenant.user?.name ||
    "Intervenant";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-10 lg:inset-20 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-mesh relative p-6 md:p-8">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                {/* Photo */}
                <div className="shrink-0">
                  {profileImageUrl ? (
                    <img
                      src={profileImageUrl}
                      alt={fullName}
                      className="w-28 h-28 rounded-full object-cover border-4 border-white/30 shadow-xl"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/30">
                      <User className="w-14 h-14 text-white/60" />
                    </div>
                  )}
                </div>

                {/* Infos */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center gap-3 justify-center md:justify-start mb-2 flex-wrap">
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                      {fullName}
                    </h2>
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
                            ? "bg-rose-500/30 text-rose-300"
                            : "bg-white/10 text-white/60 hover:bg-rose-500/20 hover:text-rose-300"
                        }`}
                      >
                        <Heart
                          className={`w-5 h-5 ${isFavorite ? "fill-rose-300" : ""}`}
                        />
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 justify-center md:justify-start text-white/80 mb-4">
                    {intervenant.city && (
                      <span className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4" />
                        {intervenant.city}
                      </span>
                    )}
                    {intervenant.yearsExperience && (
                      <span className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4" />
                        {intervenant.yearsExperience} ans d'exp.
                      </span>
                    )}
                    {intervenant.siret && (
                      <span className="flex items-center gap-2 text-sm">
                        <Briefcase className="w-4 h-4" />
                        SIRET vérifié
                      </span>
                    )}
                  </div>

                  {/* Expertises */}
                  {intervenant.expertises && intervenant.expertises.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      {intervenant.expertises.map((exp, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-amber-400/20 text-amber-200 rounded-full text-sm font-medium"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Colonne principale */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Bio */}
                  {intervenant.bio && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <User className="w-5 h-5 text-indigo-600" />
                        À propos
                      </h3>
                      <p className="text-gray-600 whitespace-pre-line">
                        {intervenant.bio}
                      </p>
                    </div>
                  )}

                  {/* Vidéo */}
                  {intervenant.videoUrl && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Play className="w-5 h-5 text-indigo-600" />
                        Vidéo de présentation
                      </h3>
                      <div className="aspect-video rounded-xl overflow-hidden bg-gray-200">
                        <iframe
                          src={
                            intervenant.videoUrl.includes("youtube")
                              ? `https://www.youtube.com/embed/${
                                  intervenant.videoUrl.split("v=")[1]?.split("&")[0] ||
                                  intervenant.videoUrl.split("/").pop()
                                }`
                              : intervenant.videoUrl
                          }
                          className="w-full h-full"
                          allowFullScreen
                          title="Vidéo de présentation"
                        />
                      </div>
                    </div>
                  )}

                  {/* Liens */}
                  <div className="flex flex-wrap gap-3">
                    {intervenant.linkedinUrl && (
                      <a
                        href={intervenant.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
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
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                        Site web
                      </a>
                    )}
                    {intervenant.phone && (
                      <a
                        href={`tel:${intervenant.phone}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        {intervenant.phone}
                      </a>
                    )}
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Documents */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-indigo-600" />
                      Documents
                    </h3>

                    <div className="space-y-3">
                      {cvDocument && (
                        <a
                          href={getDocumentDownloadUrl(intervenant.id, cvDocument.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 bg-white hover:bg-indigo-50 rounded-lg transition-colors group border border-gray-200"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-indigo-600" />
                            <span className="font-medium text-gray-900">CV</span>
                          </div>
                          <Download className="w-4 h-4 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      )}

                      {diplomes.map((diplome) => (
                        <a
                          key={diplome.id}
                          href={getDocumentDownloadUrl(intervenant.id, diplome.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 bg-white hover:bg-amber-50 rounded-lg transition-colors group border border-gray-200"
                        >
                          <div className="flex items-center gap-3">
                            <Award className="w-5 h-5 text-amber-600" />
                            <span className="font-medium text-gray-900 truncate max-w-[120px]">
                              {diplome.fileName}
                            </span>
                          </div>
                          <Download className="w-4 h-4 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      ))}

                      {!cvDocument && diplomes.length === 0 && (
                        <p className="text-gray-500 text-center py-2 text-sm">
                          Aucun document
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
                    <h3 className="font-bold mb-2">Contacter l'intervenant</h3>
                    <p className="text-white/80 text-sm mb-4">
                      Discutez de vos besoins directement.
                    </p>
                    {intervenant.user?.email ? (
                      <a href={`mailto:${intervenant.user.email}`}>
                        <Button className="w-full bg-white text-indigo-600 hover:bg-gray-100">
                          <Mail className="w-4 h-4" />
                          Envoyer un email
                        </Button>
                      </a>
                    ) : (
                      <Link to="/contact" onClick={onClose}>
                        <Button className="w-full bg-white text-indigo-600 hover:bg-gray-100">
                          <ExternalLink className="w-4 h-4" />
                          Nous contacter
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4 flex justify-between items-center bg-gray-50">
              <Link
                to={`/intervenants/${intervenant.id}`}
                onClick={onClose}
                className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2"
              >
                Voir le profil complet
                <ExternalLink className="w-4 h-4" />
              </Link>
              <Button variant="secondary" onClick={onClose}>
                Fermer
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
