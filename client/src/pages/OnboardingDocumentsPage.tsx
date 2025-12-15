import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getIntervenantById, uploadDocument, deleteDocument, fetchDocumentAsBlob, type Document } from "@/services/intervenants";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import {
  FileText,
  Upload,
  CheckCircle,
  Trash2,
  Eye,
  ArrowLeft,
  Shield,
  Award,
  CreditCard,
  Building,
  User,
  FileCheck,
  Camera,
  FolderOpen,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router";

// Configuration des types de documents requis pour l'onboarding
const DOCUMENT_REQUIREMENTS = [
  {
    type: "PROFILE_IMAGE",
    label: "Photo de profil",
    description: "Photo professionnelle récente (format carré recommandé)",
    icon: Camera,
    required: true,
    accepts: ".jpg,.jpeg,.png",
  },
  {
    type: "CV",
    label: "Curriculum Vitae",
    description: "CV à jour présentant votre parcours et compétences",
    icon: FileText,
    required: true,
    accepts: ".pdf,.doc,.docx",
  },
  {
    type: "DIPLOME",
    label: "Diplômes / Certifications",
    description: "Vos diplômes et certifications professionnelles",
    icon: Award,
    required: true,
    accepts: ".pdf,.jpg,.jpeg,.png",
    multiple: true,
  },
  {
    type: "PIECE_IDENTITE",
    label: "Pièce d'identité",
    description: "CNI ou Passeport en cours de validité (recto-verso)",
    icon: User,
    required: true,
    accepts: ".pdf,.jpg,.jpeg,.png",
    sensitive: true,
  },
  {
    type: "KBIS",
    label: "Extrait KBIS / INSEE",
    description: "Extrait KBIS ou avis de situation INSEE (< 3 mois)",
    icon: Building,
    required: true,
    accepts: ".pdf",
  },
  {
    type: "RIB",
    label: "RIB",
    description: "Relevé d'identité bancaire pour les paiements",
    icon: CreditCard,
    required: true,
    accepts: ".pdf,.jpg,.jpeg,.png",
    sensitive: true,
  },
  {
    type: "ASSURANCE",
    label: "Assurance RC Pro",
    description: "Attestation d'assurance responsabilité civile professionnelle",
    icon: Shield,
    required: true,
    accepts: ".pdf",
  },
  {
    type: "ATTESTATION_URSSAF",
    label: "Attestation URSSAF",
    description: "Attestation de vigilance URSSAF (< 6 mois)",
    icon: FileCheck,
    required: false,
    accepts: ".pdf",
  },
  {
    type: "ATTESTATION_FISCALE",
    label: "Attestation fiscale",
    description: "Attestation de régularité fiscale",
    icon: FileCheck,
    required: false,
    accepts: ".pdf",
  },
  {
    type: "CASIER_JUDICIAIRE",
    label: "Casier judiciaire (B3)",
    description: "Extrait de casier judiciaire bulletin n°3 (< 3 mois)",
    icon: FileCheck,
    required: false,
    accepts: ".pdf",
    sensitive: true,
  },
];

export default function OnboardingDocumentsPage() {
  const { user, refreshUser } = useAuth();
  const [intervenant, setIntervenant] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const [hasTriedRefresh, setHasTriedRefresh] = useState(false);

  useEffect(() => {
    fetchIntervenant();
  }, [user]);

  const fetchIntervenant = async () => {
    if (!user?.intervenant?.id) {
      if (!hasTriedRefresh && user?.role === "INTERVENANT") {
        setHasTriedRefresh(true);
        try {
          await refreshUser();
        } catch {
          setIsLoading(false);
        }
        return;
      }
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await getIntervenantById(user.intervenant.id);
      setIntervenant(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors du chargement";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (!file || !user?.intervenant?.id) return;

    try {
      setUploadingType(type);
      setError(null);
      await uploadDocument(user.intervenant.id, file, type);
      setSuccess(`Document "${DOCUMENT_REQUIREMENTS.find(d => d.type === type)?.label}" uploadé avec succès !`);
      await fetchIntervenant();
    } catch (err) {
      setError("Erreur lors de l'upload du document");
    } finally {
      setUploadingType(null);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!user?.intervenant?.id || !confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) return;

    try {
      await deleteDocument(user.intervenant.id, docId);
      setSuccess("Document supprimé !");
      await fetchIntervenant();
    } catch (err) {
      setError("Erreur lors de la suppression");
    }
  };

  const handleView = async (docId: string) => {
    if (!intervenant?.id) return;

    try {
      const blobUrl = await fetchDocumentAsBlob(intervenant.id, docId);
      if (blobUrl) {
        window.open(blobUrl, "_blank");
      } else {
        setError("Impossible d'afficher le document");
      }
    } catch {
      setError("Erreur lors de l'affichage du document");
    }
  };

  const documents = (intervenant?.documents as unknown as Document[]) || [];

  const getDocumentsOfType = (type: string) => {
    return documents.filter(d => d.type === type);
  };

  const getCompletionStats = () => {
    const required = DOCUMENT_REQUIREMENTS.filter(d => d.required);
    const uploaded = required.filter(req => getDocumentsOfType(req.type).length > 0);
    return {
      total: required.length,
      completed: uploaded.length,
      percentage: Math.round((uploaded.length / required.length) * 100),
    };
  };

  const stats = getCompletionStats();

  if (isLoading) {
    return (
      <div style={{ backgroundColor: "#ebf2fa", minHeight: "100vh" }}>
        <div style={{ backgroundColor: "#1c2942", minHeight: "150px" }} className="flex items-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
            <div className="h-4 w-32 rounded mb-3" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}></div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: "#6d74b5" }}></div>
              <div>
                <div className="h-6 w-48 rounded mb-2" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}></div>
                <div className="h-4 w-72 rounded" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}></div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="animate-pulse space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-24 rounded-xl" style={{ backgroundColor: "#ffffff" }}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!intervenant) {
    return (
      <div style={{ backgroundColor: "#ebf2fa", minHeight: "100vh" }}>
        <div style={{ backgroundColor: "#1c2942", minHeight: "150px" }} className="flex items-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
            <Link
              to="/dashboard/intervenant"
              className="inline-flex items-center gap-2 text-sm mb-3 transition-colors hover:opacity-80"
              style={{ color: "rgba(235, 242, 250, 0.7)" }}
            >
              <ArrowLeft className="w-4 h-4" />
              Retour au tableau de bord
            </Link>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#6d74b5" }}
              >
                <FolderOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Mon Dossier</h1>
                <p className="text-sm" style={{ color: "rgba(235, 242, 250, 0.7)" }}>
                  Profil intervenant non trouvé
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Alert type="error">Profil intervenant non trouvé</Alert>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#ebf2fa", minHeight: "100vh" }}>
      {/* Header avec bannière */}
      <div style={{ backgroundColor: "#1c2942", minHeight: "150px" }} className="flex items-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
          <Link
            to="/dashboard/intervenant"
            className="inline-flex items-center gap-2 text-sm mb-3 transition-colors hover:opacity-80"
            style={{ color: "rgba(235, 242, 250, 0.7)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au tableau de bord
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#6d74b5" }}
              >
                <FolderOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Mon Dossier</h1>
                <p className="text-sm" style={{ color: "rgba(235, 242, 250, 0.7)" }}>
                  Complétez votre dossier pour valider votre inscription
                </p>
              </div>
            </div>
          </div>

          {/* Stats inline */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-white/20">
            <div
              className="px-3 py-1.5 rounded-lg"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            >
              <span className="font-bold text-white">{stats.completed}/{stats.total}</span>
              <span className="text-sm ml-2" style={{ color: "rgba(235, 242, 250, 0.7)" }}>documents requis</span>
            </div>
            <div
              className="px-3 py-1.5 rounded-lg"
              style={{
                backgroundColor: stats.percentage === 100
                  ? "rgba(16, 185, 129, 0.2)"
                  : stats.percentage >= 50
                    ? "rgba(251, 191, 36, 0.2)"
                    : "rgba(239, 68, 68, 0.2)"
              }}
            >
              <span
                className="font-bold"
                style={{
                  color: stats.percentage === 100
                    ? "#10b981"
                    : stats.percentage >= 50
                      ? "#fbbf24"
                      : "#ef4444"
                }}
              >
                {stats.percentage}%
              </span>
              <span
                className="text-sm ml-2"
                style={{
                  color: stats.percentage === 100
                    ? "#10b981"
                    : stats.percentage >= 50
                      ? "#fbbf24"
                      : "#ef4444"
                }}
              >
                complet
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${stats.percentage}%`,
                  backgroundColor: stats.percentage === 100 ? "#10b981" : "#6d74b5"
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Alerts */}
        {error && (
          <div className="mb-6">
            <Alert type="error" onClose={() => setError(null)}>{error}</Alert>
          </div>
        )}

        {success && (
          <div className="mb-6">
            <Alert type="success" onClose={() => setSuccess(null)}>{success}</Alert>
          </div>
        )}

        {/* Help box */}
        <div
          className="rounded-xl p-4 mb-6"
          style={{ backgroundColor: "rgba(109, 116, 181, 0.1)", border: "1px solid rgba(109, 116, 181, 0.2)" }}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#6d74b5" }} />
            <div>
              <p className="text-sm" style={{ color: "#1c2942" }}>
                Les documents marqués <span className="font-semibold" style={{ color: "#d97706" }}>Obligatoire</span> doivent être fournis pour valider votre profil.
                Les documents <span className="font-semibold" style={{ color: "#dc2626" }}>sensibles</span> sont stockés de manière sécurisée.
              </p>
            </div>
          </div>
        </div>

        {/* Documents list */}
        <div className="space-y-3">
          {DOCUMENT_REQUIREMENTS.map((req) => {
            const docsOfType = getDocumentsOfType(req.type);
            const hasDoc = docsOfType.length > 0;
            const Icon = req.icon;
            const isUploading = uploadingType === req.type;

            return (
              <div
                key={req.type}
                className="rounded-xl transition-all"
                style={{
                  backgroundColor: "#ffffff",
                  border: hasDoc
                    ? "1px solid #10b981"
                    : req.required
                      ? "1px solid #fbbf24"
                      : "1px solid #ebf2fa"
                }}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: hasDoc ? "#d1fae5" : "#ebf2fa",
                          color: hasDoc ? "#10b981" : "#6d74b5"
                        }}
                      >
                        {hasDoc ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-semibold" style={{ color: "#1c2942" }}>{req.label}</h3>
                          {req.required ? (
                            <span
                              className="px-2 py-0.5 text-xs font-medium rounded-full"
                              style={{ backgroundColor: "#fef3c7", color: "#92400e" }}
                            >
                              Obligatoire
                            </span>
                          ) : (
                            <span
                              className="px-2 py-0.5 text-xs font-medium rounded-full"
                              style={{ backgroundColor: "#ebf2fa", color: "#6d74b5" }}
                            >
                              Optionnel
                            </span>
                          )}
                          {req.sensitive && (
                            <span
                              className="px-2 py-0.5 text-xs font-medium rounded-full flex items-center gap-1"
                              style={{ backgroundColor: "#fef2f2", color: "#b91c1c" }}
                            >
                              <Shield className="w-3 h-3" />
                              Sensible
                            </span>
                          )}
                        </div>
                        <p className="text-sm" style={{ color: "#6d74b5" }}>{req.description}</p>

                        {/* Uploaded documents */}
                        {docsOfType.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {docsOfType.map(doc => (
                              <div
                                key={doc.id}
                                className="flex items-center justify-between p-3 rounded-xl"
                                style={{ backgroundColor: "#ebf2fa" }}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <FileText className="w-4 h-4 shrink-0" style={{ color: "#6d74b5" }} />
                                  <span className="text-sm truncate" style={{ color: "#1c2942" }}>
                                    {doc.fileName}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    onClick={() => handleView(doc.id)}
                                    className="p-2 rounded-lg transition-colors"
                                    style={{ color: "#6d74b5" }}
                                    title="Voir"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(doc.id)}
                                    className="p-2 rounded-lg transition-colors"
                                    style={{ color: "#dc2626" }}
                                    title="Supprimer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Upload button */}
                    <div className="shrink-0">
                      {(!hasDoc || req.multiple) && (
                        <label
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer transition-all text-sm font-medium"
                          style={{
                            backgroundColor: isUploading ? "#ebf2fa" : "#6d74b5",
                            color: isUploading ? "#6d74b5" : "#ffffff",
                            cursor: isUploading ? "not-allowed" : "pointer"
                          }}
                        >
                          {isUploading ? (
                            <>
                              <div
                                className="w-4 h-4 border-2 rounded-full animate-spin"
                                style={{ borderColor: "#ebf2fa", borderTopColor: "#6d74b5" }}
                              />
                              Upload...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4" />
                              {hasDoc && req.multiple ? "Ajouter" : "Téléverser"}
                            </>
                          )}
                          <input
                            type="file"
                            accept={req.accepts}
                            className="hidden"
                            onChange={(e) => handleUpload(e, req.type)}
                            disabled={isUploading}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom actions */}
        <div
          className="mt-6 flex flex-col sm:flex-row gap-4 justify-between items-center rounded-xl p-6"
          style={{ backgroundColor: "#ffffff" }}
        >
          <div className="text-center sm:text-left">
            {stats.percentage === 100 ? (
              <p className="font-medium flex items-center gap-2" style={{ color: "#10b981" }}>
                <CheckCircle className="w-5 h-5" />
                Votre dossier est complet !
              </p>
            ) : (
              <p style={{ color: "#6d74b5" }}>
                Il vous reste <span className="font-semibold" style={{ color: "#d97706" }}>{stats.total - stats.completed} document(s)</span> à téléverser
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <Link to="/dashboard/intervenant/profil">
              <Button variant="secondary" style={{ borderColor: "#ebf2fa" }}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Mon profil
              </Button>
            </Link>
            <Link to="/dashboard/intervenant">
              <Button variant="primary" className="bg-[#6d74b5] hover:bg-[#5a61a0]">
                Tableau de bord
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
