import React from "react";
import { Compass, Anchor } from "lucide-react";

interface ParchmentCardProps {
  title?: string;
  subtitle?: string;
  badge?: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
  variant?: "parchment" | "deepOcean" | "wantedPoster";
  onClick?: () => void;
}

export const ParchmentCard: React.FC<ParchmentCardProps> = ({
  title,
  subtitle,
  badge,
  icon,
  children,
  className = "",
  footer,
  variant = "deepOcean",
  onClick,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "parchment":
        return "bg-[#f5e6ca] text-[#2c1d11] border-[#c49a45]/40 shadow-xl shadow-amber-950/20";
      case "wantedPoster":
        return "bg-[#efe0c0] text-[#1c120c] border-[#8a5d28] shadow-2xl";
      case "deepOcean":
      default:
        return "bg-[#09152b] text-slate-100 border-amber-500/25 shadow-2xl shadow-black/40";
    }
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border p-5 transition-all duration-200 relative overflow-hidden ${getVariantStyles()} ${
        onClick ? "cursor-pointer hover:border-amber-400 hover:scale-[1.01]" : ""
      } ${className}`}
    >
      {/* Nautical Corner Flourishes */}
      <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-amber-500/30 pointer-events-none" />
      <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t border-r border-amber-500/30 pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l border-amber-500/30 pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-amber-500/30 pointer-events-none" />

      {/* Header if title or icon provided */}
      {(title || icon || badge) && (
        <div className="flex items-start justify-between gap-3 pb-3 mb-3 border-b border-amber-500/15">
          <div className="flex items-center space-x-2.5 min-w-0">
            {icon && (
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                {icon}
              </div>
            )}
            <div className="min-w-0">
              {title && (
                <h3 className="font-display font-bold text-base truncate text-amber-100">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs font-mono text-slate-400 truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {badge && <div className="flex-shrink-0">{badge}</div>}
        </div>
      )}

      {/* Content */}
      <div className="space-y-3">{children}</div>

      {/* Footer */}
      {footer && (
        <div className="mt-4 pt-3 border-t border-amber-500/15 text-xs font-mono text-slate-400">
          {footer}
        </div>
      )}
    </div>
  );
};
