// Category classifier — Layer 1 of the two-layer lookup.
// Maps a patient message to a broad protocol category before fine-grained search.

import type { ProtocolCategory } from "@/db/schema";

// Every keyword maps to one category. Longer/more specific keywords are checked first.
const CATEGORY_KEYWORDS: [string, ProtocolCategory][] = [
  // Cardiac
  ["chest pain", "cardiac"],
  ["chest pressure", "cardiac"],
  ["heart attack", "cardiac"],
  ["heart racing", "cardiac"],
  ["palpitations", "cardiac"],
  ["tight chest", "cardiac"],
  ["heavy chest", "cardiac"],
  ["left arm pain", "cardiac"],
  ["jaw pain", "cardiac"],
  ["cold sweat", "cardiac"],
  ["heart", "cardiac"],

  // Respiratory
  ["difficulty breathing", "respiratory"],
  ["shortness of breath", "respiratory"],
  ["hard to breathe", "respiratory"],
  ["can't breathe", "respiratory"],
  ["wheezing", "respiratory"],
  ["cough", "respiratory"],
  ["coughing", "respiratory"],
  ["pneumonia", "respiratory"],
  ["asthma", "respiratory"],
  ["lung", "respiratory"],
  ["breathless", "respiratory"],
  ["breathing", "respiratory"],

  // Infectious / febrile
  ["fever", "infectious"],
  ["malaria", "infectious"],
  ["typhoid", "infectious"],
  ["high temperature", "infectious"],
  ["hot body", "infectious"],
  ["chills", "infectious"],
  ["sweating", "infectious"],
  ["rigors", "infectious"],
  ["lassa", "infectious"],
  ["meningitis", "infectious"],
  ["stiff neck", "infectious"],

  // GI
  ["diarrhoea", "gi"],
  ["diarrhea", "gi"],
  ["vomiting", "gi"],
  ["stomach pain", "gi"],
  ["abdominal pain", "gi"],
  ["belly pain", "gi"],
  ["nausea", "gi"],
  ["dehydration", "gi"],
  ["cholera", "gi"],
  ["dysentery", "gi"],
  ["bloody stool", "gi"],
  ["stomach", "gi"],

  // Neurological
  ["sickle cell", "neurological"],
  ["crisis", "neurological"],
  ["stroke", "neurological"],
  ["seizure", "neurological"],
  ["fainting", "neurological"],
  ["dizzy", "neurological"],
  ["dizziness", "neurological"],
  ["confusion", "neurological"],
  ["numbness", "neurological"],
  ["weakness on one side", "neurological"],
  ["head injury", "neurological"],

  // Maternal
  ["pregnant", "maternal"],
  ["pregnancy", "maternal"],
  ["labour", "maternal"],
  ["contraction", "maternal"],
  ["waters broke", "maternal"],
  ["bleeding pregnant", "maternal"],
  ["postpartum", "maternal"],
  ["baby movement", "maternal"],
  ["miscarriage", "maternal"],

  // Trauma
  ["snake bite", "trauma"],
  ["snakebite", "trauma"],
  ["dog bite", "trauma"],
  ["animal bite", "trauma"],
  ["burn", "trauma"],
  ["burned", "trauma"],
  ["fracture", "trauma"],
  ["broken bone", "trauma"],
  ["cut", "trauma"],
  ["bleeding heavily", "trauma"],
  ["accident", "trauma"],
  ["fell", "trauma"],
  ["fall", "trauma"],
  ["injury", "trauma"],
  ["wound", "trauma"],
  ["bleeding", "trauma"],

  // Skin
  ["rash", "skin"],
  ["skin", "skin"],
  ["boil", "skin"],
  ["abscess", "skin"],
  ["cellulitis", "skin"],
  ["itching", "skin"],
  ["itch", "skin"],
  ["swelling", "skin"],
  ["infected", "skin"],

  // Mental
  ["suicidal", "mental"],
  ["depressed", "mental"],
  ["anxiety", "mental"],
  ["panic attack", "mental"],
  ["mental", "mental"],
  ["depression", "mental"],
  ["anxious", "mental"],
  ["can't sleep", "mental"],
  ["stress", "mental"],
];

export function classifyMessage(message: string): { category: ProtocolCategory; confidence: number } {
  const lower = message.toLowerCase();

  // Sort by keyword length descending so "difficulty breathing" matches before "breathing"
  const sorted = [...CATEGORY_KEYWORDS].sort((a, b) => b[0].length - a[0].length);

  for (const [keyword, category] of sorted) {
    if (lower.includes(keyword)) {
      return { category, confidence: 0.8 };
    }
  }

  return { category: "general", confidence: 0.3 };
}

export function getCategoriesForProtocol(protocolId: string): ProtocolCategory | null {
  const map: Record<string, ProtocolCategory> = {
    fever: "infectious",
    chest_pain: "cardiac",
    breathing_difficulty: "respiratory",
  };
  return map[protocolId] ?? null;
}
