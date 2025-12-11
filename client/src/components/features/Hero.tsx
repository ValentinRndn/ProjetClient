import { HeroBanner } from "@/components/ui/HeroBanner";
import { HeroStats } from "@/components/ui/HeroStats";
import { HeroCTA } from "@/components/ui/HeroCTA";
import { useNavigate } from "react-router";
import { Search, Briefcase, GraduationCap, Users } from "lucide-react";

export default function Hero() {
  const navigate = useNavigate();

  const stats = [
    {
      value: "35+",
      label: "Écoles partenaires",
      icon: <GraduationCap className="w-5 h-5 text-indigo-300" />,
    },
    {
      value: "150+",
      label: "Intervenants qualifiés",
      icon: <Users className="w-5 h-5 text-indigo-300" />,
    },
    {
      value: "10",
      label: "Thématiques",
      icon: <Briefcase className="w-5 h-5 text-indigo-300" />,
    },
    {
      value: "98%",
      label: "Satisfaction",
      icon: <Search className="w-5 h-5 text-indigo-300" />,
    },
  ];

  return (
    <HeroBanner
      badge="Plateforme de mise en relation"
      title={
        <>
          Entre{" "}
          <span className="relative">
            <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
              immersion
            </span>
          </span>{" "}
          et{" "}
          <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
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
                    <stop offset="0%" stopColor="#FCD34D" />
                    <stop offset="100%" stopColor="#FBBF24" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            {" "}!
          </span>
        </>
      }
      description="Connectez votre établissement avec des experts passionnés. Trouvez l'intervenant idéal en quelques clics."
      variant="mesh"
    >
      <HeroCTA
        primaryAction={{
          label: "Trouver un intervenant",
          onClick: () => navigate("/intervenants"),
          icon: <Search className="w-4 h-4" />,
        }}
        secondaryAction={{
          label: "Voir les missions",
          onClick: () => navigate("/missions"),
        }}
      />
      <div className="mt-14">
        <HeroStats stats={stats} variant="glass" />
      </div>
    </HeroBanner>
  );
}
