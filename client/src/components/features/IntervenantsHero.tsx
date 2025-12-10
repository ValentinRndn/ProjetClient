import { Calendar, Receipt, Zap } from "lucide-react";
import { useNavigate } from "react-router";

export function IntervenantsHero() {
  const navigate = useNavigate();
  return (
    <section className="relative bg-linear-to-br from-[#1B263B] via-[#1E3A8A] to-[#4F46E5] text-white py-20 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-block bg-yellow-400 text-black px-8 py-3 rounded-full text-2xl font-bold mb-6 shadow-xl">
            🎉 100% GRATUIT !
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Vous cherchez des intervenants
            <br />
            compétents et passionnés ?
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto mb-12">
            Tous les intervenants de la plateforme sont des professionnels de
            leur secteur d'activité.
          </p>
        </div>

        {/* Key Points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4 mx-auto">
              <Receipt className="w-6 h-6" />
            </div>
            <p className="text-center text-sm text-white">
              Prise en charge de leur facturation pour faciliter votre gestion
              administrative.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4 mx-auto">
              <Zap className="w-6 h-6" />
            </div>
            <p className="text-center text-sm text-white">
              Un système d'urgence pour remplacer vos intervenants en cas de
              besoin.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4 mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <p className="text-center text-sm text-white">
              Pour les écoles partenaires, réservez un créneau de rencontre en
              moins de 2 minutes.
            </p>
          </div>
        </div>

        <div className="text-center">
          <button
            className="bg-white text-[#272757] px-10 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition shadow-2xl transform hover:scale-105"
            onClick={() => navigate("/intervenants")}
          >
            Voir les intervenants →
          </button>
        </div>
      </div>
    </section>
  );
}
