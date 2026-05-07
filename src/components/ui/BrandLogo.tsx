import React from "react";
import * as si from "simple-icons";

type SimpleIcon = { path: string; hex: string; title: string };

// Map product slugs to simple-icons keys
const SLUG_TO_SI: Record<string, string> = {
  "netflix": "siNetflix",
  "spotify": "siSpotify",
  "youtube-premium": "siYoutube",
  "claude-pro": "siClaude",
  "perplexity-pro": "siPerplexity",
  "nordvpn": "siNordvpn",
  "grammarly-premium": "siGrammarly",
  "notion-ai": "siNotion",
  "gemini-advanced": "siGooglegemini",
  "duolingo-plus": "siDuolingo",
};

// Custom SVG paths (24x24 viewBox) for brands not in simple-icons
const CUSTOM_PATHS: Record<string, { path: string; hex: string }> = {
  "chatgpt-plus": {
    hex: "10a37f",
    path: "M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.032.067L9.552 19.9a4.5 4.5 0 0 1-5.952-1.595zM2.362 8.57a4.49 4.49 0 0 1 2.339-1.97V12.2a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0L4.16 14.03a4.5 4.5 0 0 1-1.8-5.461zm16.597 3.868l-5.843-3.37 2.02-1.163a.077.077 0 0 1 .071 0l4.653 2.686a4.496 4.496 0 0 1-.692 8.1v-5.636a.797.797 0 0 0-.209-.617zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 10.17V7.838a.08.08 0 0 1 .032-.067l4.619-2.669a4.5 4.5 0 0 1 6.901 4.669zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V7.73a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z",
  },
  "canva-pro": {
    hex: "8B3DFF",
    path: "M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.8c1.988 0 3.6 1.612 3.6 3.6S13.988 12 12 12s-3.6-1.612-3.6-3.6S10.012 4.8 12 4.8zm0 14.4c-2.988 0-5.64-1.44-7.32-3.684.036-2.424 4.884-3.756 7.32-3.756 2.424 0 7.284 1.332 7.32 3.756C17.64 17.76 14.988 19.2 12 19.2z",
  },
  "midjourney": {
    hex: "000000",
    path: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  },
  "disney-plus": {
    hex: "113CCF",
    path: "M11.57 0C5.18 0 0 5.18 0 11.57c0 6.39 5.18 11.57 11.57 11.57 6.39 0 11.57-5.18 11.57-11.57C23.14 5.18 17.96 0 11.57 0zM8.4 16.8V7.2l7.8 4.8-7.8 4.8z",
  },
  "amazon-prime": {
    hex: "00A8E0",
    path: "M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 14.5c-3.75 1.5-9 .5-9-4.5 0-3 2-5 5-5s5 2 5 5h-7c0 2 2 3 4 2l2 2.5z",
  },
};

export interface BrandLogoProps {
  slug: string;
  size?: number;
  color?: string;
  className?: string;
}

export function BrandLogo({ slug, size = 20, color, className }: BrandLogoProps) {
  // Try simple-icons first
  const siKey = SLUG_TO_SI[slug];
  if (siKey) {
    const icon = (si as unknown as Record<string, SimpleIcon>)[siKey];
    if (icon) {
      return (
        <svg
          role="img"
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill={color ?? `#${icon.hex}`}
          className={className}
          aria-label={icon.title}
        >
          <path d={icon.path} />
        </svg>
      );
    }
  }

  // Try custom paths
  const custom = CUSTOM_PATHS[slug];
  if (custom) {
    return (
      <svg
        role="img"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill={color ?? `#${custom.hex}`}
        className={className}
      >
        <path d={custom.path} />
      </svg>
    );
  }

  // Fallback: first letter
  return (
    <span
      className={className}
      style={{ fontSize: size * 0.6, fontWeight: 800, lineHeight: 1, display: "inline-block" }}
    >
      {slug.charAt(0).toUpperCase()}
    </span>
  );
}
