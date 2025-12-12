import { useEffect, useState } from "react";
import { Link } from "react-router";
import { PageContainer } from "@/components/ui/PageContainer";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
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
import { motion, AnimatePresence } from "motion/react";

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
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            Validée
          </span>
        );
      case "transmise":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            Transmise
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
            <Edit3 className="w-3 h-3" />
            Brouillon
          </span>
        );
    }
  };

  // Calculer les cotisations estimées en temps réel
  const estimatedCotisations = formData.chiffreAffaires
    ? Math.round(parseFloat(formData.chiffreAffaires) * 0.22 * 100) / 100
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-mesh">
        <PageContainer maxWidth="7xl" className="py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/dashboard/intervenant"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour au tableau de bord
            </Link>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="text-white">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-4">
                  <Calculator className="w-4 h-4 text-amber-300" />
                  <span className="text-sm font-medium">Déclarations URSSAF</span>
                </div>

                <h1 className="text-4xl font-extrabold mb-2">
                  Mes déclarations d'activité
                </h1>
                <p className="text-lg text-indigo-100/80">
                  Gérez vos déclarations mensuelles et suivez vos cotisations
                </p>
              </div>

              <Button
                onClick={() => setShowForm(true)}
                className="bg-white text-indigo-600 hover:bg-indigo-50"
              >
                <Plus className="w-5 h-5" />
                Nouvelle déclaration
              </Button>
            </div>

            {/* Totaux de l'année */}
            {totaux && (
              <div className="flex flex-wrap gap-4 mt-8">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4">
                  <div className="flex items-center gap-2 text-amber-300 mb-1">
                    <Euro className="w-5 h-5" />
                    <span className="text-2xl font-bold">
                      {formatMontant(totaux.chiffreAffaires)}
                    </span>
                  </div>
                  <span className="text-sm text-indigo-100/70">CA {totaux.annee}</span>
                </div>

                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4">
                  <div className="flex items-center gap-2 text-amber-300 mb-1">
                    <Briefcase className="w-5 h-5" />
                    <span className="text-2xl font-bold">{totaux.nbMissions}</span>
                  </div>
                  <span className="text-sm text-indigo-100/70">Missions</span>
                </div>

                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4">
                  <div className="flex items-center gap-2 text-amber-300 mb-1">
                    <Clock className="w-5 h-5" />
                    <span className="text-2xl font-bold">{totaux.nbHeures}h</span>
                  </div>
                  <span className="text-sm text-indigo-100/70">Heures</span>
                </div>

                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4">
                  <div className="flex items-center gap-2 text-rose-300 mb-1">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-2xl font-bold">
                      {formatMontant(totaux.cotisationsSociales + totaux.contributionFormation)}
                    </span>
                  </div>
                  <span className="text-sm text-indigo-100/70">Cotisations</span>
                </div>
              </div>
            )}
          </motion.div>
        </PageContainer>
      </div>

      <PageContainer maxWidth="7xl" className="py-8 -mt-8">
        {/* Messages */}
        {error && (
          <Alert type="error" className="mb-6" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert type="success" className="mb-6" onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        {/* Formulaire */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  {editingId ? "Modifier la déclaration" : "Nouvelle déclaration"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Période <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.periode}
                        onChange={(e) =>
                          setFormData({ ...formData, periode: e.target.value })
                        }
                        required
                        disabled={!!editingId}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      />
                    </div>

                    <div className="lg:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) =>
                          setFormData({ ...formData, notes: e.target.value })
                        }
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                        placeholder="Notes personnelles..."
                      />
                    </div>
                  </div>

                  {/* Estimation des cotisations */}
                  {formData.chiffreAffaires && parseFloat(formData.chiffreAffaires) > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-amber-800">
                            Cotisations estimées : {formatMontant(estimatedCotisations * 100)}
                          </p>
                          <p className="text-sm text-amber-700 mt-1">
                            Basé sur le taux de 22% pour les prestations de services (auto-entrepreneur).
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button type="submit" variant="primary">
                      <Save className="w-4 h-4" />
                      {editingId ? "Mettre à jour" : "Enregistrer"}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      <X className="w-4 h-4" />
                      Annuler
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filtre par année */}
        <div className="flex items-center gap-4 mb-6">
          <label className="text-sm font-medium text-gray-700">Année :</label>
          <select
            value={selectedAnnee}
            onChange={(e) => setSelectedAnnee(Number(e.target.value))}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded w-32" />
                    <div className="h-4 bg-gray-200 rounded w-24" />
                  </div>
                  <div className="h-8 bg-gray-200 rounded w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : declarations.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Aucune déclaration
            </h3>
            <p className="text-gray-500 mb-6">
              Commencez par créer votre première déclaration d'activité.
            </p>
            <Button onClick={() => setShowForm(true)} variant="primary">
              <Plus className="w-4 h-4" />
              Créer une déclaration
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {declarations.map((declaration, index) => (
              <motion.div
                key={declaration.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                        <Calendar className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-lg text-gray-900">
                            {formatPeriode(declaration.periode)}
                          </h3>
                          {getStatusBadge(declaration.status)}
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
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
                          <p className="text-sm text-rose-600 mt-1">
                            Cotisations : {formatMontant(declaration.cotisationsSociales + declaration.contributionFormation)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {declaration.status === "brouillon" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(declaration)}
                          >
                            <Edit3 className="w-4 h-4" />
                            Modifier
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleValider(declaration.id)}
                          >
                            <CheckCircle className="w-4 h-4" />
                            Valider
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-rose-600 border-rose-200 hover:bg-rose-50"
                            onClick={() => handleDelete(declaration.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </PageContainer>
    </div>
  );
}
