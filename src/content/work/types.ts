export type Language = "de" | "en";

export interface LocalizedText {
  de: string;
  en: string;
}

export interface WorkImage {
  src: string;
  alt: LocalizedText;
  width?: number;
  height?: number;
}

export interface WorkEntry {
  id: string;
  title: LocalizedText;
  summary: LocalizedText;
  description: LocalizedText;
  year?: number;
  subtitle?: LocalizedText;
  url?: string;
  linkText?: string;
  image?: WorkImage;
  technologies?: string[];
}