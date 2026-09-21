import {
  FacebookIcon,
  GoogleIcon,
  InstagramIcon,
  WebsiteIcon,
  ZaloIcon,
} from "@/components/Icons";

export const SOURCE_ICONS = {
  facebook: { label: "Facebook", color: "#1877F2", Icon: FacebookIcon },
  zalo: { label: "Zalo", color: "#0068FF", Icon: ZaloIcon },
  instagram: { label: "Instagram", color: "#E95950", Icon: InstagramIcon },
  google: { label: "Google", color: "#FBBC05", Icon: GoogleIcon },
  website: { label: "Website", color: "#8B5CF6", Icon: WebsiteIcon },
} as const;

export type SourceIconKey = keyof typeof SOURCE_ICONS;

export const DEFAULT_SOURCE_ICON: SourceIconKey = "facebook";

export const SOURCE_ICON_OPTIONS = (
  Object.keys(SOURCE_ICONS) as SourceIconKey[]
).map((value) => ({ label: SOURCE_ICONS[value].label, value }));

export const getSourceColor = (icon: string) =>
  SOURCE_ICONS[icon as SourceIconKey]?.color ??
  SOURCE_ICONS[DEFAULT_SOURCE_ICON].color;
