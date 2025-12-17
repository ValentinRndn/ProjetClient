/**
 * Page admin de gestion des challenges
 * - Créer, éditer, supprimer des challenges
 * - Système de brouillon/publié
 */
import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  getAllChallenges,
  getChallengeStats,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  publishChallenge,
  unpublishChallenge,
  THEMATIQUES,
  type Challenge,
  type ChallengeStats,
  type CreateChallengeData,
} from "@/services/challenges";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import {
  Trophy,
  FileText,
  CheckCircle,
  Trash2,
  ArrowLeft,
  Eye,
  Users,
  Calendar,
  Filter,
  ChevronDown,
  ChevronUp,
  Plus,
  Pencil,
  X,
  Send,
  EyeOff,
} from "lucide-react";

interface ChallengeFormData extends CreateChallengeData {
  objectivesText: string;
  deliverablesText: string;
}

const emptyFormData: ChallengeFormData = {
  title: "",
  description: "",
  shortDescription: "",
  thematique: "",
  duration: "",
  targetAudience: "",
  objectives: [],
  deliverables: [],
  prerequisites: "",
  imageUrl: "",
  videoUrl: "",
  priceCents: undefined,
  objectivesText: "",
  deliverablesText: "",
};

export default function AdminChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [stats, setStats] = useState<ChallengeStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [thematiqueFilter, setThematiqueFilter] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // États pour le formulaire
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ChallengeFormData>(emptyFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [statusFilter, thematiqueFilter]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [challengesData, statsData] = await Promise.all([
        getAllChallenges({
          status: statusFilter || undefined,
          thematique: thematiqueFilter || undefined,
        }),
        getChallengeStats(),
      ]);
      setChallenges(challengesData);
      setStats(statsData);
    } catch (err) {
      setError("Erreur lors du chargement des challenges");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreateForm = () => {
    setFormData(emptyFormData);
    setEditingId(null);
    setShowForm(true);
  };

  const handleOpenEditForm = (challenge: Challenge) => {
    setFormData({
      title: challenge.title,
      description: challenge.description,
      shortDescription: challenge.shortDescription || "",
      thematique: challenge.thematique,
      duration: challenge.duration || "",
      targetAudience: challenge.targetAudience || "",
      objectives: challenge.objectives || [],
      deliverables: challenge.deliverables || [],
      prerequisites: challenge.prerequisites || "",
      imageUrl: challenge.imageUrl || "",
      videoUrl: challenge.videoUrl || "",
      priceCents: challenge.priceCents,
      objectivesText: (challenge.objectives || []).join("\n"),
      deliverablesText: (challenge.deliverables || []).join("\n"),
    });
    setEditingId(challenge.id);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyFormData);
  };

  const handleSubmit = async (asDraft: boolean) => {
    if (!formData.title.trim() || !formData.description.trim() || !formData.thematique) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsSubmitting(true);
    try {
      const data: CreateChallengeData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        shortDescription: formData.shortDescription?.trim() || undefined,
        thematique: formData.thematique,
        duration: formData.duration?.trim() || undefined,
        targetAudience: formData.targetAudience?.trim() || undefined,
        objectives: formData.objectivesText
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        deliverables: formData.deliverablesText
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        prerequisites: formData.prerequisites?.trim() || undefined,
        imageUrl: formData.imageUrl?.trim() || undefined,
        videoUrl: formData.videoUrl?.trim() || undefined,
        priceCents: formData.priceCents,
        status: asDraft ? "draft" : "published",
      };

      if (editingId) {
        await updateChallenge(editingId, data);
        setSuccessMessage("Challenge mis à jour avec succès");
      } else {
        await createChallenge(data);
        setSuccessMessage(
          asDraft ? "Brouillon enregistré avec succès" : "Challenge publié avec succès"
        );
      }

      handleCloseForm();
      fetchData();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError("Erreur lors de l'enregistrement du challenge");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await publishChallenge(id);
      setChallenges(
        challenges.map((c) => (c.id === id ? { ...c, status: "published" as const } : c))
      );
      setStats(stats ? { ...stats, draft: stats.draft - 1, published: stats.published + 1 } : null);
      setSuccessMessage("Challenge publié avec succès");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError("Erreur lors de la publication");
    }
  };

  const handleUnpublish = async (id: string) => {
    try {
      await unpublishChallenge(id);
      setChallenges(
        challenges.map((c) => (c.id === id ? { ...c, status: "draft" as const } : c))
      );
      setStats(stats ? { ...stats, draft: stats.draft + 1, published: stats.published - 1 } : null);
      setSuccessMessage("Challenge dépublié (brouillon)");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError("Erreur lors de la dépublication");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce challenge ?")) {
      return;
    }

    try {
      await deleteChallenge(id);
      const deleted = challenges.find((c) => c.id === id);
      setChallenges(challenges.filter((c) => c.id !== id));
      if (stats && deleted) {
        const statusKey = deleted.status as "draft" | "published";
        setStats({
          ...stats,
          total: stats.total - 1,
          [statusKey]: stats[statusKey] - 1,
        });
      }
      setSuccessMessage("Challenge supprimé avec succès");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError("Erreur lors de la suppression");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
            <CheckCircle className="w-3.5 h-3.5" />
            Publié
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
            <FileText className="w-3.5 h-3.5" />
            Brouillon
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ backgroundColor: "#ebf2fa", minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{ backgroundColor: "#1c2942", minHeight: "150px" }}
        className="flex items-center"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
          <Link
            to="/dashboard/admin"
            className="inline-flex items-center gap-2 text-sm mb-3 transition-colors hover:opacity-80"
            style={{ color: "rgba(235, 242, 250, 0.7)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au dashboard
          </Link>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "#dbbacf" }}
              >
                <Trophy className="w-6 h-6 text-[#28303a]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Gestion des Challenges</h1>
                <p className="text-sm" style={{ color: "rgba(235, 242, 250, 0.7)" }}>
                  Créez et gérez les challenges pédagogiques
                </p>
              </div>
            </div>

            <Button
              onClick={handleOpenCreateForm}
              className="bg-[#dbbacf] text-[#1c2942] hover:bg-[#c9a4bc]"
            >
              <Plus className="w-4 h-4" />
              Nouveau challenge
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-2xl font-bold text-[#1c2942]">{stats.total}</p>
              <p className="text-sm text-[#1c2942]/60">Total</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-amber-400">
              <p className="text-2xl font-bold text-amber-600">{stats.draft}</p>
              <p className="text-sm text-[#1c2942]/60">Brouillons</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-emerald-400">
              <p className="text-2xl font-bold text-emerald-600">{stats.published}</p>
              <p className="text-sm text-[#1c2942]/60">Publiés</p>
            </div>
          </div>
        )}

        {/* Filtres */}
        <div className="bg-white rounded-xl p-4 mb-6 flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#6d74b5]" />
            <span className="text-sm font-medium text-[#1c2942]">Filtres :</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-[#ebf2fa] rounded-lg text-sm focus:ring-2 focus:ring-[#6d74b5]"
          >
            <option value="">Tous les statuts</option>
            <option value="draft">Brouillons</option>
            <option value="published">Publiés</option>
          </select>
          <select
            value={thematiqueFilter}
            onChange={(e) => setThematiqueFilter(e.target.value)}
            className="px-3 py-2 border border-[#ebf2fa] rounded-lg text-sm focus:ring-2 focus:ring-[#6d74b5]"
          >
            <option value="">Toutes les thématiques</option>
            {THEMATIQUES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Messages */}
        {error && (
          <Alert type="error" className="mb-6" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {successMessage && (
          <Alert type="success" className="mb-6" onClose={() => setSuccessMessage(null)}>
            {successMessage}
          </Alert>
        )}

        {/* Formulaire de création/édition */}
        {showForm && (
          <div className="bg-white rounded-xl p-6 mb-6 shadow-lg border-2 border-[#6d74b5]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#1c2942]">
                {editingId ? "Modifier le challenge" : "Nouveau challenge"}
              </h2>
              <button
                onClick={handleCloseForm}
                className="p-2 hover:bg-[#ebf2fa] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[#1c2942]/60" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Titre */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#1c2942] mb-1">
                  Titre *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-[#ebf2fa] rounded-lg focus:ring-2 focus:ring-[#6d74b5]"
                  placeholder="Ex: Challenge Marketing Digital"
                />
              </div>

              {/* Thématique */}
              <div>
                <label className="block text-sm font-medium text-[#1c2942] mb-1">
                  Thématique *
                </label>
                <select
                  value={formData.thematique}
                  onChange={(e) => setFormData({ ...formData, thematique: e.target.value })}
                  className="w-full px-4 py-2 border border-[#ebf2fa] rounded-lg focus:ring-2 focus:ring-[#6d74b5]"
                >
                  <option value="">Sélectionnez une thématique</option>
                  {THEMATIQUES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Durée */}
              <div>
                <label className="block text-sm font-medium text-[#1c2942] mb-1">Durée</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-4 py-2 border border-[#ebf2fa] rounded-lg focus:ring-2 focus:ring-[#6d74b5]"
                  placeholder="Ex: 2 jours, 1 semaine"
                />
              </div>

              {/* Public cible */}
              <div>
                <label className="block text-sm font-medium text-[#1c2942] mb-1">
                  Public cible
                </label>
                <input
                  type="text"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  className="w-full px-4 py-2 border border-[#ebf2fa] rounded-lg focus:ring-2 focus:ring-[#6d74b5]"
                  placeholder="Ex: Étudiants en marketing, BTS Commerce"
                />
              </div>

              {/* Prix */}
              <div>
                <label className="block text-sm font-medium text-[#1c2942] mb-1">
                  Prix (en euros)
                </label>
                <input
                  type="number"
                  value={formData.priceCents ? formData.priceCents / 100 : ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priceCents: e.target.value ? Math.round(parseFloat(e.target.value) * 100) : undefined,
                    })
                  }
                  className="w-full px-4 py-2 border border-[#ebf2fa] rounded-lg focus:ring-2 focus:ring-[#6d74b5]"
                  placeholder="Ex: 500"
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Description courte */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#1c2942] mb-1">
                  Description courte (pour les cartes)
                </label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-4 py-2 border border-[#ebf2fa] rounded-lg focus:ring-2 focus:ring-[#6d74b5]"
                  placeholder="Résumé en une phrase"
                  maxLength={200}
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#1c2942] mb-1">
                  Description complète *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-2 border border-[#ebf2fa] rounded-lg focus:ring-2 focus:ring-[#6d74b5] resize-none"
                  placeholder="Décrivez le challenge en détail..."
                />
              </div>

              {/* Objectifs */}
              <div>
                <label className="block text-sm font-medium text-[#1c2942] mb-1">
                  Objectifs pédagogiques (un par ligne)
                </label>
                <textarea
                  value={formData.objectivesText}
                  onChange={(e) => setFormData({ ...formData, objectivesText: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-[#ebf2fa] rounded-lg focus:ring-2 focus:ring-[#6d74b5] resize-none"
                  placeholder="Maîtriser les fondamentaux&#10;Développer des compétences pratiques&#10;..."
                />
              </div>

              {/* Livrables */}
              <div>
                <label className="block text-sm font-medium text-[#1c2942] mb-1">
                  Livrables attendus (un par ligne)
                </label>
                <textarea
                  value={formData.deliverablesText}
                  onChange={(e) => setFormData({ ...formData, deliverablesText: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-[#ebf2fa] rounded-lg focus:ring-2 focus:ring-[#6d74b5] resize-none"
                  placeholder="Rapport d'analyse&#10;Présentation orale&#10;..."
                />
              </div>

              {/* Prérequis */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#1c2942] mb-1">Prérequis</label>
                <input
                  type="text"
                  value={formData.prerequisites}
                  onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value })}
                  className="w-full px-4 py-2 border border-[#ebf2fa] rounded-lg focus:ring-2 focus:ring-[#6d74b5]"
                  placeholder="Ex: Connaissances de base en marketing"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-[#1c2942] mb-1">
                  URL de l'image
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-[#ebf2fa] rounded-lg focus:ring-2 focus:ring-[#6d74b5]"
                  placeholder="https://..."
                />
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-sm font-medium text-[#1c2942] mb-1">
                  URL de la vidéo
                </label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-[#ebf2fa] rounded-lg focus:ring-2 focus:ring-[#6d74b5]"
                  placeholder="https://youtube.com/..."
                />
              </div>
            </div>

            {/* Actions du formulaire */}
            <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-[#ebf2fa]">
              <Button
                onClick={() => handleSubmit(true)}
                disabled={isSubmitting}
                variant="outline"
              >
                <FileText className="w-4 h-4" />
                {isSubmitting ? "Enregistrement..." : "Enregistrer en brouillon"}
              </Button>
              <Button
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? "Publication..." : "Publier maintenant"}
              </Button>
              <Button onClick={handleCloseForm} variant="outline" className="ml-auto">
                Annuler
              </Button>
            </div>
          </div>
        )}

        {/* Liste des challenges */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : challenges.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl">
            <div className="w-16 h-16 bg-[#ebf2fa] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-[#6d74b5]" />
            </div>
            <h3 className="text-lg font-semibold text-[#1c2942] mb-2">Aucun challenge trouvé</h3>
            <p className="text-[#1c2942]/60 mb-6">
              {statusFilter || thematiqueFilter
                ? "Aucun challenge ne correspond aux filtres sélectionnés."
                : "Commencez par créer votre premier challenge."}
            </p>
            {!showForm && (
              <Button onClick={handleOpenCreateForm}>
                <Plus className="w-4 h-4" />
                Créer un challenge
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {challenges.map((challenge) => (
              <div key={challenge.id} className="bg-white rounded-xl overflow-hidden shadow-sm">
                {/* Header de la carte */}
                <div
                  className="p-6 cursor-pointer hover:bg-[#ebf2fa]/30 transition-colors"
                  onClick={() => setExpandedId(expandedId === challenge.id ? null : challenge.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-[#1c2942]">{challenge.title}</h3>
                        {getStatusBadge(challenge.status)}
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-[#1c2942]/60">
                        <span className="px-2 py-0.5 bg-[#ebf2fa] text-[#6d74b5] rounded-full text-xs font-medium">
                          {challenge.thematique}
                        </span>
                        {challenge.duration && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {challenge.duration}
                          </span>
                        )}
                        {challenge.targetAudience && (
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {challenge.targetAudience}
                          </span>
                        )}
                      </div>
                    </div>

                    {expandedId === challenge.id ? (
                      <ChevronUp className="w-5 h-5 text-[#1c2942]/40" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#1c2942]/40" />
                    )}
                  </div>
                </div>

                {/* Contenu étendu */}
                {expandedId === challenge.id && (
                  <div className="px-6 pb-6 border-t border-[#ebf2fa]">
                    <div className="pt-4 space-y-4">
                      {/* Description courte */}
                      {challenge.shortDescription && (
                        <div>
                          <h4 className="text-sm font-semibold text-[#1c2942] mb-2">
                            Description courte
                          </h4>
                          <p className="text-sm text-[#1c2942]/70">{challenge.shortDescription}</p>
                        </div>
                      )}

                      {/* Description */}
                      <div>
                        <h4 className="text-sm font-semibold text-[#1c2942] mb-2">Description</h4>
                        <p className="text-sm text-[#1c2942]/70 whitespace-pre-wrap">
                          {challenge.description}
                        </p>
                      </div>

                      {/* Objectifs */}
                      {challenge.objectives && challenge.objectives.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-[#1c2942] mb-2">Objectifs</h4>
                          <ul className="list-disc list-inside text-sm text-[#1c2942]/70 space-y-1">
                            {challenge.objectives.map((obj, i) => (
                              <li key={i}>{obj}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Livrables */}
                      {challenge.deliverables && challenge.deliverables.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-[#1c2942] mb-2">Livrables</h4>
                          <ul className="list-disc list-inside text-sm text-[#1c2942]/70 space-y-1">
                            {challenge.deliverables.map((del, i) => (
                              <li key={i}>{del}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-[#ebf2fa]">
                        <Button size="sm" variant="outline" onClick={() => handleOpenEditForm(challenge)}>
                          <Pencil className="w-4 h-4" />
                          Modifier
                        </Button>

                        {challenge.status === "draft" && (
                          <Button
                            size="sm"
                            onClick={() => handlePublish(challenge.id)}
                            className="bg-emerald-600 hover:bg-emerald-700"
                          >
                            <Send className="w-4 h-4" />
                            Publier
                          </Button>
                        )}

                        {challenge.status === "published" && (
                          <>
                            <Link to={`/tous-les-challenges`}>
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                                Voir en ligne
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUnpublish(challenge.id)}
                              className="text-amber-600 border-amber-200 hover:bg-amber-50"
                            >
                              <EyeOff className="w-4 h-4" />
                              Dépublier
                            </Button>
                          </>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(challenge.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
