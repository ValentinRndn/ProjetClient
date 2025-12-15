/**
 * Page de détail d'une collaboration
 */
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import {
  getCollaborationById,
  updateCollaboration,
  validateCollaboration,
  updateCollaborationStatus,
  deleteCollaboration,
  type Collaboration,
  type CollaborationStatus,
} from "@/services/collaborations";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import {
  Handshake,
  ArrowLeft,
  Save,
  Building2,
  User,
  Calendar,
  Euro,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Trash2,
  Check,
  Edit3,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const STATUS_CONFIG: Record<
  CollaborationStatus,
  { label: string; color: string; bgColor: string; icon: React.ReactNode }
> = {
  brouillon: {
    label: "Brouillon",
    color: "#6d74b5",
    bgColor: "rgba(109, 116, 181, 0.1)",
    icon: <FileText className="w-4 h-4" />,
  },
  en_cours: {
    label: "En cours",
    color: "#10b981",
    bgColor: "rgba(16, 185, 129, 0.1)",
    icon: <Clock className="w-4 h-4" />,
  },
  terminee: {
    label: "Terminée",
    color: "#3b82f6",
    bgColor: "rgba(59, 130, 246, 0.1)",
    icon: <CheckCircle className="w-4 h-4" />,
  },
  annulee: {
    label: "Annulée",
    color: "#ef4444",
    bgColor: "rgba(239, 68, 68, 0.1)",
    icon: <XCircle className="w-4 h-4" />,
  },
};

export default function CollaborationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [collaboration, setCollaboration] = useState<Collaboration | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form data pour édition
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [montantHT, setMontantHT] = useState("");
  const [notes, setNotes] = useState("");

  const isEcole = user?.role === "ECOLE";
  const isIntervenant = user?.role === "INTERVENANT";

  useEffect(() => {
    if (id) {
      fetchCollaboration();
    }
  }, [id]);

  const fetchCollaboration = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await getCollaborationById(id);
      setCollaboration(data);

      // Initialiser le formulaire
      setTitre(data.titre);
      setDescription(data.description || "");
      setDateDebut(data.dateDebut ? data.dateDebut.split("T")[0] : "");
      setDateFin(data.dateFin ? data.dateFin.split("T")[0] : "");
      setMontantHT(data.montantHT ? (data.montantHT / 100).toString() : "");
      setNotes(data.notes || "");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors du chargement";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!id) return;

    try {
      setIsSaving(true);
      setError(null);

      const data = {
        titre: titre.trim(),
        description: description.trim() || undefined,
        dateDebut: dateDebut || undefined,
        dateFin: dateFin || undefined,
        montantHT: montantHT ? Math.round(parseFloat(montantHT) * 100) : undefined,
        notes: notes.trim() || undefined,
      };

      const updated = await updateCollaboration(id, data);
      setCollaboration(updated);
      setIsEditing(false);
      setSuccess("Collaboration mise à jour avec succès");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors de la sauvegarde";
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleValidate = async () => {
    if (!id) return;

    try {
      setIsSaving(true);
      setError(null);
      const updated = await validateCollaboration(id);
      setCollaboration(updated);
      setSuccess("Vous avez validé cette collaboration");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors de la validation";
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (status: CollaborationStatus) => {
    if (!id) return;

    try {
      setIsSaving(true);
      setError(null);
      const updated = await updateCollaborationStatus(id, status);
      setCollaboration(updated);
      setSuccess(`Statut changé en "${STATUS_CONFIG[status].label}"`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors du changement de statut";
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette collaboration ?")) {
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      await deleteCollaboration(id);
      navigate("/collaborations");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors de la suppression";
      setError(errorMessage);
      setIsSaving(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatMontant = (cents?: number) => {
    if (!cents) return "-";
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(cents / 100);
  };

  if (isLoading) {
    return (
      <div style={{ backgroundColor: "#ebf2fa", minHeight: "100vh" }}>
        <div style={{ backgroundColor: "#1c2942", minHeight: "150px" }} className="flex items-center">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
            <div className="h-4 w-32 rounded mb-3" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}></div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: "#6d74b5" }}></div>
              <div>
                <div className="h-6 w-48 rounded mb-2" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}></div>
                <div className="h-4 w-64 rounded" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}></div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="animate-pulse space-y-6">
            <div className="rounded-xl p-8" style={{ backgroundColor: "#ffffff" }}>
              <div className="h-32 rounded" style={{ backgroundColor: "#ebf2fa" }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!collaboration) {
    return (
      <div style={{ backgroundColor: "#ebf2fa", minHeight: "100vh" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Alert type="error">Collaboration non trouvée</Alert>
          <Link to="/collaborations" className="inline-block mt-4">
            <Button variant="secondary">Retour aux collaborations</Button>
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[collaboration.status];
  const canEdit = collaboration.status === "brouillon";
  const canValidate =
    collaboration.status === "brouillon" &&
    ((isEcole && !collaboration.validatedByEcole) ||
      (isIntervenant && !collaboration.validatedByIntervenant));
  const canDelete =
    collaboration.status === "brouillon" &&
    ((collaboration.createdBy === "ecole" && isEcole) ||
      (collaboration.createdBy === "intervenant" && isIntervenant));

  const partnerName = isEcole
    ? `${collaboration.intervenant?.firstName || ""} ${collaboration.intervenant?.lastName || ""}`.trim() ||
      collaboration.intervenant?.user?.email
    : collaboration.ecole?.name;

  return (
    <div style={{ backgroundColor: "#ebf2fa", minHeight: "100vh" }}>
      {/* Header avec bannière */}
      <div style={{ backgroundColor: "#1c2942", minHeight: "150px" }} className="flex items-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
          <Link
            to="/collaborations"
            className="inline-flex items-center gap-2 text-sm mb-3 transition-colors hover:opacity-80"
            style={{ color: "rgba(235, 242, 250, 0.7)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux collaborations
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#6d74b5" }}
              >
                <Handshake className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{collaboration.titre}</h1>
                <p className="text-sm" style={{ color: "rgba(235, 242, 250, 0.7)" }}>
                  Collaboration avec {partnerName}
                </p>
              </div>
            </div>

            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
              style={{ backgroundColor: statusConfig.bgColor, color: statusConfig.color }}
            >
              {statusConfig.icon}
              {statusConfig.label}
            </span>
          </div>

          {/* Validation status */}
          {collaboration.status === "brouillon" && (
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/20">
              <span
                className={`text-sm px-3 py-1 rounded-full ${
                  collaboration.validatedByEcole
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-amber-500/20 text-amber-400"
                }`}
              >
                {collaboration.validatedByEcole ? "✓ École validée" : "⏳ École en attente"}
              </span>
              <span
                className={`text-sm px-3 py-1 rounded-full ${
                  collaboration.validatedByIntervenant
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-amber-500/20 text-amber-400"
                }`}
              >
                {collaboration.validatedByIntervenant
                  ? "✓ Intervenant validé"
                  : "⏳ Intervenant en attente"}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-6">
            <Alert type="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </div>
        )}

        {success && (
          <div className="mb-6">
            <Alert type="success" onClose={() => setSuccess(null)}>
              {success}
            </Alert>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations */}
            <div className="rounded-xl p-6" style={{ backgroundColor: "#ffffff" }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: "#1c2942" }}>
                  <FileText className="w-5 h-5" style={{ color: "#6d74b5" }} />
                  Informations
                </h2>
                {canEdit && !isEditing && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    style={{ borderColor: "#ebf2fa" }}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#1c2942" }}>
                      Titre *
                    </label>
                    <input
                      type="text"
                      value={titre}
                      onChange={(e) => setTitre(e.target.value)}
                      className="w-full px-4 py-3 border rounded-xl"
                      style={{ borderColor: "#ebf2fa" }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#1c2942" }}>
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border rounded-xl resize-none"
                      style={{ borderColor: "#ebf2fa" }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: "#1c2942" }}>
                        Date de début
                      </label>
                      <input
                        type="date"
                        value={dateDebut}
                        onChange={(e) => setDateDebut(e.target.value)}
                        className="w-full px-4 py-3 border rounded-xl"
                        style={{ borderColor: "#ebf2fa" }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: "#1c2942" }}>
                        Date de fin
                      </label>
                      <input
                        type="date"
                        value={dateFin}
                        onChange={(e) => setDateFin(e.target.value)}
                        className="w-full px-4 py-3 border rounded-xl"
                        style={{ borderColor: "#ebf2fa" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#1c2942" }}>
                      Montant HT (€)
                    </label>
                    <input
                      type="number"
                      value={montantHT}
                      onChange={(e) => setMontantHT(e.target.value)}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border rounded-xl"
                      style={{ borderColor: "#ebf2fa" }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#1c2942" }}>
                      Notes
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border rounded-xl resize-none"
                      style={{ borderColor: "#ebf2fa" }}
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      variant="secondary"
                      onClick={() => setIsEditing(false)}
                      style={{ borderColor: "#ebf2fa" }}
                    >
                      Annuler
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-[#6d74b5] hover:bg-[#5a61a0]"
                    >
                      {isSaving ? "Sauvegarde..." : "Sauvegarder"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {collaboration.description && (
                    <div>
                      <p className="text-sm font-medium mb-1" style={{ color: "#6d74b5" }}>
                        Description
                      </p>
                      <p style={{ color: "#1c2942" }}>{collaboration.description}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: "#ebf2fa" }}>
                      <Calendar className="w-5 h-5" style={{ color: "#6d74b5" }} />
                      <div>
                        <p className="text-xs" style={{ color: "#6d74b5" }}>Date de début</p>
                        <p className="font-medium" style={{ color: "#1c2942" }}>
                          {formatDate(collaboration.dateDebut)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: "#ebf2fa" }}>
                      <Calendar className="w-5 h-5" style={{ color: "#6d74b5" }} />
                      <div>
                        <p className="text-xs" style={{ color: "#6d74b5" }}>Date de fin</p>
                        <p className="font-medium" style={{ color: "#1c2942" }}>
                          {formatDate(collaboration.dateFin)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: "#ebf2fa" }}>
                    <Euro className="w-5 h-5" style={{ color: "#6d74b5" }} />
                    <div>
                      <p className="text-xs" style={{ color: "#6d74b5" }}>Montant HT</p>
                      <p className="font-medium" style={{ color: "#1c2942" }}>
                        {formatMontant(collaboration.montantHT)}
                      </p>
                    </div>
                  </div>

                  {collaboration.notes && (
                    <div className="p-3 rounded-xl" style={{ backgroundColor: "#ebf2fa" }}>
                      <p className="text-xs mb-1" style={{ color: "#6d74b5" }}>Notes</p>
                      <p style={{ color: "#1c2942" }}>{collaboration.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            {(canValidate || collaboration.status === "en_cours") && (
              <div className="rounded-xl p-6" style={{ backgroundColor: "#ffffff" }}>
                <h2 className="text-lg font-bold mb-4" style={{ color: "#1c2942" }}>
                  Actions
                </h2>

                <div className="flex flex-wrap gap-3">
                  {canValidate && (
                    <Button
                      onClick={handleValidate}
                      disabled={isSaving}
                      className="bg-emerald-500 hover:bg-emerald-600"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Valider ma participation
                    </Button>
                  )}

                  {collaboration.status === "en_cours" && (
                    <Button
                      onClick={() => handleStatusChange("terminee")}
                      disabled={isSaving}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Marquer comme terminée
                    </Button>
                  )}

                  {canDelete && (
                    <Button
                      variant="secondary"
                      onClick={handleDelete}
                      disabled={isSaving}
                      className="text-red-500 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Partenaire */}
          <div className="space-y-6">
            <div className="rounded-xl p-6" style={{ backgroundColor: "#ffffff" }}>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: "#1c2942" }}>
                {isEcole ? (
                  <User className="w-5 h-5" style={{ color: "#6d74b5" }} />
                ) : (
                  <Building2 className="w-5 h-5" style={{ color: "#6d74b5" }} />
                )}
                {isEcole ? "Intervenant" : "École"}
              </h2>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: "#ebf2fa" }}
                  >
                    {isEcole ? (
                      <User className="w-6 h-6" style={{ color: "#6d74b5" }} />
                    ) : (
                      <Building2 className="w-6 h-6" style={{ color: "#6d74b5" }} />
                    )}
                  </div>
                  <div>
                    <p className="font-bold" style={{ color: "#1c2942" }}>
                      {partnerName}
                    </p>
                    {isEcole && collaboration.intervenant?.city && (
                      <p className="text-sm" style={{ color: "#6d74b5" }}>
                        {collaboration.intervenant.city}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t" style={{ borderColor: "#ebf2fa" }}>
                  {isEcole && collaboration.intervenant?.user?.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4" style={{ color: "#6d74b5" }} />
                      <span style={{ color: "#1c2942" }}>
                        {collaboration.intervenant.user.email}
                      </span>
                    </div>
                  )}

                  {isEcole && collaboration.intervenant?.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4" style={{ color: "#6d74b5" }} />
                      <span style={{ color: "#1c2942" }}>
                        {collaboration.intervenant.phone}
                      </span>
                    </div>
                  )}

                  {!isEcole && collaboration.ecole?.contactEmail && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4" style={{ color: "#6d74b5" }} />
                      <span style={{ color: "#1c2942" }}>
                        {collaboration.ecole.contactEmail}
                      </span>
                    </div>
                  )}
                </div>

                {isEcole && collaboration.intervenant?.id && (
                  <Link to={`/intervenants/${collaboration.intervenant.id}`}>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full mt-4"
                      style={{ borderColor: "#ebf2fa" }}
                    >
                      Voir le profil
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Métadonnées */}
            <div className="rounded-xl p-6" style={{ backgroundColor: "#ffffff" }}>
              <h3 className="text-sm font-medium mb-3" style={{ color: "#6d74b5" }}>
                Informations
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: "#6d74b5" }}>Créée par</span>
                  <span style={{ color: "#1c2942" }}>
                    {collaboration.createdBy === "ecole" ? "École" : "Intervenant"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#6d74b5" }}>Créée le</span>
                  <span style={{ color: "#1c2942" }}>
                    {formatDate(collaboration.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
