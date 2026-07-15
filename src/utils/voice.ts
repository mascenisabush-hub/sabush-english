/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Robust utility to select the most natural-sounding English voice based on requested gender
 * from the available SpeechSynthesis voices.
 */
export function selectVoiceByGender(
  speechSynthesisInstance: SpeechSynthesis,
  gender: 'male' | 'female' = 'male'
): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !speechSynthesisInstance) return null;

  const voices = speechSynthesisInstance.getVoices();
  if (!voices || voices.length === 0) return null;

  // Filter English voices
  const enVoices = voices.filter(v => v.lang.toLowerCase().startsWith('en'));
  if (enVoices.length === 0) return null;

  // Prioritize Google/Microsoft Neural/Natural/Studio/Premium voices
  const highQualityKeywords = ['google', 'natural', 'neural', 'studio', 'premium'];
  
  const maleNames = ['male', 'david', 'mark', 'daniel', 'alex', 'george', 'fred', 'james', 'andrew', 'william', 'brian'];
  const femaleNames = ['female', 'samantha', 'victoria', 'zira', 'susan', 'karen', 'moira', 'tessa', 'hazel', 'fiona', 'veena', 'heera'];

  const targetNames = gender === 'female' ? femaleNames : maleNames;

  // 1. Prioritize Google/Microsoft Neural/Natural/Studio voices that match target gender
  for (const keyword of highQualityKeywords) {
    const candidate = enVoices.find(v => {
      const nameLower = v.name.toLowerCase();
      const hasKeyword = nameLower.includes(keyword);
      const isTargetGender = targetNames.some(name => nameLower.includes(name));
      return hasKeyword && isTargetGender;
    });
    if (candidate) return candidate;
  }

  // 2. Prioritize common target gender voices on different OS
  for (const name of targetNames) {
    const candidate = enVoices.find(v => v.name.toLowerCase().includes(name));
    if (candidate) return candidate;
  }

  // 3. Fallback to any voice with gender keyword in its name/IDs
  const fallbackGenderKeyword = gender === 'female' ? 'female' : 'male';
  const fallbackVoice = enVoices.find(v => v.name.toLowerCase().includes(fallbackGenderKeyword));
  if (fallbackVoice) return fallbackVoice;

  // 4. Default to standard English voices if no voice matching the gender criteria is detected
  // Prioritize US or GB
  const usVoice = enVoices.find(v => v.lang.toLowerCase().includes('us'));
  if (usVoice) return usVoice;

  const gbVoice = enVoices.find(v => v.lang.toLowerCase().includes('gb') || v.lang.toLowerCase().includes('uk'));
  if (gbVoice) return gbVoice;

  return enVoices[0];
}

/**
 * Robust utility to select the most natural-sounding male English voice
 * from the available SpeechSynthesis voices. (Preserved for backwards compatibility)
 */
export function selectMaleVoice(speechSynthesisInstance: SpeechSynthesis): SpeechSynthesisVoice | null {
  return selectVoiceByGender(speechSynthesisInstance, 'male');
}

/**
 * Clears internal codes, level abbreviations, metadata, and non-natural language tags.
 * E.g., "U1-L1: My Career Journey" -> "My Career Journey"
 * "Inic • Hello! What is your name?" -> "Hello! What is your name?"
 */
export function cleanTextForSpeech(text: string): string {
  if (!text) return '';

  let cleaned = text;

  // 1. Remove Unit-Lesson codes like "U1-L1:", "U2-L3 -", "U1-L1"
  cleaned = cleaned.replace(/\bU\d+[-_]L\d+\b[:\s\-\|]*/gi, '');

  // 2. Remove level abbreviations and bullets like "Inic •", "Inter •", "Avanç •", "Beg •", "Int •", "Adv •", "AVANÇ •"
  cleaned = cleaned.replace(/\b(inic|inter|avanç|avanc|iniciante|intermediário|avançado|beginner|intermediate|advanced|beg|int|adv)\b\s*[\•\-\:\*]+\s*/gi, '');

  // 3. Remove standalone level tags like "AVANÇ", "AVANÇADO", etc. when they act as standalone prefixes or metadata
  cleaned = cleaned.replace(/^\s*(avanç|avanc|inic|inter|avançado|intermediário|iniciante|beginner|intermediate|advanced)\b[:\s\-\|]*/gi, '');

  // 4. Clean up letters/symbols parenthetical annotations for clear reading:
  // E.g., "At (@)" -> "At"
  // "Dot (.)" -> "Dot"
  // "Hyphen (-)" -> "Hyphen"
  // "Underscore (_)" -> "Underscore"
  // Keeps the english word before parentheses if it's there
  cleaned = cleaned.replace(/([a-zA-Z\s]+)\s*\([^)]*\)/g, '$1');

  // Strip other leftover punctuation symbols and parentheses that trigger mechanical spelling artifacts
  cleaned = cleaned.replace(/[()_@\-\[\]]/g, ' ');

  // 5. Strip excessive spacing
  cleaned = cleaned.trim().replace(/\s+/g, ' ');

  return cleaned;
}
