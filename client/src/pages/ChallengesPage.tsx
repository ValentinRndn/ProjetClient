import { useState } from "react";
import { PageContainer } from "@/components/ui/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Search,
  Filter,
  Sparkles,
  Users,
  Clock,
  Trophy,
  ChevronRight,
  X,
  Play,
  Star,
  CheckCircle,
  Zap,
  Target,
  Lightbulb,
} from "lucide-react";

// Données des challenges
const challenges = [
  {
    id: 1,
    title: "Paperasse Poursuite",
    category: "Entrepreneuriat",
    level: "Intermédiaire",
    description:
      "Là où la créativité rencontre les formalités. Un challenge unique où l'entrepreneuriat rencontre la créativité.",
    duration: "2 jours",
    participants: "20-50",
  },
  {
    id: 2,
    title: "Cinem-IA",
    category: "Intelligence Artificielle",
    level: "Avancé",
    description:
      "Créez votre film à l'aide de l'intelligence artificielle générative ! Une expérience immersive dans le monde du cinéma et de l'IA.",
    duration: "3 jours",
    participants: "15-30",
  },
  {
    id: 3,
    title: "AI Magination",
    category: "Intelligence Artificielle",
    level: "Intermédiaire",
    description:
      "Réalisez votre propre court métrage et boostez-le à l'IA ! Mélangez créativité artistique et intelligence artificielle.",
    duration: "2 jours",
    participants: "20-40",
  },
  {
    id: 4,
    title: "Bizz L'éclair",
    category: "Entrepreneuriat",
    level: "Intermédiaire",
    description:
      "Vers l'entrepreneuriat et au-delà ! Un challenge stimulant qui vous propulse dans l'univers de la startup.",
    duration: "2 jours",
    participants: "25-60",
  },
  {
    id: 5,
    title: "Pro Player Manager",
    category: "Innovation",
    level: "Intermédiaire",
    description:
      "Stratégie, Gestion, Victoire !!! Devenez le manager d'une équipe e-sport et menez-la vers le sommet.",
    duration: "1 jour",
    participants: "30-100",
  },
  {
    id: 6,
    title: "Masterpiece Market",
    category: "Art & Créativité",
    level: "Débutant",
    description:
      "Créez, valorisez et vendez de l'art ! Plongez dans le monde du marketing artistique.",
    duration: "2 jours",
    participants: "20-40",
  },
  {
    id: 7,
    title: "AccessTech",
    category: "Accessibilité",
    level: "Intermédiaire",
    description:
      "Un Avenir Numérique Inclusif commence ici ! Concevez des solutions technologiques accessibles à tous.",
    duration: "2 jours",
    participants: "15-35",
  },
  {
    id: 8,
    title: "IA-cquisition",
    category: "Intelligence Artificielle",
    level: "Intermédiaire",
    description:
      "L'Avenir des campagnes marketing avec ChatGPT. Maîtrisez les outils d'IA pour révolutionner vos stratégies marketing.",
    duration: "1 jour",
    participants: "20-50",
  },
  {
    id: 9,
    title: "CRE-AI",
    category: "Intelligence Artificielle",
    level: "Avancé",
    description:
      "Suite Adobe VS Outils d'Intelligence Artificielle. Comparez et maîtrisez les outils de création classiques et l'IA.",
    duration: "2 jours",
    participants: "15-30",
  },
  {
    id: 10,
    title: "Fais Ton Fest",
    category: "Innovation",
    level: "Avancé",
    description:
      "De l'idée à la scène. Organisez votre propre festival de A à Z et développez vos compétences en événementiel.",
    duration: "3 jours",
    participants: "30-80",
  },
];

const domains = [
  "Tous les domaines",
  "Entrepreneuriat",
  "Intelligence Artificielle",
  "Innovation",
  "Art & Créativité",
  "Accessibilité",
];

const levels = ["Tous les niveaux", "Débutant", "Intermédiaire", "Avancé"];

interface Challenge {
  id: number;
  title: string;
  category: string;
  level: string;
  description: string;
  duration: string;
  participants: string;
}

