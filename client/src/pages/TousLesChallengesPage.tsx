import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { SEO } from "@/components/shared/SEO";
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
  Sparkles,
} from "lucide-react";
import {
  getPublicChallenges,
  THEMATIQUES,
  type Challenge,
} from "@/services/challenges";

// Composant ChallengeCard avec style rose/gris
function ChallengeCard({
  challenge,
  onSelect,
  index,
}: {
  challenge: Challenge;
  onSelect: (challenge: Challenge) => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300 flex flex-col h-full border cursor-pointer"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderColor: "rgba(219, 186, 207, 0.3)",
      }}
    >
      {/* Image de couverture ou header coloré */}
      {challenge.imageUrl ? (
        <div className="relative h-48">
          <img
            src={challenge.imageUrl}
            alt={challenge.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#28303a] to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-xl font-bold text-white">{challenge.title}</h3>
          </div>
        </div>
      ) : (
        <div
          className="p-6"
          style={{ backgroundColor: "rgba(219, 186, 207, 0.15)" }}
        >
          <h3 className="text-xl font-bold text-white mb-2">{challenge.title}</h3>
        </div>
      )}

      <div className="p-6 flex-grow flex flex-col">
        {/* Badge thématique */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: "rgba(219, 186, 207, 0.2)",
              color: "#dbbacf",
            }}
          >
            {challenge.thematique}
          </span>
        </div>

        {/* Description */}
        <p className="text-white/70 mb-4 flex-grow line-clamp-3">
          {challenge.shortDescription || challenge.description}
        </p>

        {/* Infos */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-white/50 mb-4">
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

        {/* Prix si défini */}
        {challenge.priceCents && (
          <div className="text-lg font-bold mb-4" style={{ color: "#dbbacf" }}>
            {(challenge.priceCents / 100).toLocaleString("fr-FR")} €
          </div>
        )}

        <Button
          variant="primary"
          className="w-full text-[#28303a]"
          style={{ backgroundColor: "#dbbacf" }}
          onClick={() => onSelect(challenge)}
        >
          Voir le Challenge
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}

