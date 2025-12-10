import { HeroBanner } from "@/components/ui/HeroBanner";
import { HeroStats } from "@/components/ui/HeroStats";
import { HeroCTA } from "@/components/ui/HeroCTA";
import { useNavigate } from "react-router";

export default function Hero() {
  const navigate = useNavigate();

  const stats = [
    {
      value: "35+",
      label: "Écoles partenaires",
    },
    {
      value: "10",
      label: "Thématiques",
    },
  ];

  return (
    <HeroBanner
      badge="🎓 Plateforme de mise en relation"
      title={
        <>
          Entre <span className="text-yellow-400">immersion</span> et{" "}
          <span className="text-yellow-400">pédagogie</span>,
          <br className="hidden sm:block" />
          <span className="relative inline-block">
            il y a Vizion Academy !
            <svg
              className="absolute -bottom-1 left-0 w-full h-3"
              viewBox="0 0 300 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 10 Q150 3 300 10"
                stroke="#FCD34D"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </>
      }
      description="Vous cherchez des intervenants compétents et passionnés ? Rejoignez notre communauté d'experts et d'établissements !"
      backgroundImage="/banner.jpg"
    >
      <HeroCTA
        primaryAction={{
          label: "Trouver un intervenant",
          onClick: () => navigate("/intervenants"),
        }}
        secondaryAction={{
          label: "Découvrir nos Challenges ✨",
          onClick: () => navigate("/challenges"),
        }}
      />
      <div className="mt-12">
        <HeroStats stats={stats} />
      </div>
    </HeroBanner>
  );
}
