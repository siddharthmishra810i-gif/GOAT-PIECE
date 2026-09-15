import React from "react";
import { Compass, ExternalLink, ShieldCheck, Heart } from "lucide-react";

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-amber-500/20 bg-[#06101e] text-slate-400 text-xs mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center space-x-2 text-amber-300 font-display font-bold text-base">
              <Compass className="w-5 h-5 text-amber-400" />
              <span>GRAND LINE ARCHIVES</span>
            </div>
            <p className="text-slate-300 leading-relaxed max-w-md text-xs">
              An interactive cartography and scholarly research platform dedicated to the world-building, geography, mysteries, and historical chronicles of Eiichiro Oda's masterwork.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-amber-400 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Non-Commercial Fan Research · Spoiler Shield Enabled</span>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="space-y-2">
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-amber-400">
              Navigation
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={() => onNavigate("map")} className="hover:text-amber-300">
                  Interactive World Map
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("characters")} className="hover:text-amber-300">
                  Character Dossiers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("mysteries")} className="hover:text-amber-300">
                  The Void Century Mysteries
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("theories")} className="hover:text-amber-300">
                  Archeological Theories
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("bounties")} className="hover:text-amber-300">
                  Pirates & Bounties Wanted Ledger
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("devilFruits")} className="hover:text-amber-300">
                  Devil Fruit Encyclopedia (Akuma no Mi)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("timeline")} className="hover:text-amber-300">
                  Historical Timeline
                </button>
              </li>
            </ul>
          </div>

          {/* Official Sources & Rights */}
          <div className="space-y-2">
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-amber-400">
              Support The Official Release
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a
                  href="https://mangaplus.shueisha.co.jp/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 flex items-center space-x-1"
                >
                  <span>MANGA Plus (Shueisha)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.viz.com/shonenjump/chapters/one-piece"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 flex items-center space-x-1"
                >
                  <span>VIZ Media Shonen Jump</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://onepiece-official.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 flex items-center space-x-1"
                >
                  <span>Official One Piece Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://toei-anim.co.jp/tv/onep/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 flex items-center space-x-1"
                >
                  <span>Toei Animation</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-500 leading-relaxed font-sans space-y-2">
          <p>
            <strong className="text-slate-400">LEGAL & COPYRIGHT COMPLIANCE NOTICE:</strong> Grand Line Archives is a fan-created non-commercial encyclopedia. All characters, names, storylines, and logos of One Piece are the exclusive intellectual property of <strong>Eiichiro Oda</strong>, <strong>Shueisha</strong>, and <strong>Toei Animation</strong>. This platform does not host, reproduce, or pirate manga scans, scanlations, raw panels, video episodes, or translated subtitle files. All analytical entries cite chapter and episode numbers for academic and fan navigation.
          </p>
          <div className="flex items-center justify-between pt-2">
            <span>Crafted with passion for straw hat adventurers across the world.</span>
            <span className="font-mono text-amber-400/80">© 2024-2025 Grand Line Archives</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
