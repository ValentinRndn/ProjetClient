import {
  Intervenant,
  getDocumentDownloadUrl,
  Document,
} from "@/services/intervenants";
import { User, Mail, FileText, Download, MapPin, Eye, Award, Heart } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { checkFavorite, toggleFavorite } from "@/services/favorites";

interface IntervenantCardProps {
  intervenant: Intervenant;
  onFavoriteChange?: () => void;
}

export function IntervenantCard({ intervenant, onFavoriteChange }: IntervenantCardProps) {
  const { user } = useAuth();
  const [cvDocument, setCvDocument] = useState<Document | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);

  const isEcole = user?.role === "ECOLE";

  const fullName =
    [intervenant.firstName, intervenant.lastName].filter(Boolean).join(" ") ||
    intervenant.user?.name ||
    intervenant.user?.email?.split("@")[0] ||
    "Intervenant";

  // Récupérer le CV si disponible
  useEffect(() => {
    const fetchCV = async () => {
      if (intervenant.status === "approved" && intervenant.documents) {
        const documents = intervenant.documents as unknown as Document[];
        const cv = documents.find((doc) => doc.type === "CV");
        if (cv) {
          setCvDocument(cv);
        }
      }
    };
    fetchCV();
  }, [intervenant]);

  // Vérifier si l'intervenant est dans les favoris (pour les écoles)
  useEffect(() => {
    const checkIfFavorite = async () => {
      if (isEcole && intervenant.id && intervenant.status === "approved") {
        try {
          const response = await checkFavorite(intervenant.id);
          setIsFavorite(response.isFavorite);
        } catch (err) {
          // Ignorer les erreurs silencieusement
        }
      }
    };
    checkIfFavorite();
  }, [isEcole, intervenant.id, intervenant.status]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!intervenant.id || isLoadingFavorite) return;

    try {
      setIsLoadingFavorite(true);
      const result = await toggleFavorite(intervenant.id);
      setIsFavorite(result.isFavorite);
      onFavoriteChange?.();
    } catch (err) {
      console.error("Erreur lors du toggle favori:", err);
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-[#ebf2fa] text-[#6d74b5]">
            Vérifié
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-700">
            En attente
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-red-50 text-red-700">
            Rejeté
          </span>
        );
      default:
        return null;
    }
  };

  const handleViewCV = () => {
    if (cvDocument && intervenant.id) {
      const downloadUrl = getDocumentDownloadUrl(intervenant.id, cvDocument.id);
      window.open(downloadUrl, "_blank");
    }
  };

  // Construire l'URL de l'image de profil
  const getProfileImageUrl = () => {
    // Priorité 1: Chercher un document de type PROFILE_IMAGE dans les documents
    if (intervenant.documents && intervenant.id) {
      const documents = intervenant.documents as unknown as Document[];
      const profileDoc = documents.find((doc) => doc.type === "PROFILE_IMAGE");
      if (profileDoc) {
        return getDocumentDownloadUrl(intervenant.id, profileDoc.id);
      }
    }

    // Priorité 2: Si profileImage est défini et c'est une URL HTTP/HTTPS directe
    if (intervenant.profileImage) {
      if (
        intervenant.profileImage.startsWith("http://") ||
        intervenant.profileImage.startsWith("https://")
      ) {
        return intervenant.profileImage;
      }

      // Priorité 3: Si profileImage est l'ID d'un document, essayer de le trouver
      if (intervenant.documents && intervenant.id) {
        const documents = intervenant.documents as unknown as Document[];
        const matchingDoc = documents.find(
          (doc) =>
            doc.id === intervenant.profileImage ||
            doc.filePath === intervenant.profileImage
        );
        if (matchingDoc) {
          return getDocumentDownloadUrl(intervenant.id, matchingDoc.id);
        }
      }
    }

    return null;
  };

  const profileImageUrl = getProfileImageUrl();

  return (
    <Card className="p-5 hover:shadow-xl transition-all duration-300 relative group hover:-translate-y-1 h-full flex flex-col">
      {/* Bouton favori pour les écoles */}
      {isEcole && intervenant.status === "approved" && (
        <button
          onClick={handleToggleFavorite}
          disabled={isLoadingFavorite}
          className={`absolute top-4 right-4 p-2 rounded-full transition-all z-10 ${
            isFavorite
              ? "bg-rose-100 text-rose-600 hover:bg-rose-200"
              : "bg-[#ebf2fa] text-[#1c2942]/40 hover:bg-rose-50 hover:text-rose-500"
          } ${isLoadingFavorite ? "opacity-50 cursor-not-allowed" : ""}`}
          title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Heart
            className={`w-5 h-5 ${isFavorite ? "fill-rose-600" : ""}`}
          />
        </button>
      )}

      {/* En-tête avec avatar */}
      <div className="flex items-center gap-3 mb-4">
        {profileImageUrl ? (
          <img
            src={profileImageUrl}
            alt={`Photo de profil de ${fullName}`}
            className="w-12 h-12 rounded-xl object-cover border-2 border-[#ebf2fa] shadow-sm"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className={`w-12 h-12 rounded-xl bg-[#ebf2fa] flex items-center justify-center shadow-sm ${
            profileImageUrl ? "hidden" : ""
          }`}
        >
          <User className="w-6 h-6 text-[#6d74b5]" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-[#1c2942] truncate">{fullName}</h3>
          {getStatusBadge(intervenant.status)}
        </div>
      </div>

      {intervenant.bio && (
        <p className="text-[#1c2942]/70 text-sm mb-4 line-clamp-3">
          {intervenant.bio}
        </p>
      )}

      {/* Expertises */}
      {intervenant.expertises && intervenant.expertises.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {intervenant.expertises.slice(0, 3).map((expertise, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 bg-[#ebf2fa] text-[#6d74b5] rounded-full text-xs font-medium"
            >
              {expertise}
            </span>
          ))}
          {intervenant.expertises.length > 3 && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs">
              +{intervenant.expertises.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="space-y-2 mb-4 flex-grow">
        {intervenant.city && (
          <div className="flex items-center gap-2 text-sm text-[#1c2942]/60">
            <MapPin className="w-4 h-4" />
            <span>{intervenant.city}</span>
          </div>
        )}
        {intervenant.yearsExperience && (
          <div className="flex items-center gap-2 text-sm text-[#1c2942]/60">
            <Award className="w-4 h-4" />
            <span>{intervenant.yearsExperience} ans d'expérience</span>
          </div>
        )}
        {intervenant.user?.email && (
          <div className="flex items-center gap-2 text-sm text-[#1c2942]/60">
            <Mail className="w-4 h-4" />
            <span className="truncate">{intervenant.user.email}</span>
          </div>
        )}
      </div>

      {intervenant.disponibility && (
        <div className="pt-4 border-t border-[#1c2942]/10 mb-4">
          {(() => {
            const dispo = intervenant.disponibility as { isAvailable?: boolean; unavailableUntil?: string; notes?: string } | boolean;
            if (typeof dispo === "boolean") {
              return (
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full ${
                  dispo ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                }`}>
                  {dispo ? "✓ Disponible" : "✗ Non disponible"}
                </span>
              );
            }
            if (typeof dispo === "object") {
              const isAvailable = dispo.isAvailable ?? true;
              const unavailableUntil = dispo.unavailableUntil;

              if (isAvailable) {
                return (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                    ✓ Disponible
                  </span>
                );
              }

              return (
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                    ⏳ Indisponible
                  </span>
                  {unavailableUntil && (
                    <p className="text-xs text-gray-500">
                      Disponible le {new Date(unavailableUntil).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                    </p>
                  )}
                </div>
              );
            }
            return null;
          })()}
        </div>
      )}

      {/* Boutons d'action */}
      <div className="pt-4 border-t border-[#1c2942]/10 flex flex-col gap-2">
        {/* Bouton vers le profil complet */}
        {intervenant.status === "approved" && (
          <Link to={`/intervenants/${intervenant.id}`} className="w-full">
            <Button
              variant="primary"
              className="w-full flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span>Voir le profil</span>
            </Button>
          </Link>
        )}

        {/* Bouton pour voir le CV */}
        {cvDocument && intervenant.status === "approved" && (
          <Button
            onClick={handleViewCV}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>Voir le CV</span>
            <Download className="w-4 h-4" />
          </Button>
        )}
      </div>
    </Card>
  );
}
