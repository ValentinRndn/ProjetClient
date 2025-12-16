import { Mission } from "@/services/missions";
import { Button } from "@/components/ui/Button";
import {
  Calendar,
  Building2,
  Euro,
  Clock,
  CheckCircle,
  FileText,
  ArrowRight,
  User,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MissionCardProps {
  mission: Mission;
  onApply?: (missionId: string) => void;
  showApplyButton?: boolean;
  isApplying?: boolean;
  hasApplied?: boolean;
}

export function MissionCard({
  mission,
  onApply,
  showApplyButton = true,
  isApplying = false,
  hasApplied = false,
}: MissionCardProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return {
          icon: <Sparkles className="w-3 h-3" />,
          label: "Active",
          className: "bg-emerald-100 text-emerald-700 border-emerald-200",
        };
      case "DRAFT":
        return {
          icon: <FileText className="w-3 h-3" />,
          label: "Brouillon",
          className: "bg-gray-100 text-gray-600 border-gray-200",
        };
      case "COMPLETED":
        return {
          icon: <CheckCircle className="w-3 h-3" />,
          label: "Terminée",
          className: "bg-blue-100 text-blue-700 border-blue-200",
        };
      default:
        return null;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatPrice = (priceCents?: number) => {
    if (!priceCents) return null;
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(priceCents / 100);
  };

  const statusConfig = getStatusConfig(mission.status);

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-100 transition-all duration-300">
      {/* Decorative gradient on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-50/0 to-purple-50/0 group-hover:from-indigo-50/50 group-hover:to-purple-50/30 transition-all duration-300 pointer-events-none" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {statusConfig && (
                <span className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                  statusConfig.className
                )}>
                  {statusConfig.icon}
                  {statusConfig.label}
                </span>
              )}
              {mission.priceCents && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                  <Euro className="w-3 h-3" />
                  {formatPrice(mission.priceCents)}
                </span>
              )}
            </div>
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-indigo-900 transition-colors line-clamp-2">
              {mission.title}
            </h3>
          </div>
        </div>

        {/* École */}
        {mission.ecole && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-indigo-600" />
            </div>
            <span className="font-medium">{mission.ecole.name}</span>
          </div>
        )}

        {/* Description */}
        {mission.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {mission.description}
          </p>
        )}

        {/* Meta info */}
        <div className="flex flex-wrap gap-3 mb-4">
          {(mission.startDate || mission.endDate) && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-lg">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {formatDate(mission.startDate)}
                {mission.endDate && ` → ${formatDate(mission.endDate)}`}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatDate(mission.createdAt)}</span>
          </div>

          {showApplyButton && mission.status === "ACTIVE" && !mission.intervenant && onApply && (
            hasApplied ? (
              <div className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1.5 rounded-lg">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Candidature envoyée</span>
              </div>
            ) : (
              <Button
                onClick={() => onApply(mission.id)}
                variant="primary"
                size="sm"
                isLoading={isApplying}
                className="group/btn"
              >
                Postuler
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
              </Button>
            )
          )}

          {mission.intervenant && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-lg">
              <User className="w-3.5 h-3.5" />
              <span>Assignée</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
