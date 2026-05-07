"use client";

import { type IconType } from "react-icons";
import {
  SiAnthropic,
  SiCanva,
  SiDuolingo,
  SiGoogle,
  SiNetflix,
  SiNordvpn,
  SiOpenai,
  SiSpotify,
  SiYoutube,
} from "react-icons/si";

import { cn } from "@/lib/utils";

type BrandLogoProps = {
  name: string;
  provider: string;
  className?: string;
};

const brandIcons: Array<{
  match: (name: string, provider: string) => boolean;
  icon: IconType;
  label: string;
}> = [
  {
    match: (name, provider) => /netflix/i.test(name) || /netflix/i.test(provider),
    icon: SiNetflix,
    label: "Netflix",
  },
  {
    match: (name, provider) => /chatgpt|openai/i.test(name) || /openai/i.test(provider),
    icon: SiOpenai,
    label: "OpenAI",
  },
  {
    match: (name, provider) => /claude|anthropic/i.test(name) || /anthropic/i.test(provider),
    icon: SiAnthropic,
    label: "Anthropic",
  },
  {
    match: (name, provider) => /spotify/i.test(name) || /spotify/i.test(provider),
    icon: SiSpotify,
    label: "Spotify",
  },
  {
    match: (name, provider) => /youtube/i.test(name) || /youtube/i.test(provider),
    icon: SiYoutube,
    label: "YouTube",
  },
  {
    match: (name, provider) => /canva/i.test(name) || /canva/i.test(provider),
    icon: SiCanva,
    label: "Canva",
  },
  {
    match: (name, provider) => /nordvpn|nord security/i.test(name) || /nordvpn|nord security/i.test(provider),
    icon: SiNordvpn,
    label: "NordVPN",
  },
  {
    match: (name, provider) => /duolingo/i.test(name) || /duolingo/i.test(provider),
    icon: SiDuolingo,
    label: "Duolingo",
  },
  {
    match: (name, provider) => /google/i.test(name) || /google/i.test(provider),
    icon: SiGoogle,
    label: "Google",
  },
];

function resolveBrandIcon(name: string, provider: string) {
  return brandIcons.find((entry) => entry.match(name, provider)) ?? {
    icon: SiGoogle,
    label: provider,
  };
}

export function BrandLogo({ name, provider, className }: BrandLogoProps) {
  const resolved = resolveBrandIcon(name, provider);
  const Icon = resolved.icon;

  return <Icon aria-label={resolved.label} className={cn("h-full w-full", className)} />;
}