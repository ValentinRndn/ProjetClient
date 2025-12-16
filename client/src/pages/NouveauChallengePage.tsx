/**
 * Page de création d'un nouveau challenge
 */
import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { createChallenge, THEMATIQUES } from "@/services/challenges";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import {
  Trophy,
  ArrowLeft,
  Save,
  FileText,
  Target,
  Users,
  Clock,
  Image,
  Video,
  Euro,
  Plus,
  X,
} from "lucide-react";

export default function NouveauChallengePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form data
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [thematique, setThematique] = useState("");
  const [duration, setDuration] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [objectives, setObjectives] = useState<string[]>([""]);
  const [deliverables, setDeliverables] = useState<string[]>([""]);
  const [prerequisites, setPrerequisites] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [priceCents, setPriceCents] = useState("");

  const addObjective = () => setObjectives([...objectives, ""]);
  const removeObjective = (index: number) => {
    if (objectives.length > 1) {
      setObjectives(objectives.filter((_, i) => i !== index));
    }
  };
  const updateObjective = (index: number, value: string) => {
    const newObjectives = [...objectives];
    newObjectives[index] = value;
    setObjectives(newObjectives);
  };

  const addDeliverable = () => setDeliverables([...deliverables, ""]);
  const removeDeliverable = (index: number) => {
    if (deliverables.length > 1) {
      setDeliverables(deliverables.filter((_, i) => i !== index));
    }
  };
  const updateDeliverable = (index: number, value: string) => {
    const newDeliverables = [...deliverables];
    newDeliverables[index] = value;
    setDeliverables(newDeliverables);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Le titre est requis");
      return;
    }

    if (!description.trim()) {
      setError("La description est requise");
      return;
    }

    if (!thematique) {
      setError("Veuillez sélectionner une thématique");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const data = {
        title: title.trim(),
        description: description.trim(),
        shortDescription: shortDescription.trim() || undefined,
        thematique,
        duration: duration.trim() || undefined,
        targetAudience: targetAudience.trim() || undefined,
        objectives: objectives.filter((o) => o.trim()),
        deliverables: deliverables.filter((d) => d.trim()),
        prerequisites: prerequisites.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
        videoUrl: videoUrl.trim() || undefined,
        priceCents: priceCents ? Math.round(parseFloat(priceCents) * 100) : undefined,
      };

      await createChallenge(data);
      navigate("/mes-challenges");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors de la création";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#ebf2fa", minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{ backgroundColor: "#28303a", minHeight: "150px" }}
        className="flex items-center"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
          <Link
            to="/mes-challenges"
            className="inline-flex items-center gap-2 text-sm mb-3 transition-colors hover:opacity-80"
            style={{ color: "rgba(219, 186, 207, 0.7)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux challenges
          </Link>

          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "#dbbacf" }}
            >
              <Trophy className="w-6 h-6 text-[#28303a]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Nouveau Challenge</h1>
              <p className="text-sm" style={{ color: "rgba(219, 186, 207, 0.7)" }}>
                Créez un challenge pédagogique à proposer aux écoles
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Info box */}
        <div className="bg-[#dbbacf]/20 border border-[#dbbacf]/30 rounded-xl p-4 mb-6">
          <p className="text-sm text-[#28303a]">
            <strong>Note :</strong> Votre challenge sera soumis à validation par notre équipe
            avant d'être visible par les écoles. Vous serez notifié dès qu'il sera approuvé.
          </p>
        </div>

        {error && (
          <Alert type="error" className="mb-6" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations principales */}
          <div className="bg-white rounded-xl p-6">
            <h2 className="text-lg font-bold text-[#1c2942] mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#6d74b5]" />
              Informations principales
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1c2942] mb-2">
                  Titre du challenge *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Challenge Innovation IA"
                  className="w-full px-4 py-3 border border-[#ebf2fa] rounded-xl focus:ring-2 focus:ring-[#6d74b5] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1c2942] mb-2">
                  Thématique *
                </label>
                <select
                  value={thematique}
                  onChange={(e) => setThematique(e.target.value)}
                  className="w-full px-4 py-3 border border-[#ebf2fa] rounded-xl focus:ring-2 focus:ring-[#6d74b5] focus:border-transparent"
                  required
                >
                  <option value="">Sélectionner une thématique</option>
                  {THEMATIQUES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1c2942] mb-2">
                  Description courte
                </label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Résumé en une phrase (pour les aperçus)"
                  className="w-full px-4 py-3 border border-[#ebf2fa] rounded-xl focus:ring-2 focus:ring-[#6d74b5] focus:border-transparent"
                  maxLength={200}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1c2942] mb-2">
                  Description complète *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  placeholder="Décrivez votre challenge en détail..."
                  className="w-full px-4 py-3 border border-[#ebf2fa] rounded-xl focus:ring-2 focus:ring-[#6d74b5] focus:border-transparent resize-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Détails du challenge */}
          <div className="bg-white rounded-xl p-6">
            <h2 className="text-lg font-bold text-[#1c2942] mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-[#6d74b5]" />
              Détails du challenge
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-[#1c2942] mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Durée
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Ex: 2 jours, 1 semaine"
                  className="w-full px-4 py-3 border border-[#ebf2fa] rounded-xl focus:ring-2 focus:ring-[#6d74b5] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1c2942] mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Public cible
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="Ex: Étudiants en marketing"
                  className="w-full px-4 py-3 border border-[#ebf2fa] rounded-xl focus:ring-2 focus:ring-[#6d74b5] focus:border-transparent"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-[#1c2942] mb-2">
                Prérequis
              </label>
              <textarea
                value={prerequisites}
                onChange={(e) => setPrerequisites(e.target.value)}
                rows={2}
                placeholder="Compétences ou connaissances préalables nécessaires..."
                className="w-full px-4 py-3 border border-[#ebf2fa] rounded-xl focus:ring-2 focus:ring-[#6d74b5] focus:border-transparent resize-none"
              />
            </div>

            {/* Objectifs */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#1c2942] mb-2">
                Objectifs pédagogiques
              </label>
              <div className="space-y-2">
                {objectives.map((obj, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={obj}
                      onChange={(e) => updateObjective(index, e.target.value)}
                      placeholder={`Objectif ${index + 1}`}
                      className="flex-1 px-4 py-2 border border-[#ebf2fa] rounded-xl focus:ring-2 focus:ring-[#6d74b5] focus:border-transparent"
                    />
                    {objectives.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeObjective(index)}
                        className="text-red-500 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addObjective}
                className="mt-2 text-[#6d74b5]"
              >
                <Plus className="w-4 h-4" />
                Ajouter un objectif
              </Button>
            </div>

            {/* Livrables */}
            <div>
              <label className="block text-sm font-medium text-[#1c2942] mb-2">
                Livrables attendus
              </label>
              <div className="space-y-2">
                {deliverables.map((del, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={del}
                      onChange={(e) => updateDeliverable(index, e.target.value)}
                      placeholder={`Livrable ${index + 1}`}
                      className="flex-1 px-4 py-2 border border-[#ebf2fa] rounded-xl focus:ring-2 focus:ring-[#6d74b5] focus:border-transparent"
                    />
                    {deliverables.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDeliverable(index)}
                        className="text-red-500 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addDeliverable}
                className="mt-2 text-[#6d74b5]"
              >
                <Plus className="w-4 h-4" />
                Ajouter un livrable
              </Button>
            </div>
          </div>

          {/* Médias et tarification */}
          <div className="bg-white rounded-xl p-6">
            <h2 className="text-lg font-bold text-[#1c2942] mb-4 flex items-center gap-2">
              <Image className="w-5 h-5 text-[#6d74b5]" />
              Médias et tarification
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1c2942] mb-2">
                  <Image className="w-4 h-4 inline mr-1" />
                  URL de l'image de couverture
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-3 border border-[#ebf2fa] rounded-xl focus:ring-2 focus:ring-[#6d74b5] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1c2942] mb-2">
                  <Video className="w-4 h-4 inline mr-1" />
                  URL de la vidéo de présentation
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/... ou https://vimeo.com/..."
                  className="w-full px-4 py-3 border border-[#ebf2fa] rounded-xl focus:ring-2 focus:ring-[#6d74b5] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1c2942] mb-2">
                  <Euro className="w-4 h-4 inline mr-1" />
                  Tarif indicatif (€)
                </label>
                <input
                  type="number"
                  value={priceCents}
                  onChange={(e) => setPriceCents(e.target.value)}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-[#ebf2fa] rounded-xl focus:ring-2 focus:ring-[#6d74b5] focus:border-transparent"
                />
                <p className="text-xs text-[#1c2942]/50 mt-1">
                  Laissez vide si le tarif est sur devis
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Link to="/mes-challenges">
              <Button type="button" variant="secondary">
                Annuler
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#6d74b5] hover:bg-[#5a61a0]"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Création...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Soumettre le challenge
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
