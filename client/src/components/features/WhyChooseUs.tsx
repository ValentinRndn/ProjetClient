import React from "react";
import { BenefitsSection, Benefit } from "./BenefitsSection";
import {
  Users,
  Target,
  CheckCircle,
  FileText,
  Award,
  HeadphonesIcon,
} from "lucide-react";

export default function WhyChooseUs() {
  const benefits: Benefit[] = [
    {
      icon: <Users className="w-6 h-6 text-blue-700" />,
      title: "Accès à un réseau d'experts vérifiés et qualifiés",
      description:
        "Des intervenants sélectionnés pour leur expertise et leur pédagogie",
    },
    {
      icon: <Target className="w-6 h-6 text-blue-700" />,
      title: "Processus de mise en relation simplifié et efficace",
      description: "Trouvez le bon expert en quelques clics",
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-blue-700" />,
      title: "Challenges pédagogiques innovants clés en main",
      description: "Projets étudiants prêts à lancer pour vos programmes",
    },
    {
      icon: <FileText className="w-6 h-6 text-blue-700" />,
      title: "Prise en charge de la facturation des intervenants",
      description: "Simplifiez votre gestion administrative",
    },
    {
      icon: <Award className="w-6 h-6 text-blue-700" />,
      title: "Mandats de facturation pour tous les intervenants",
      description: "Facilitez à tous pour vos experts",
    },
    {
      icon: <HeadphonesIcon className="w-6 h-6 text-blue-700" />,
      title: "Support dédié tout au long de vos projets",
      description: "Une équipe à vos écoutes pour vous accompagner",
    },
  ];

  return <BenefitsSection benefits={benefits} />;
}
