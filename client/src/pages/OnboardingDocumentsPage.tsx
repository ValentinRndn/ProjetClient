import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getIntervenantById, uploadDocument, deleteDocument, fetchDocumentAsBlob, type Document } from "@/services/intervenants";
import { PageContainer } from "@/components/ui/PageContainer";
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
  Download,
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
      <div className="min-h-screen bg-[#ebf2fa]">
        <PageContainer maxWidth="4xl" className="py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-white rounded w-1/3"></div>
            <div className="bg-white rounded-2xl p-8 space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-24 bg-[#ebf2fa] rounded-xl"></div>
              ))}
            </div>
          </div>
        </PageContainer>
      </div>
    );
  }

  if (!intervenant) {
    return (
      <div className="min-h-screen bg-[#ebf2fa]">
        <PageContainer maxWidth="4xl" className="py-8">
          <Alert type="error">Profil intervenant non trouvé</Alert>
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ebf2fa]">
      <PageContainer maxWidth="4xl" className="py-8">
        {/* Header compact */}
        <div className="bg-white rounded-2xl border border-[#1c2942]/10 p-6 mb-6">
          <Link
            to="/dashboard/intervenant"
            className="inline-flex items-center gap-2 text-[#1c2942]/60 hover:text-[#6d74b5] mb-4 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au tableau de bord
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#1c2942] rounded-xl flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#1c2942]">Dossier de candidature</h1>
                <p className="text-sm text-[#1c2942]/60">Complétez votre dossier pour valider votre inscription</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-[#ebf2fa] rounded-lg">
                <FileText className="w-4 h-4 text-[#6d74b5]" />
                <span className="font-bold text-[#1c2942]">{stats.completed}/{stats.total}</span>
                <span className="text-sm text-[#1c2942]/60">requis</span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-6 pt-4 border-t border-[#1c2942]/10">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-[#1c2942]/60">Progression du dossier</span>
              <span className="font-medium text-[#1c2942]">{stats.percentage}%</span>
            </div>
            <div className="h-2 bg-[#ebf2fa] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  stats.percentage === 100 ? "bg-emerald-500" : "bg-[#6d74b5]"
                }`}
                style={{ width: `${stats.percentage}%` }}
              />
            </div>
            {stats.percentage === 100 && (
              <p className="text-emerald-600 text-sm mt-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Tous les documents requis sont téléversés !
              </p>
            )}
          </div>
        </div>

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
        <div className="bg-[#6d74b5]/10 border border-[#6d74b5]/20 rounded-2xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#6d74b5] mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-[#1c2942]">
                Les documents marqués <span className="font-semibold text-amber-600">Obligatoire</span> doivent être fournis pour valider votre profil.
                Les documents <span className="font-semibold text-red-600">sensibles</span> sont stockés de manière sécurisée.
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
                className={`bg-white rounded-2xl border transition-all ${
                  hasDoc
                    ? "border-emerald-200"
                    : req.required
                      ? "border-amber-200"
                      : "border-[#1c2942]/10"
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        hasDoc
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-[#ebf2fa] text-[#6d74b5]"
                      }`}>
                        {hasDoc ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-semibold text-[#1c2942]">{req.label}</h3>
                          {req.required ? (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                              Obligatoire
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-[#ebf2fa] text-[#1c2942]/50 text-xs font-medium rounded-full">
                              Optionnel
                            </span>
                          )}
                          {req.sensitive && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full flex items-center gap-1">
                              <Shield className="w-3 h-3" />
                              Sensible
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[#1c2942]/60">{req.description}</p>

                        {/* Uploaded documents */}
                        {docsOfType.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {docsOfType.map(doc => (
                              <div
                                key={doc.id}
                                className="flex items-center justify-between p-3 bg-[#ebf2fa] rounded-xl"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <FileText className="w-4 h-4 text-[#6d74b5] shrink-0" />
                                  <span className="text-sm text-[#1c2942] truncate">
                                    {doc.fileName}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    onClick={() => handleView(doc.id)}
                                    className="p-2 text-[#1c2942]/50 hover:text-[#6d74b5] hover:bg-white rounded-lg transition-colors"
                                    title="Voir"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(doc.id)}
                                    className="p-2 text-[#1c2942]/50 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
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
                        <label className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer transition-all text-sm font-medium ${
                          isUploading
                            ? "bg-[#ebf2fa] text-[#1c2942]/40 cursor-not-allowed"
                            : "bg-[#6d74b5] text-white hover:bg-[#5a61a0]"
                        }`}>
                          {isUploading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-[#1c2942]/20 border-t-[#1c2942]/60 rounded-full animate-spin" />
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
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white rounded-2xl border border-[#1c2942]/10 p-6">
          <div className="text-center sm:text-left">
            {stats.percentage === 100 ? (
              <p className="text-emerald-600 font-medium flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Votre dossier est complet !
              </p>
            ) : (
              <p className="text-[#1c2942]/60">
                Il vous reste <span className="font-semibold text-amber-600">{stats.total - stats.completed} document(s)</span> à téléverser
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <Link to="/dashboard/intervenant/profil">
              <Button variant="outline" className="rounded-xl">
                <ArrowLeft className="w-4 h-4" />
                Mon profil
              </Button>
            </Link>
            <Link to="/dashboard/intervenant">
              <Button variant="primary" className="bg-[#6d74b5] hover:bg-[#5a61a0] rounded-xl">
                Tableau de bord
              </Button>
            </Link>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
