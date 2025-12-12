import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getIntervenantById, uploadDocument, deleteDocument, getDocumentDownloadUrl, type Document } from "@/services/intervenants";
import { PageContainer } from "@/components/ui/PageContainer";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { motion } from "motion/react";
import {
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  Clock,
  Trash2,
  Eye,
  ArrowLeft,
  ArrowRight,
  Shield,
  Award,
  CreditCard,
  Building,
  User,
  FileCheck,
  Camera,
  HelpCircle,
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
    color: "indigo",
  },
  {
    type: "CV",
    label: "Curriculum Vitae",
    description: "CV à jour présentant votre parcours et compétences",
    icon: FileText,
    required: true,
    accepts: ".pdf,.doc,.docx",
    color: "blue",
  },
  {
    type: "DIPLOME",
    label: "Diplômes / Certifications",
    description: "Vos diplômes et certifications professionnelles",
    icon: Award,
    required: true,
    accepts: ".pdf,.jpg,.jpeg,.png",
    color: "amber",
    multiple: true,
  },
  {
    type: "PIECE_IDENTITE",
    label: "Pièce d'identité",
    description: "CNI ou Passeport en cours de validité (recto-verso)",
    icon: User,
    required: true,
    accepts: ".pdf,.jpg,.jpeg,.png",
    color: "red",
    sensitive: true,
  },
  {
    type: "KBIS",
    label: "Extrait KBIS / INSEE",
    description: "Extrait KBIS ou avis de situation INSEE (< 3 mois)",
    icon: Building,
    required: true,
    accepts: ".pdf",
    color: "emerald",
  },
  {
    type: "RIB",
    label: "RIB",
    description: "Relevé d'identité bancaire pour les paiements",
    icon: CreditCard,
    required: true,
    accepts: ".pdf,.jpg,.jpeg,.png",
    color: "purple",
    sensitive: true,
  },
  {
    type: "ASSURANCE",
    label: "Assurance RC Pro",
    description: "Attestation d'assurance responsabilité civile professionnelle",
    icon: Shield,
    required: true,
    accepts: ".pdf",
    color: "cyan",
  },
  {
    type: "ATTESTATION_URSSAF",
    label: "Attestation URSSAF",
    description: "Attestation de vigilance URSSAF (< 6 mois)",
    icon: FileCheck,
    required: false,
    accepts: ".pdf",
    color: "orange",
  },
  {
    type: "ATTESTATION_FISCALE",
    label: "Attestation fiscale",
    description: "Attestation de régularité fiscale",
    icon: FileCheck,
    required: false,
    accepts: ".pdf",
    color: "teal",
  },
  {
    type: "CASIER_JUDICIAIRE",
    label: "Casier judiciaire (B3)",
    description: "Extrait de casier judiciaire bulletin n°3 (< 3 mois)",
    icon: FileCheck,
    required: false,
    accepts: ".pdf",
    color: "slate",
    sensitive: true,
  },
];

