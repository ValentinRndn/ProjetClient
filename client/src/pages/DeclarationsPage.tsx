import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Input } from "@/components/ui/Input";
import {
  getDeclarations,
  createDeclaration,
  updateDeclaration,
  deleteDeclaration,
  validerDeclaration,
  formatMontant,
  formatPeriode,
  generatePeriodes,
  type Declaration,
  type DeclarationTotaux,
} from "@/services/declarations";
import {
  FileText,
  Plus,
  Euro,
  Calendar,
  Clock,
  Briefcase,
  CheckCircle,
  Edit3,
  Trash2,
  Save,
  X,
  ArrowLeft,
  TrendingUp,
  Calculator,
  AlertCircle,
} from "lucide-react";

export default function DeclarationsPage() {
  const [declarations, setDeclarations] = useState<Declaration[]>([]);
  const [totaux, setTotaux] = useState<DeclarationTotaux | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    periode: "",
    chiffreAffaires: "",
    nbMissions: "",
    nbHeures: "",
    fraisPro: "",
    notes: "",
  });

  const [selectedAnnee, setSelectedAnnee] = useState(new Date().getFullYear());
  const periodes = generatePeriodes(24);

  useEffect(() => {
    fetchDeclarations();
  }, [selectedAnnee]);

  const fetchDeclarations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getDeclarations(selectedAnnee, undefined, 1, 100);
      setDeclarations(response.data || []);
      setTotaux(response.totaux);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des déclarations";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const data = {
        periode: formData.periode,
        chiffreAffaires: Math.round(parseFloat(formData.chiffreAffaires || "0") * 100),
        nbMissions: parseInt(formData.nbMissions || "0"),
        nbHeures: parseInt(formData.nbHeures || "0"),
        fraisPro: Math.round(parseFloat(formData.fraisPro || "0") * 100),
        notes: formData.notes,
      };

      if (editingId) {
        await updateDeclaration(editingId, data);
        setSuccess("Déclaration mise à jour avec succès");
      } else {
        await createDeclaration(data);
        setSuccess("Déclaration créée avec succès");
      }

      resetForm();
      fetchDeclarations();
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Erreur lors de l'enregistrement";
      setError(errorMessage || "Erreur lors de l'enregistrement");
    }
  };

  const handleEdit = (declaration: Declaration) => {
    setEditingId(declaration.id);
    setFormData({
      periode: declaration.periode,
      chiffreAffaires: String(declaration.chiffreAffaires / 100),
      nbMissions: String(declaration.nbMissions),
      nbHeures: String(declaration.nbHeures),
      fraisPro: String(declaration.fraisPro / 100),
      notes: declaration.notes || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette déclaration ?")) return;

    try {
      await deleteDeclaration(id);
      setSuccess("Déclaration supprimée");
      fetchDeclarations();
    } catch (err) {
      setError("Erreur lors de la suppression");
    }
  };

  const handleValider = async (id: string) => {
    if (!confirm("Valider cette déclaration ? Elle ne pourra plus être supprimée.")) return;

    try {
      await validerDeclaration(id);
      setSuccess("Déclaration validée avec succès");
      fetchDeclarations();
    } catch (err) {
      setError("Erreur lors de la validation");
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      periode: "",
      chiffreAffaires: "",
      nbMissions: "",
      nbHeures: "",
      fraisPro: "",
      notes: "",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "validee":
        return (
          <span
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: "#d1fae5", color: "#065f46" }}
          >
            <CheckCircle className="w-3 h-3" />
            Validée
          </span>
        );
      case "transmise":
        return (
          <span
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: "#dbeafe", color: "#1e40af" }}
          >
            <CheckCircle className="w-3 h-3" />
            Transmise
          </span>
        );
      default:
        return (
          <span
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: "#fef3c7", color: "#92400e" }}
          >
            <Edit3 className="w-3 h-3" />
            Brouillon
          </span>
        );
    }
  };

  const estimatedCotisations = formData.chiffreAffaires
    ? Math.round(parseFloat(formData.chiffreAffaires) * 0.22 * 100) / 100
    : 0;

  return (
    <div style={{ backgroundColor: "#ebf2fa", minHeight: "100vh" }}>
      {/* Header avec bannière */}
      <div style={{ backgroundColor: "#1c2942", minHeight: "150px" }} className="flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
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
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Mes Déclarations</h1>
                <p className="text-sm" style={{ color: "rgba(235, 242, 250, 0.7)" }}>
                  Gérez vos déclarations d'activité URSSAF
                </p>
              </div>
            </div>

            <Button
              onClick={() => setShowForm(true)}
              className="bg-[#6d74b5] hover:bg-[#5a61a0]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle déclaration
            </Button>
          </div>

          {/* Stats inline */}
          {totaux && (
            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-white/20">
              <div
                className="px-3 py-1.5 rounded-lg"
                style={{ backgroundColor: "rgba(16, 185, 129, 0.2)" }}
              >
                <Euro className="w-4 h-4 inline mr-1" style={{ color: "#10b981" }} />
                <span className="font-bold" style={{ color: "#10b981" }}>
                  {formatMontant(totaux.chiffreAffaires)}
                </span>
                <span className="text-sm ml-2" style={{ color: "#10b981" }}>
                  CA {totaux.annee}
                </span>
              </div>
              <div
                className="px-3 py-1.5 rounded-lg"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              >
                <Briefcase className="w-4 h-4 inline mr-1" style={{ color: "rgba(235, 242, 250, 0.7)" }} />
                <span className="font-bold text-white">{totaux.nbMissions}</span>
                <span className="text-sm ml-2" style={{ color: "rgba(235, 242, 250, 0.7)" }}>
                  Missions
                </span>
              </div>
              <div
                className="px-3 py-1.5 rounded-lg"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              >
                <Clock className="w-4 h-4 inline mr-1" style={{ color: "rgba(235, 242, 250, 0.7)" }} />
                <span className="font-bold text-white">{totaux.nbHeures}h</span>
                <span className="text-sm ml-2" style={{ color: "rgba(235, 242, 250, 0.7)" }}>
                  Heures
                </span>
              </div>
              <div
                className="px-3 py-1.5 rounded-lg"
                style={{ backgroundColor: "rgba(239, 68, 68, 0.2)" }}
              >
                <TrendingUp className="w-4 h-4 inline mr-1" style={{ color: "#f87171" }} />
                <span className="font-bold" style={{ color: "#f87171" }}>
                  {formatMontant(totaux.cotisationsSociales + totaux.contributionFormation)}
                </span>
                <span className="text-sm ml-2" style={{ color: "#f87171" }}>
                  Cotisations
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Messages */}
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

        {/* Formulaire */}
        {showForm && (
          <div className="mb-8 rounded-xl p-6" style={{ backgroundColor: "#ffffff" }}>
            <h2 className="text-xl font-bold mb-6" style={{ color: "#1c2942" }}>
              {editingId ? "Modifier la déclaration" : "Nouvelle déclaration"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#1c2942" }}>
                    Période <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <select
                    value={formData.periode}
                    onChange={(e) =>
                      setFormData({ ...formData, periode: e.target.value })
                    }
                    required
                    disabled={!!editingId}
                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2"
                    style={{ borderColor: "#ebf2fa" }}
                  >
                    <option value="">Sélectionner une période</option>
                    {periodes.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#1c2942" }}>
                    Chiffre d'affaires (€)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.chiffreAffaires}
                    onChange={(e) =>
                      setFormData({ ...formData, chiffreAffaires: e.target.value })
                    }
                    placeholder="0.00"
                    style={{ borderColor: "#ebf2fa" }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#1c2942" }}>
                    Nombre de missions
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.nbMissions}
                    onChange={(e) =>
                      setFormData({ ...formData, nbMissions: e.target.value })
                    }
                    placeholder="0"
                    style={{ borderColor: "#ebf2fa" }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#1c2942" }}>
                    Nombre d'heures
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.nbHeures}
                    onChange={(e) =>
                      setFormData({ ...formData, nbHeures: e.target.value })
                    }
                    placeholder="0"
                    style={{ borderColor: "#ebf2fa" }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#1c2942" }}>
                    Frais professionnels (€)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.fraisPro}
                    onChange={(e) =>
                      setFormData({ ...formData, fraisPro: e.target.value })
                    }
                    placeholder="0.00"
                    style={{ borderColor: "#ebf2fa" }}
                  />
                </div>

                <div className="lg:col-span-3">
                  <label className="block text-sm font-medium mb-2" style={{ color: "#1c2942" }}>
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    rows={2}
                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 resize-none"
                    style={{ borderColor: "#ebf2fa" }}
                    placeholder="Notes personnelles..."
                  />
                </div>
              </div>

              {/* Estimation des cotisations */}
              {formData.chiffreAffaires && parseFloat(formData.chiffreAffaires) > 0 && (
                <div
                  className="rounded-xl p-4"
                  style={{ backgroundColor: "#fef3c7", border: "1px solid #fcd34d" }}
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 mt-0.5" style={{ color: "#d97706" }} />
                    <div>
                      <p className="font-medium" style={{ color: "#92400e" }}>
                        Cotisations estimées : {formatMontant(estimatedCotisations * 100)}
                      </p>
                      <p className="text-sm mt-1" style={{ color: "#a16207" }}>
                        Basé sur le taux de 22% pour les prestations de services (auto-entrepreneur).
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button type="submit" variant="primary" className="bg-[#6d74b5] hover:bg-[#5a61a0]">
                  <Save className="w-4 h-4 mr-2" />
                  {editingId ? "Mettre à jour" : "Enregistrer"}
                </Button>
                <Button type="button" variant="secondary" onClick={resetForm} style={{ borderColor: "#ebf2fa" }}>
                  <X className="w-4 h-4 mr-2" />
                  Annuler
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Filtre par année */}
        <div
          className="flex items-center gap-4 mb-6 p-4 rounded-xl"
          style={{ backgroundColor: "#ffffff" }}
        >
          <label className="text-sm font-medium" style={{ color: "#1c2942" }}>Année :</label>
          <select
            value={selectedAnnee}
            onChange={(e) => setSelectedAnnee(Number(e.target.value))}
            className="px-4 py-2 border rounded-xl focus:outline-none focus:ring-2"
            style={{ borderColor: "#ebf2fa" }}
          >
            {[2024, 2025, 2026].map((annee) => (
              <option key={annee} value={annee}>
                {annee}
              </option>
            ))}
          </select>
        </div>

        {/* Liste des déclarations */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl p-6 animate-pulse"
                style={{ backgroundColor: "#ffffff" }}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="h-6 rounded w-32" style={{ backgroundColor: "#ebf2fa" }} />
                    <div className="h-4 rounded w-24" style={{ backgroundColor: "#ebf2fa" }} />
                  </div>
                  <div className="h-8 rounded w-24" style={{ backgroundColor: "#ebf2fa" }} />
                </div>
              </div>
            ))}
          </div>
        ) : declarations.length === 0 ? (
          <div
            className="rounded-xl p-12 text-center"
            style={{ backgroundColor: "#ffffff" }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: "#ebf2fa" }}
            >
              <FileText className="w-8 h-8" style={{ color: "#6d74b5" }} />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: "#1c2942" }}>
              Aucune déclaration
            </h3>
            <p className="mb-6" style={{ color: "#6d74b5" }}>
              Commencez par créer votre première déclaration d'activité.
            </p>
            <Button onClick={() => setShowForm(true)} variant="primary" className="bg-[#6d74b5] hover:bg-[#5a61a0]">
              <Plus className="w-4 h-4 mr-2" />
              Créer une déclaration
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {declarations.map((declaration) => (
              <div
                key={declaration.id}
                className="rounded-xl p-6"
                style={{ backgroundColor: "#ffffff" }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "#ebf2fa" }}
                    >
                      <Calendar className="w-6 h-6" style={{ color: "#6d74b5" }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-lg" style={{ color: "#1c2942" }}>
                          {formatPeriode(declaration.periode)}
                        </h3>
                        {getStatusBadge(declaration.status)}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm" style={{ color: "#6d74b5" }}>
                        <span className="flex items-center gap-1">
                          <Euro className="w-4 h-4" />
                          CA : {formatMontant(declaration.chiffreAffaires)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {declaration.nbMissions} missions
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {declaration.nbHeures}h
                        </span>
                      </div>
                      {declaration.cotisationsSociales > 0 && (
                        <p className="text-sm mt-1" style={{ color: "#dc2626" }}>
                          Cotisations : {formatMontant(declaration.cotisationsSociales + declaration.contributionFormation)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {declaration.status === "brouillon" && (
                      <>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleEdit(declaration)}
                          style={{ borderColor: "#ebf2fa" }}
                        >
                          <Edit3 className="w-4 h-4 mr-1" />
                          Modifier
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleValider(declaration.id)}
                          className="bg-emerald-500 hover:bg-emerald-600"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Valider
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleDelete(declaration.id)}
                          style={{ borderColor: "#fecaca", color: "#dc2626" }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