// Modal de détail avec style rose/gris
function ChallengeModal({
  challenge,
  onClose,
  onContact,
}: {
  challenge: Challenge;
  onClose: () => void;
  onContact: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: "#28303a" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="p-8 rounded-t-2xl relative"
          style={{ backgroundColor: "rgba(219, 186, 207, 0.15)" }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-3xl font-bold text-white mb-4 pr-8">
            {challenge.title}
          </h2>
          <div className="flex flex-wrap gap-2">
            <span
              className="px-4 py-2 rounded-full text-sm font-semibold"
              style={{ backgroundColor: "#dbbacf", color: "#28303a" }}
            >
              {challenge.thematique}
            </span>
          </div>
        </div>

        <div className="p-8">
          {/* Description */}
          <p className="text-white/80 text-lg leading-relaxed mb-6 whitespace-pre-wrap">
            {challenge.description}
          </p>

          {/* Infos */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {challenge.duration && (
              <div
                className="rounded-lg p-4"
                style={{ backgroundColor: "rgba(219, 186, 207, 0.1)" }}
              >
                <div className="flex items-center gap-2 text-white/60 mb-1">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">Durée</span>
                </div>
                <p className="text-xl font-bold text-white">
                  {challenge.duration}
                </p>
              </div>
            )}
            {challenge.targetAudience && (
              <div
                className="rounded-lg p-4"
                style={{ backgroundColor: "rgba(219, 186, 207, 0.1)" }}
              >
                <div className="flex items-center gap-2 text-white/60 mb-1">
                  <Users className="w-5 h-5" />
                  <span className="font-medium">Public cible</span>
                </div>
                <p className="text-xl font-bold text-white">
                  {challenge.targetAudience}
                </p>
              </div>
            )}
          </div>

          {/* Objectifs */}
          {challenge.objectives && challenge.objectives.length > 0 && (
            <div
              className="rounded-lg p-6 mb-6"
              style={{ backgroundColor: "rgba(219, 186, 207, 0.1)" }}
            >
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <Target className="w-5 h-5" style={{ color: "#dbbacf" }} />
                Objectifs pédagogiques
              </h4>
              <ul className="space-y-2 text-white/70">
                {challenge.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle
                      className="w-4 h-4 mt-1 shrink-0"
                      style={{ color: "#dbbacf" }}
                    />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Livrables */}
          {challenge.deliverables && challenge.deliverables.length > 0 && (
            <div
              className="rounded-lg p-6 mb-6"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
            >
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5" style={{ color: "#dbbacf" }} />
                Livrables attendus
              </h4>
              <ul className="space-y-2 text-white/70">
                {challenge.deliverables.map((del, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Lightbulb
                      className="w-4 h-4 mt-1 shrink-0"
                      style={{ color: "#dbbacf" }}
                    />
                    <span>{del}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Prérequis */}
          {challenge.prerequisites && (
            <div
              className="rounded-lg p-6 mb-6 border"
              style={{
                backgroundColor: "rgba(219, 186, 207, 0.05)",
                borderColor: "rgba(219, 186, 207, 0.2)",
              }}
            >
              <h4 className="font-semibold text-white mb-2">Prérequis</h4>
              <p className="text-white/70">{challenge.prerequisites}</p>
            </div>
          )}

          {/* Prix */}
          {challenge.priceCents && (
            <div className="text-center mb-6">
              <p className="text-sm text-white/50 mb-1">Tarif indicatif</p>
              <p className="text-3xl font-bold" style={{ color: "#dbbacf" }}>
                {(challenge.priceCents / 100).toLocaleString("fr-FR")} €
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="primary"
              className="flex-1 text-[#28303a]"
              style={{ backgroundColor: "#dbbacf" }}
              onClick={onContact}
            >
              Demander un devis
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-white/30 text-white hover:bg-white/10"
              onClick={onClose}
            >
              Fermer
            </Button>
          </div>
        </div>
      </motion.div>
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
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null
  );

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
    <div className="min-h-screen" style={{ backgroundColor: "#28303a" }}>
      <SEO
        title="Tous nos Challenges Immersifs"
        description="Explorez notre catalogue de challenges immersifs : hackathons, business games, simulations d'entreprise. Trouvez le challenge idéal pour vos étudiants."
        keywords="catalogue challenges, hackathon étudiant, business game école, challenge pédagogique, simulation entreprise"
        canonical="https://www.vizionacademy.fr/tous-les-challenges"
      />
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop')`,
          }}
        />
        {/* Color Overlay */}
        <div className="absolute inset-0 bg-[#28303a]/90" />

        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#dbbacf]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#dbbacf]/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 border"
              style={{
                backgroundColor: "rgba(219, 186, 207, 0.1)",
                color: "#dbbacf",
                borderColor: "rgba(219, 186, 207, 0.3)",
              }}
            >
              <Trophy className="w-4 h-4" />
              Tous nos challenges
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Explorez nos{" "}
              <span style={{ color: "#dbbacf" }}>challenges</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto">
              Des projets pédagogiques innovants et clé en main pour dynamiser
              l'apprentissage de vos étudiants.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filtres */}
      <section
        className="border-b py-4"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.03)",
          borderColor: "rgba(219, 186, 207, 0.2)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none transition text-white placeholder-white/40"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    borderColor: "rgba(219, 186, 207, 0.3)",
                  }}
                />
              </div>

              <div className="relative w-full sm:w-auto">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5 pointer-events-none" />
                <select
                  value={selectedThematique}
                  onChange={(e) => setSelectedThematique(e.target.value)}
                  className="w-full sm:w-auto pl-10 pr-8 py-2.5 border rounded-lg focus:outline-none transition appearance-none cursor-pointer text-white"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    borderColor: "rgba(219, 186, 207, 0.3)",
                  }}
                >
                  <option value="" style={{ backgroundColor: "#28303a" }}>
                    Toutes les thématiques
                  </option>
                  {THEMATIQUES.map((thematique) => (
                    <option
                      key={thematique}
                      value={thematique}
                      style={{ backgroundColor: "#28303a" }}
                    >
                      {thematique}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="font-semibold" style={{ color: "#dbbacf" }}>
              {filteredChallenges.length} challenge
              {filteredChallenges.length !== 1 ? "s" : ""} trouvé
              {filteredChallenges.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </section>

      {/* Grille des challenges */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl overflow-hidden animate-pulse border"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    borderColor: "rgba(219, 186, 207, 0.2)",
                  }}
                >
                  <div
                    className="h-32"
                    style={{ backgroundColor: "rgba(219, 186, 207, 0.1)" }}
                  />
                  <div className="p-6">
                    <div
                      className="h-6 rounded w-3/4 mb-4"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                    />
                    <div
                      className="h-4 rounded w-full mb-2"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                    />
                    <div
                      className="h-4 rounded w-2/3 mb-4"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                    />
                    <div
                      className="h-10 rounded w-full"
                      style={{ backgroundColor: "rgba(219, 186, 207, 0.2)" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredChallenges.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "rgba(219, 186, 207, 0.2)" }}
              >
                <Sparkles className="w-8 h-8" style={{ color: "#dbbacf" }} />
              </div>
              <p className="text-xl text-white/80 mb-2">
                Aucun challenge ne correspond à vos critères.
              </p>
              <p className="text-white/50">
                Essayez de modifier vos filtres ou revenez plus tard.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChallenges.map((challenge, index) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onSelect={setSelectedChallenge}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16" style={{ backgroundColor: "#dbbacf" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: "#28303a" }}
            >
              <Zap className="w-8 h-8 text-white" />
            </div>

            <h2
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ color: "#28303a" }}
            >
              Vous ne trouvez pas ce que vous cherchez ?
            </h2>

            <p
              className="text-lg mb-8 max-w-2xl mx-auto"
              style={{ color: "#28303a", opacity: 0.8 }}
            >
              Contactez-nous pour discuter de vos besoins spécifiques. Nous
              pouvons créer un challenge sur mesure pour vos étudiants.
            </p>

            <Button
              onClick={() => navigate("/contact")}
              className="text-white px-8 py-3"
              style={{ backgroundColor: "#28303a" }}
            >
              Nous contacter
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Modal */}
      {selectedChallenge && (
        <ChallengeModal
          challenge={selectedChallenge}
          onClose={() => setSelectedChallenge(null)}
          onContact={handleContact}
        />
      )}
    </div>
  );
}
