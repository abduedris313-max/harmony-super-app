import { AjamRule } from '../types';

/**
 * Detailed Ajam Script Mapping Table for Ethiopian Phonemes
 */
export const AJAM_RULES: AjamRule[] = [
  {
    soundName: 'P sound (ፕ)',
    ethiopicChar: 'ፕ',
    latinPhonetic: 'P',
    ajamChar: 'پ',
    arabicBase: 'Ba (ب)',
    diacriticDescription: 'Three dots under Ba (پ)',
    exampleWordAjam: 'پـَـپـَـያ',
    exampleWordEthiopic: 'ፓፓያ',
    exampleMeaning: 'Papaya'
  },
  {
    soundName: 'CH sound (ቸ / ቻ)',
    ethiopicChar: 'ቸ',
    latinPhonetic: 'Ch',
    ajamChar: 'چ',
    arabicBase: 'Jim (ج)',
    diacriticDescription: 'Three dots inside Jim (چ)',
    exampleWordAjam: 'چـَـو',
    exampleWordEthiopic: 'ጨው / ቸዉ',
    exampleMeaning: 'Salt'
  },
  {
    soundName: 'ZH sound (ዠ / ዥ)',
    ethiopicChar: 'ዠ',
    latinPhonetic: 'Zh',
    ajamChar: 'ژ',
    arabicBase: 'Zayn (ز)',
    diacriticDescription: 'Three dots above Zayn (ژ)',
    exampleWordAjam: 'ژَنْـدَه',
    exampleWordEthiopic: 'ዠንዳ',
    exampleMeaning: 'Flag / Banner'
  },
  {
    soundName: 'G hard sound (ገ / ጊ)',
    ethiopicChar: 'ገ',
    latinPhonetic: 'G',
    ajamChar: 'گ',
    arabicBase: 'Kaf (ك)',
    diacriticDescription: 'Top horizontal bar on Kaf (گ) or 3 dots above Kaf (ڭ)',
    exampleWordAjam: 'گَـبَـتَـا',
    exampleWordEthiopic: 'ገበታ',
    exampleMeaning: 'Dining tray / Meal'
  },
  {
    soundName: 'V sound (ቨ / ቪ)',
    ethiopicChar: 'ቨ',
    latinPhonetic: 'V',
    ajamChar: 'ڤ',
    arabicBase: 'Fa (ف)',
    diacriticDescription: 'Three dots above Fa (ڤ)',
    exampleWordAjam: 'ڤِـتَـامِـيـنْ',
    exampleWordEthiopic: 'ቪታሚን',
    exampleMeaning: 'Vitamin'
  },
  {
    soundName: 'NY / Ñ sound (ኘ / ኙ)',
    ethiopicChar: 'ኘ',
    latinPhonetic: 'Ñ',
    ajamChar: 'ݧ',
    arabicBase: 'Nun (ن)',
    diacriticDescription: 'Three dots above Nun (ݧ) or Nya',
    exampleWordAjam: 'ݧَـاطَـا',
    exampleWordEthiopic: 'ኛጣ',
    exampleMeaning: 'Feather / Soft hair'
  },
  {
    soundName: 'CH ejective (ጨ)',
    ethiopicChar: 'ጨ',
    latinPhonetic: "Ch'",
    ajamChar: 'ڞ',
    arabicBase: 'Sad (ص) / Jim (ج)',
    diacriticDescription: 'Sad with three dots or Jim with inverted dots',
    exampleWordAjam: 'ڞَـلُـو',
    exampleWordEthiopic: 'ጨለማ',
    exampleMeaning: 'Darkness'
  },
  {
    soundName: 'T ejective (ጠ)',
    ethiopicChar: 'ጠ',
    latinPhonetic: "T'",
    ajamChar: 'ط',
    arabicBase: 'Ta (ط)',
    diacriticDescription: 'Emphatic Ta (ط) used for Ethiopic glottal T',
    exampleWordAjam: 'طَـيـنَـا',
    exampleWordEthiopic: 'ጤና',
    exampleMeaning: 'Health'
  },
  {
    soundName: 'K ejective / Glottal (ቀ / ቃ)',
    ethiopicChar: 'ቀ',
    latinPhonetic: "Q / K'",
    ajamChar: 'ق',
    arabicBase: 'Qaf (ق)',
    diacriticDescription: 'Qaf (ق) used for Ethiopic glottal Q/K',
    exampleWordAjam: 'قَـلْـبِـي',
    exampleWordEthiopic: 'ቀልቤ',
    exampleMeaning: 'My Heart'
  }
];

