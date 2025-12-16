import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { PageContainer } from "@/components/ui/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Search,
  Filter,
  Users,
  Clock,
  ChevronRight,
  X,
  Trophy,
  Zap,
  Target,
  Lightbulb,
  CheckCircle,
  User,
  MapPin,
} from "lucide-react";
import {
  getPublicChallenges,
  THEMATIQUES,
  type Challenge,
} from "@/services/challenges";

// Composant ChallengeCard
function ChallengeCard({
  challenge,
  onSelect,
}: {
  challenge: Challenge;
  onSelect: (challenge: Challenge) => void;
}) {
  const getThematiqueColor = (thematique: string) => {
    const colors: Record<string, string> = {
      Marketing: "bg-orange-100 text-orange-800",
      "Intelligences artificielles": "bg-indigo-100 text-indigo-800",
      RSE: "bg-emerald-100 text-emerald-800",
      Communication: "bg-blue-100 text-blue-800",
      Entrepreneuriat: "bg-amber-100 text-amber-800",
      Digital: "bg-cyan-100 text-cyan-800",
      "Créativité": "bg-pink-100 text-pink-800",
      Art: "bg-purple-100 text-purple-800",
      "Langues étrangères": "bg-teal-100 text-teal-800",
      Finance: "bg-green-100 text-green-800",
    };
    return colors[thematique] || "bg-gray-100 text-gray-800";
  };

  const intervenantName = challenge.intervenant
    ? `${challenge.intervenant.firstName || ""} ${challenge.intervenant.lastName || ""}`.trim() ||
      challenge.intervenant.user?.email?.split("@")[0]
    : "Intervenant";

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      {/* Image de couverture ou header coloré */}
      {challenge.imageUrl ? (
        <div className="relative h-48">
          <img
            src={challenge.imageUrl}
            alt={challenge.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c2942] to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-xl font-bold text-white">{challenge.title}</h3>
          </div>
        </div>
      ) : (
        <div className="bg-[#1c2942] p-6 text-white">
          <h3 className="text-xl font-bold mb-3">{challenge.title}</h3>
        </div>
      )}

      <div className="p-6 flex-grow flex flex-col">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${getThematiqueColor(challenge.thematique)}`}
          >
            {challenge.thematique}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
          {challenge.shortDescription || challenge.description}
        </p>

        {/* Infos */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
          {challenge.duration && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{challenge.duration}</span>
            </div>
          )}
          {challenge.targetAudience && (
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{challenge.targetAudience}</span>
            </div>
          )}
        </div>

        {/* Intervenant */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
          <div className="w-8 h-8 rounded-full bg-[#ebf2fa] flex items-center justify-center">
            {challenge.intervenant?.profileImage ? (
              <img
                src={challenge.intervenant.profileImage}
                alt={intervenantName}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <User className="w-4 h-4 text-[#6d74b5]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-[#1c2942] truncate">{intervenantName}</p>
            {challenge.intervenant?.city && (
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {challenge.intervenant.city}
              </p>
            )}
          </div>
        </div>

        {/* Prix si défini */}
        {challenge.priceCents && (
          <div className="text-lg font-bold text-[#6d74b5] mb-4">
            {(challenge.priceCents / 100).toLocaleString("fr-FR")} €
          </div>
        )}

        <Button
          variant="primary"
          className="w-full bg-[#6d74b5] hover:bg-[#5a61a0]"
          onClick={() => onSelect(challenge)}
        >
          Voir le Challenge
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </Card>
  );
}

// Modal de détail
function ChallengeModal({
  challenge,
  onClose,
  onContact,
}: {
  challenge: Challenge;
  onClose: () => void;
  onContact: () => void;
}) {
  const intervenantName = challenge.intervenant
    ? `${challenge.intervenant.firstName || ""} ${challenge.intervenant.lastName || ""}`.trim() ||
      challenge.intervenant.user?.email?.split("@")[0]
    : "Intervenant";

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#1c2942] text-white p-8 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-[#6d74b5] transition-colors p-2 rounded-full hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-3xl font-bold mb-4 pr-8">{challenge.title}</h2>
          <div className="flex flex-wrap gap-2">
            <span className="px-4 py-2 bg-[#6d74b5] text-white rounded-full text-sm font-semibold">
              {challenge.thematique}
            </span>
          </div>
        </div>

        <div className="p-8">
          {/* Description */}
          <p className="text-gray-700 text-lg leading-relaxed mb-6 whitespace-pre-wrap">
            {challenge.description}
          </p>

          {/* Infos */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {challenge.duration && (
              <div className="bg-[#ebf2fa] rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">Durée</span>
                </div>
                <p className="text-xl font-bold text-[#1c2942]">
                  {challenge.duration}
                </p>
              </div>
            )}
            {challenge.targetAudience && (
              <div className="bg-[#ebf2fa] rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Users className="w-5 h-5" />
                  <span className="font-medium">Public cible</span>
                </div>
                <p className="text-xl font-bold text-[#1c2942]">
                  {challenge.targetAudience}
                </p>
              </div>
            )}
          </div>

          {/* Objectifs */}
          {challenge.objectives && challenge.objectives.length > 0 && (
            <div className="bg-[#fdf1f7] rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-[#1c2942] mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-[#6d74b5]" />
                Objectifs pédagogiques
              </h4>
              <ul className="space-y-2 text-gray-700">
                {challenge.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-1 text-green-600 flex-shrink-0" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Livrables */}
          {challenge.deliverables && challenge.deliverables.length > 0 && (
            <div className="bg-[#ebf2fa] rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-[#1c2942] mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#6d74b5]" />
                Livrables attendus
              </h4>
              <ul className="space-y-2 text-gray-700">
                {challenge.deliverables.map((del, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 mt-1 text-[#6d74b5] flex-shrink-0" />
                    <span>{del}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Prérequis */}
          {challenge.prerequisites && (
            <div className="bg-amber-50 rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-[#1c2942] mb-2">Prérequis</h4>
              <p className="text-gray-700">{challenge.prerequisites}</p>
            </div>
          )}

          {/* Intervenant */}
          <div className="border border-gray-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-[#1c2942] mb-3">Proposé par</h4>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#ebf2fa] flex items-center justify-center">
                {challenge.intervenant?.profileImage ? (
                  <img
                    src={challenge.intervenant.profileImage}
                    alt={intervenantName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-[#6d74b5]" />
                )}
              </div>
              <div>
                <p className="font-medium text-[#1c2942]">{intervenantName}</p>
                {challenge.intervenant?.city && (
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {challenge.intervenant.city}
                  </p>
                )}
              </div>
            </div>
            {challenge.intervenant?.bio && (
              <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                {challenge.intervenant.bio}
              </p>
            )}
          </div>

          {/* Prix */}
          {challenge.priceCents && (
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500 mb-1">Tarif indicatif</p>
              <p className="text-3xl font-bold text-[#6d74b5]">
                {(challenge.priceCents / 100).toLocaleString("fr-FR")} €
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="primary"
              className="flex-1 bg-[#6d74b5] hover:bg-[#5a61a0]"
              onClick={onContact}
            >
              Demander un devis
            </Button>
            <Button variant="secondary" className="flex-1" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Page principale
export default function TousLesChallengesPage() {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedThematique, setSelectedThematique] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  useEffect(() => {
    fetchChallenges();
  }, [selectedThematique]);

  const fetchChallenges = async () => {
    try {
      setIsLoading(true);
      const data = await getPublicChallenges(selectedThematique || undefined);
      setChallenges(data);
    } catch (err) {
      console.error("Erreur lors du chargement des challenges:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredChallenges = challenges.filter((challenge) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      challenge.title.toLowerCase().includes(query) ||
      challenge.description.toLowerCase().includes(query) ||
      challenge.thematique.toLowerCase().includes(query)
    );
  });

  const handleContact = () => {
    navigate("/contact");
  };

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative text-white py-16 overflow-hidden"
        style={{ backgroundColor: "#1c2942" }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop')`,
          }}
        />
        <div className="absolute inset-0 bg-[#1c2942]/85" />
        <PageContainer maxWidth="7xl" className="relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-[#6d74b5] text-white px-4 py-2 rounded-full mb-6">
              <Trophy className="w-5 h-5" />
              <span className="text-sm font-bold">Tous nos challenges</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Explorez nos challenges
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
              Des projets pédagogiques innovants et clé en main pour dynamiser
              l'apprentissage de vos étudiants.
            </p>
          </div>
        </PageContainer>
      </section>

      {/* Filtres */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <PageContainer maxWidth="7xl" className="py-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#6d74b5] transition"
                />
              </div>

              <div className="relative w-full sm:w-auto">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                <select
                  value={selectedThematique}
                  onChange={(e) => setSelectedThematique(e.target.value)}
                  className="w-full sm:w-auto pl-10 pr-8 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#6d74b5] transition appearance-none bg-white cursor-pointer"
                >
                  <option value="">Toutes les thématiques</option>
                  {THEMATIQUES.map((thematique) => (
                    <option key={thematique} value={thematique}>
                      {thematique}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-[#1c2942] font-semibold">
              {filteredChallenges.length} challenge
              {filteredChallenges.length !== 1 ? "s" : ""} trouvé
              {filteredChallenges.length !== 1 ? "s" : ""}
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Grille des challenges */}
      <section style={{ backgroundColor: "#ebf2fa" }}>
        <PageContainer maxWidth="7xl" className="py-12">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
                  <div className="h-32 bg-gray-200" />
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
                    <div className="h-10 bg-gray-200 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredChallenges.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Trophy className="w-8 h-8 text-[#6d74b5]" />
              </div>
              <p className="text-xl text-gray-600 mb-2">
                Aucun challenge ne correspond à vos critères.
              </p>
              <p className="text-gray-500">
                Essayez de modifier vos filtres ou revenez plus tard.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChallenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onSelect={setSelectedChallenge}
                />
              ))}
            </div>
          )}
        </PageContainer>
      </section>

      {/* Modal */}
      {selectedChallenge && (
        <ChallengeModal
          challenge={selectedChallenge}
          onClose={() => setSelectedChallenge(null)}
          onContact={handleContact}
        />
      )}
    </>
  );
}