// Composant ChallengeCard
function ChallengeCard({
  challenge,
  onSelect,
}: {
  challenge: Challenge;
  onSelect: (challenge: Challenge) => void;
}) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "Débutant":
        return "bg-green-100 text-green-800";
      case "Intermédiaire":
        return "bg-blue-100 text-blue-800";
      case "Avancé":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Entrepreneuriat: "bg-orange-100 text-orange-800",
      "Intelligence Artificielle": "bg-indigo-100 text-indigo-800",
      Innovation: "bg-teal-100 text-teal-800",
      "Art & Créativité": "bg-pink-100 text-pink-800",
      Accessibilité: "bg-emerald-100 text-emerald-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
      <div className="bg-[#28303a] p-6 text-white">
        <h3 className="text-xl font-bold mb-3">{challenge.title}</h3>
        <div className="flex flex-wrap gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(challenge.category)}`}
          >
            {challenge.category}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(challenge.level)}`}
          >
            {challenge.level}
          </span>
        </div>
      </div>

      <div className="p-6 flex-grow flex flex-col">
        <p className="text-gray-600 mb-4 flex-grow">{challenge.description}</p>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{challenge.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{challenge.participants}</span>
          </div>
        </div>

        <Button
          variant="primary"
          className="w-full"
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
}: {
  challenge: Challenge;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#28303a] text-white p-8 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-[#dbbacf] transition-colors p-2 rounded-full hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-3xl font-bold mb-4 pr-8">{challenge.title}</h2>
          <div className="flex flex-wrap gap-2">
            <span className="px-4 py-2 bg-[#dbbacf] text-[#28303a] rounded-full text-sm font-semibold">
              {challenge.category}
            </span>
            <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
              {challenge.level}
            </span>
          </div>
        </div>

        <div className="p-8">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            {challenge.description}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Clock className="w-5 h-5" />
                <span className="font-medium">Durée</span>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {challenge.duration}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Users className="w-5 h-5" />
                <span className="font-medium">Participants</span>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {challenge.participants}
              </p>
            </div>
          </div>

          <div className="bg-[#dbbacf]/20 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Ce que vous obtenez
            </h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <Zap className="w-4 h-4 mt-1 text-[#28303a]" />
                <span>Accompagnement pédagogique complet</span>
              </li>
              <li className="flex items-start gap-2">
                <Target className="w-4 h-4 mt-1 text-[#28303a]" />
                <span>Livrables et grilles d'évaluation</span>
              </li>
              <li className="flex items-start gap-2">
                <Trophy className="w-4 h-4 mt-1 text-[#28303a]" />
                <span>Lots et récompenses pour les étudiants</span>
              </li>
              <li className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 mt-1 text-[#28303a]" />
                <span>Intervenants experts dans leur domaine</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="primary" className="flex-1">
              Demander un devis
            </Button>
            <Button variant="secondary" className="flex-1" onClick={onClose}>
              Plus d'informations
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Page principale
export default function ChallengesPage() {
  const [selectedDomain, setSelectedDomain] = useState("Tous les domaines");
  const [selectedLevel, setSelectedLevel] = useState("Tous les niveaux");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null
  );

  const filteredChallenges = challenges.filter((challenge) => {
    const domainMatch =
      selectedDomain === "Tous les domaines" ||
      challenge.category === selectedDomain;
    const levelMatch =
      selectedLevel === "Tous les niveaux" ||
      challenge.level === selectedLevel;
    const searchMatch =
      !searchQuery ||
      challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchQuery.toLowerCase());
    return domainMatch && levelMatch && searchMatch;
  });

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-[#28303a] text-white py-16 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop')`,
          }}
        />
        <PageContainer maxWidth="7xl" className="relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-[#dbbacf] text-[#28303a] px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-bold">
                Challenges Pédagogiques Clés en Main
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Dynamisez l'apprentissage
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-8">
              Des projets engageants sur des thématiques actuelles pour
              transformer l'expérience pédagogique de vos étudiants.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#dbbacf]" />
                <span>10+ challenges disponibles</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#dbbacf]" />
                <span>+5000 étudiants formés</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-[#dbbacf]" />
                <span>4.8/5 satisfaction</span>
              </div>
            </div>
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
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#28303a] transition"
                />
              </div>

              <div className="relative w-full sm:w-auto">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                <select
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  className="w-full sm:w-auto pl-10 pr-8 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#28303a] transition appearance-none bg-white cursor-pointer"
                >
                  {domains.map((domain) => (
                    <option key={domain} value={domain}>
                      {domain}
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full sm:w-auto px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#28303a] transition appearance-none bg-white cursor-pointer"
              >
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-gray-700 font-semibold">
              {filteredChallenges.length} challenge
              {filteredChallenges.length !== 1 ? "s" : ""} trouvé
              {filteredChallenges.length !== 1 ? "s" : ""}
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Grille des challenges */}
      <PageContainer maxWidth="7xl" className="py-12">
        {filteredChallenges.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">
              Aucun challenge ne correspond à vos critères de recherche.
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

      {/* Section CTA */}
      <section className="bg-[#28303a] text-white py-16">
        <PageContainer maxWidth="4xl" className="text-center">
          <Play className="w-16 h-16 mx-auto mb-6 text-[#dbbacf]" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prêt à révolutionner vos formations ?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Contactez-nous pour discuter de votre projet et obtenir un devis
            personnalisé.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="secondary"
              className="bg-[#dbbacf] text-[#28303a] hover:bg-[#dbbacf]/90"
            >
              Demander un devis
            </Button>
            <Button
              variant="outline"
              className="border-[#dbbacf] text-[#dbbacf] hover:bg-[#dbbacf]/10"
            >
              En savoir plus
            </Button>
          </div>
        </PageContainer>
      </section>

      {/* Modal */}
      {selectedChallenge && (
        <ChallengeModal
          challenge={selectedChallenge}
          onClose={() => setSelectedChallenge(null)}
        />
      )}
    </>
  );
}
