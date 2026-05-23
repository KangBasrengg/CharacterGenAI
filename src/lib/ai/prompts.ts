// AI Prompt Identity System
// Based on PRD Section 9

export const MASTER_PROMPT = `You are a world-class AAA game character designer and 3D concept artist.
Generate visually iconic characters optimized for game development, animation pipelines, and 3D conversion workflows.

Requirements:
- Clean silhouette with strong readability
- Production-ready outfit with detailed but readable accessories
- Balanced color composition with harmonious palettes
- Highly detailed but optimized design suitable for 3D modeling
- Anatomical consistency with proper proportions
- Front-view readability with symmetrical structure
- Stylized realism aesthetic`;

export const SIGNATURE_STYLE = `soft cinematic lighting, high readability, stylized proportions, game-ready concept art, detailed accessories, clean rendering, modern AAA character design aesthetic, strong silhouette, production-ready concept art quality, hero-character vibe`;

export const NEGATIVE_PROMPT = `blurry, low quality, bad anatomy, extra fingers, duplicate limbs, cropped, deformed face, poor lighting, broken mesh, distorted textures, watermark, text, logo, signature, multiple views, multiple characters, busy background`;

export type CharacterStyle =
  | "stylized-realism"
  | "anime"
  | "low-poly"
  | "cyberpunk";
export type Gender = "male" | "female" | "androgynous";
export type PoseMood = "heroic-epic" | "combat-aggressive" | "relaxed-neutral";

const STYLE_MODIFIERS: Record<CharacterStyle, string> = {
  "stylized-realism":
    "stylized realism, semi-realistic rendering, detailed textures, cinematic quality",
  anime:
    "anime style, cel-shaded, vibrant colors, manga-inspired character design, clean linework",
  "low-poly":
    "low-poly style, geometric shapes, minimal textures, flat shading, stylized minimalism",
  cyberpunk:
    "cyberpunk aesthetic, neon glow effects, futuristic technology, dark atmosphere, high-tech accessories",
};

const GENDER_MODIFIERS: Record<Gender, string> = {
  male: "male character, masculine features, strong build",
  female: "female character, feminine features, graceful build",
  androgynous:
    "androgynous character, gender-neutral features, balanced build",
};

const POSE_MODIFIERS: Record<PoseMood, string> = {
  "heroic-epic":
    "heroic standing pose, epic atmosphere, confident expression, dramatic lighting",
  "combat-aggressive":
    "combat-ready stance, aggressive expression, dynamic pose, intense atmosphere",
  "relaxed-neutral":
    "relaxed standing pose, neutral expression, calm atmosphere, natural lighting",
};

export function buildPrompt(
  userPrompt: string,
  style: CharacterStyle = "stylized-realism",
  gender: Gender = "male",
  pose: PoseMood = "heroic-epic"
): string {
  const parts = [
    MASTER_PROMPT,
    `\nCharacter Description: ${userPrompt}`,
    `\nStyle: ${STYLE_MODIFIERS[style]}`,
    `\nCharacter: ${GENDER_MODIFIERS[gender]}`,
    `\nPose & Mood: ${POSE_MODIFIERS[pose]}`,
    `\nAesthetic: ${SIGNATURE_STYLE}`,
    `\nSingle character, full body, centered composition, white/neutral background, concept art sheet`,
  ];

  return parts.join("\n");
}