/**
 * Virtual Ajam Keyboard layout keys for interactive touch typing
 */
export const VIRTUAL_AJAM_KEYBOARD = [
  ['پ', 'چ', 'ژ', 'گ', 'ڤ', 'ݧ', 'ڞ', 'ط', 'ق'],
  ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج'],
  ['ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك', 'ط'],
  ['ئ', 'ء', 'ؤ', 'ر', 'لا', 'ى', 'ة', 'و', 'ز', 'ظ'],
  ['َ', 'ُ', 'ِ', 'ْ', 'ّ', 'ً', 'ٌ', 'ٍ', 'ٰ', '፡', '፤']
];

/**
 * Fast client-side Ethiopic to Ajam script converter
 */
export function convertEthiopicToAjam(text: string): string {
  if (!text) return '';
  
  let result = text;
  
  // Basic character replacements
  const map: { [key: string]: string } = {
    'ሀ': 'ه', 'ሁ': 'هو', 'ሂ': 'هي', 'ሃ': 'ها', 'ሄ': 'هي', 'ህ': 'ه', 'ሆ': 'ሆ',
    'ለ': 'ل', 'ሉ': 'لو', 'ሊ': 'لي', 'ላ': 'لا', 'ሌ': 'لي', 'ል': 'ل', 'ሎ': 'لو',
    'ሐ': 'ح', 'ሑ': 'حو', 'ሒ': 'حي', 'ሓ': 'حا', 'ሔ': 'حي', 'ሕ': 'ح', 'ሖ': 'حو',
    'መ': 'م', 'ሙ': 'ሙ', 'ሚ': 'مي', 'ማ': 'ما', 'ሜ': 'مي', 'ም': 'م', 'ሞ': 'ሞ',
    'ሠ': 'س', 'ረ': 'ر', 'ሩ': 'رو', 'ሪ': 'ري', 'ራ': 'را', 'ሬ': 'ري', 'ር': 'ر', 'ሮ': 'رو',
    'ሰ': 'س', 'ሱ': 'سو', 'ሲ': 'سي', 'ሳ': 'سا', 'ሴ': 'سي', 'ስ': 'س', 'ሶ': 'سو',
    'ሸ': 'ش', 'ሹ': 'شو', 'ሺ': 'شي', 'ሻ': 'شا', 'ሼ': 'شي', 'ሽ': 'ش', 'ሾ': 'شو',
    'ቀ': 'ق', 'ቁ': 'ቁ', 'ቂ': 'قي', 'ቃ': 'قا', 'ቄ': 'قي', 'ቅ': 'ق', 'ቆ': 'ቆ',
    'በ': 'ب', 'ቡ': 'بو', 'ቢ': 'بي', 'ባ': 'با', 'ቤ': 'بي', 'ብ': 'ب', 'ቦ': 'ቦ',
    'ተ': 'ت', 'ቱ': 'ቱ', 'ቲ': 'تي', 'ታ': 'تا', 'ቴ': 'تي', 'ት': 'ت', 'ቶ': 'ቶ',
    'ቸ': 'چ', 'ቹ': 'چو', 'ቺ': 'چي', 'ቻ': 'ቻ', 'ቼ': 'چي', 'ች': 'چ', 'ቾ': 'ቾ',
    'ነ': 'ن', 'ኑ': 'ኑ', 'ኒ': 'ني', 'ና': 'ና', 'ኔ': 'ني', 'ን': 'ن', 'ኖ': 'ኖ',
    'ኘ': 'ݧ', 'አ': 'أ', 'ኡ': 'أو', 'ኢ': 'إي', 'ኣ': 'آ', 'ኤ': 'أي', 'እ': 'إ', 'ኦ': 'ኦ',
    'ከ': 'ك', 'ኩ': 'كو', 'ኪ': 'كي', 'ካ': 'كا', 'ኬ': 'كي', 'ክ': 'ك', 'ኮ': 'ኮ',
    'ወ': 'و', 'ዐ': 'ع', 'ዘ': 'ز', 'ዠ': 'ژ', 'የ': 'ي', 'ደ': 'د', 'ጀ': 'ج', 'ገ': 'گ',
    'ጠ': 'ط', 'ጨ': 'ڞ', 'ፈ': 'ف', 'ፐ': 'پ', 'ቪ': 'ڤ'
  };

  for (const [eth, ajam] of Object.entries(map)) {
    result = result.replaceAll(eth, ajam);
  }

  return result;
}
