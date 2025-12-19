import { HeroBanner } from "@/components/ui/HeroBanner";
import { useNavigate } from "react-router";
import { GraduationCap, Users, Trophy, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export default function Hero() {
  const navigate = useNavigate();

  const entryPoints = [
    {
      title: "Je suis une école",
      subtitle: "Accédez à notre réseau d'experts qualifiés",
      icon: <GraduationCap className="w-8 h-8" />,
      onClick: () => navigate("/espace-ecoles"),
      color: "from-[#1c2942] to-[#2a3a5c]",
      hoverColor: "group-hover:from-[#2a3a5c] group-hover:to-[#1c2942]",
    },
    {
      title: "Découvrir nos challenges",
      subtitle: "Explorez nos challenges immersifs clé en main",
      icon: <Trophy className="w-8 h-8" />,
      onClick: () => navigate("/challenges"),
      color: "from-[#6d74b5] to-[#5a61a0]",
      hoverColor: "group-hover:from-[#5a61a0] group-hover:to-[#6d74b5]",
    },
    {
      title: "Je suis intervenant",
      subtitle: "Rejoignez notre réseau d'experts",
      icon: <Users className="w-8 h-8" />,
      onClick: () => navigate("/espace-intervenants"),
      color: "from-[#1c2942] to-[#6d74b5]",
      hoverColor: "group-hover:from-[#6d74b5] group-hover:to-[#1c2942]",
    },
  ];

  return (
    <HeroBanner
      badge="Plateforme de mise en relation"
      title={
        <>
          Entre{" "}
          <span className="relative">
            <span className="bg-gradient-to-r from-[#2a3a5c] to-[#5a6390] bg-clip-text text-transparent">
              immersion
            </span>
          </span>{" "}
          et{" "}
          <span className="bg-gradient-to-r from-[#2a3a5c] to-[#5a6390] bg-clip-text text-transparent">
            pédagogie
          </span>
          ,
          <br className="hidden sm:block" />
          <span className="relative inline-block mt-2">
            il y a{" "}
            <span className="relative">
              Vizion Academy
              <svg
                className="absolute -bottom-2 left-0 w-full h-3"
                viewBox="0 0 300 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 10 Q150 2 300 10"
                  stroke="url(#gradient)"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2a3a5c" />
                    <stop offset="100%" stopColor="#5a6390" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            {" "}!
          </span>
        </>
      }
      description="Connectez votre établissement avec des experts passionnés. Trouvez l'intervenant idéal en quelques clics."
      variant="image"
    >
      {/* 3 Portes d'entrées */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-4xl mx-auto">
        {entryPoints.map((entry, index) => (
          <motion.button
            key={entry.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onClick={entry.onClick}
            className="group relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            {/* Background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${entry.color} ${entry.hoverColor} transition-all duration-300`} />

            {/* Glass overlay */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full">
              <div className="mb-4 p-3 bg-white/20 rounded-xl w-fit">
                {entry.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {entry.title}
              </h3>
              <p className="text-sm text-white/80 mb-4 flex-grow">
                {entry.subtitle}
              </p>
              <div className="flex items-center text-white/90 text-sm font-medium group-hover:translate-x-1 transition-transform">
                <span>En savoir plus</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </HeroBanner>
  );
}
