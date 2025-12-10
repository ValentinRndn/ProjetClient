import {
  Intervenant,
  getDocumentDownloadUrl,
  Document,
} from "@/services/intervenants";
import { User, Mail, Briefcase, FileText, Download } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useState, useEffect } from "react";

interface IntervenantCardProps {
  intervenant: Intervenant;
}

export function IntervenantCard({ intervenant }: IntervenantCardProps) {
  const [cvDocument, setCvDocument] = useState<Document | null>(null);

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

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Approuvé
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            En attente
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
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
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt={`Photo de profil de ${fullName}`}
              className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100"
              onError={(e) => {
                // Fallback sur l'icône si l'image ne charge pas
                e.currentTarget.style.display = "none";
                const fallback = e.currentTarget
                  .nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className={`w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center ${
              profileImageUrl ? "hidden" : ""
            }`}
          >
            <User className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{fullName}</h3>
            {getStatusBadge(intervenant.status)}
          </div>
        </div>
      </div>

      {intervenant.bio && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {intervenant.bio}
        </p>
      )}

      <div className="space-y-2 mb-4">
        {intervenant.user?.email && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Mail className="w-4 h-4" />
            <span>{intervenant.user.email}</span>
          </div>
        )}
        {intervenant.siret && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Briefcase className="w-4 h-4" />
            <span>SIRET: {intervenant.siret}</span>
          </div>
        )}
      </div>

      {intervenant.disponibility && (
        <div className="pt-4 border-t border-gray-200 mb-4">
          <span className="text-xs text-gray-500">
            {typeof intervenant.disponibility === "boolean" &&
            intervenant.disponibility
              ? "Disponible"
              : typeof intervenant.disponibility === "object"
              ? "Disponibilités configurées"
              : "Non disponible"}
          </span>
        </div>
      )}

      {/* Bouton pour voir le CV */}
      {cvDocument && intervenant.status === "approved" && (
        <div className="pt-4 border-t border-gray-200">
          <Button
            onClick={handleViewCV}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>Voir le CV</span>
            <Download className="w-4 h-4" />
          </Button>
        </div>
      )}
    </Card>
  );
}