export default function OnboardingDocumentsPage() {
  const { user } = useAuth();
  const [intervenant, setIntervenant] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadingType, setUploadingType] = useState<string | null>(null);

  useEffect(() => {
    fetchIntervenant();
  }, [user]);

  const fetchIntervenant = async () => {
    if (!user?.intervenant?.id) {
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

  const handleDelete = async (docId: string, docType: string) => {
    if (!user?.intervenant?.id || !confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) return;

    try {
      await deleteDocument(user.intervenant.id, docId);
      setSuccess("Document supprimé !");
      await fetchIntervenant();
    } catch (err) {
      setError("Erreur lors de la suppression");
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
      <div className="min-h-screen bg-gray-50 py-12">
        <PageContainer maxWidth="4xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="bg-white rounded-2xl p-8 space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </PageContainer>
      </div>
    );
  }

  if (!intervenant) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <PageContainer maxWidth="4xl">
          <Alert type="error">Profil intervenant non trouvé</Alert>
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-mesh">
        <PageContainer maxWidth="4xl" className="py-8">
          <Link
            to="/dashboard/intervenant"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au tableau de bord
          </Link>
          <h1 className="text-3xl font-bold text-white">Dossier de candidature</h1>
          <p className="text-white/80 mt-2">
            Complétez votre dossier pour valider votre inscription sur la plateforme
          </p>

          {/* Progress bar */}
          <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-medium">Progression du dossier</span>
              <span className="text-white font-bold">{stats.completed}/{stats.total} documents requis</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.percentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-full rounded-full ${
                  stats.percentage === 100 ? "bg-emerald-400" : "bg-amber-400"
                }`}
              />
            </div>
            {stats.percentage === 100 && (
              <p className="text-emerald-300 text-sm mt-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Tous les documents requis sont téléversés !
              </p>
            )}
          </div>
        </PageContainer>
      </div>

      <PageContainer maxWidth="4xl" className="py-8 -mt-8">
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <Alert type="error" onClose={() => setError(null)}>{error}</Alert>
          </motion.div>
        )}

        {success && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <Alert type="success" onClose={() => setSuccess(null)}>{success}</Alert>
          </motion.div>
        )}

        {/* Help box */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
              <HelpCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-blue-900 mb-1">Documents requis pour valider votre profil</h3>
              <p className="text-blue-700 text-sm">
                Les documents marqués comme <span className="font-semibold">obligatoires</span> doivent être fournis pour que votre profil soit validé.
                Les documents sensibles sont stockés de manière sécurisée et ne sont accessibles qu'à l'administration.
              </p>
            </div>
          </div>
        </div>

        {/* Documents list */}
        <div className="space-y-4">
          {DOCUMENT_REQUIREMENTS.map((req, idx) => {
            const docsOfType = getDocumentsOfType(req.type);
            const hasDoc = docsOfType.length > 0;
            const Icon = req.icon;
            const isUploading = uploadingType === req.type;

            return (
              <motion.div
                key={req.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`bg-white rounded-2xl shadow-lg border ${
                  hasDoc ? "border-emerald-200" : req.required ? "border-amber-200" : "border-gray-100"
                } overflow-hidden`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        hasDoc
                          ? "bg-emerald-100 text-emerald-600"
                          : `bg-${req.color}-100 text-${req.color}-600`
                      }`}
                        style={{
                          backgroundColor: hasDoc ? undefined : `var(--color-${req.color}-100, #e0e7ff)`,
                          color: hasDoc ? undefined : `var(--color-${req.color}-600, #4f46e5)`,
                        }}
                      >
                        {hasDoc ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{req.label}</h3>
                          {req.required ? (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                              Obligatoire
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">
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
                        <p className="text-sm text-gray-500">{req.description}</p>

                        {/* Uploaded documents */}
                        {docsOfType.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {docsOfType.map(doc => (
                              <div
                                key={doc.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm text-gray-700 truncate max-w-[200px]">
                                    {doc.fileName}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <a
                                    href={getDocumentDownloadUrl(intervenant.id, doc.id)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </a>
                                  <button
                                    onClick={() => handleDelete(doc.id, doc.type)}
                                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                        <label className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer transition-colors ${
                          isUploading
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                        }`}>
                          {isUploading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
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
              </motion.div>
            );
          })}
        </div>

        {/* Bottom actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="text-center sm:text-left">
            {stats.percentage === 100 ? (
              <p className="text-emerald-600 font-medium flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Votre dossier est complet !
              </p>
            ) : (
              <p className="text-gray-600">
                Il vous reste <span className="font-semibold text-amber-600">{stats.total - stats.completed} document(s)</span> à téléverser
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <Link to="/dashboard/intervenant/profil">
              <Button variant="secondary">
                <ArrowLeft className="w-4 h-4" />
                Mon profil
              </Button>
            </Link>
            <Link to="/dashboard/intervenant">
              <Button>
                Tableau de bord
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
