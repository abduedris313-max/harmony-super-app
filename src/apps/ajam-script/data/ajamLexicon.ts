/**
 * @file ajamLexicon.ts
 * @description Local JSON-based lexicon and glossary data for Ajam script characters, diacritics, and Sufi manuscript terms.
 */

export interface LexiconEntry {
  id: string;
  termAjam: string;
  termEthiopic: string;
  transliteration: string;
  category: 'character' | 'word' | 'phrase' | 'genre' | 'diacritic';
  dialects: string[];
  englishDefinition: string;
  ethiopicDefinition: string;
  phonetics: string;
  exampleAjam: string;
  exampleEthiopic: string;
  exampleEnglish: string;
  scribalNote: string;
}

export const AJAM_LEXICON: LexiconEntry[] = [
  // --- SPECIAL MODIFIED CHARACTERS ---
  {
    id: 'char-pe',
    termAjam: 'پ',
    termEthiopic: 'ፕ / ፓ',
    transliteration: 'Pe / Pa',
    category: 'character',
    dialects: ['Amharic Ajam', 'Oromo Ajam'],
    englishDefinition: 'Modified Ba (ب) with three dots underneath. Used to represent the non-Arabic voiceless bilabial plosive /p/.',
    ethiopicDefinition: 'የኢትዮጵያ ፕ ድምፅን በዓረብኛ አልፋቤት ለመጻፍ በባ (ب) ሥር ሦስት ነጥቦችን በመጨመር የተሠራ የአጀም ፊደል።',
    phonetics: '/p/',
    exampleAjam: 'پـَـپـَـያ',
    exampleEthiopic: 'ፓፓያ',
    exampleEnglish: 'Papaya',
    scribalNote: 'Widely found in Wollo and Jimma commercial & agricultural manuscripts.'
  },
  {
    id: 'char-che',
    termAjam: 'چ',
    termEthiopic: 'ቸ / ቻ',
    transliteration: 'Che / Cha',
    category: 'character',
    dialects: ['Amharic Ajam', 'Harari Ajam', 'Silte Ajam'],
    englishDefinition: 'Modified Jim (ج) with three dots inside the loop. Represents the palato-alveolar affricate /t͡ʃ/.',
    ethiopicDefinition: 'የቸ/ቻ ድምፅን ለመወከል በጂም (ج) ውስጥ ሦስት ነጥቦችን በማስገባት የተሠራ የአጀም ፊደል።',
    phonetics: '/t͡ʃ/',
    exampleAjam: 'چـَـو',
    exampleEthiopic: 'ጨው / ቸዉ',
    exampleEnglish: 'Salt',
    scribalNote: 'Standard character in Wollo Menzuma couplets and Harari city archives.'
  },
  {
    id: 'char-zhe',
    termAjam: 'ژ',
    termEthiopic: 'ዠ / ዥ',
    transliteration: 'Zhe / Zha',
    category: 'character',
    dialects: ['Amharic Ajam'],
    englishDefinition: 'Modified Zayn (ز) with three dots above. Represents the voiced postalveolar fricative /ʒ/.',
    ethiopicDefinition: 'የዠ ድምፅን ለማመልከት በዛይ (ز) ላይ ሦስት ነጥቦችን በመስቀል የተጻፈ የአጀም ፊደል።',
    phonetics: '/ʒ/',
    exampleAjam: 'ژَنْـدَه',
    exampleEthiopic: 'ዠንዳ',
    exampleEnglish: 'Royal Banner / Flag',
    scribalNote: 'Found in historical chronicle manuscripts and royal Sufi decrees.'
  },
  {
    id: 'char-gaf',
    termAjam: 'گ',
    termEthiopic: 'ገ / ጊ',
    transliteration: 'Gaf / Hard G',
    category: 'character',
    dialects: ['Amharic Ajam', 'Oromo Ajam', 'Silte Ajam'],
    englishDefinition: 'Modified Kaf (ك) with a top horizontal stroke. Represents the hard voiced velar plosive /ɡ/.',
    ethiopicDefinition: 'የገ/ጊ ድምፅን ለመወከል በካፍ (ك) ላይ አግድም መስመር በመጨመር የተሠራ የአጀም ፊደል።',
    phonetics: '/ɡ/',
    exampleAjam: 'گَـبَـتَـا',
    exampleEthiopic: 'ገበታ',
    exampleEnglish: 'Dining Tray / Table',
    scribalNote: 'Essential for Amharic and Afaan Oromo verbs in religious poetry.'
  },
  {
    id: 'char-ve',
    termAjam: 'ڤ',
    termEthiopic: 'ቨ / ቪ',
    transliteration: 'Ve / Va',
    category: 'character',
    dialects: ['Amharic Ajam'],
    englishDefinition: 'Modified Fa (ف) with three dots above representing the labiodental fricative /v/.',
    ethiopicDefinition: 'የቨ/ቪ ድምፅን ለመወከል በፋ (ف) ላይ ሦስት ነጥቦችን በመጨመር የተሠራ የአጀም ፊደል።',
    phonetics: '/v/',
    exampleAjam: 'ڤِـتَـامِـيـنْ',
    exampleEthiopic: 'ቪታሚን',
    exampleEnglish: 'Vitamin / Vitality',
    scribalNote: 'Used in 20th-century medicinal and botanical Ajam texts.'
  },
  {
    id: 'char-nya',
    termAjam: 'ݧ',
    termEthiopic: 'ኘ / ኙ',
    transliteration: 'Nya / Ña',
    category: 'character',
    dialects: ['Amharic Ajam', 'Harari Ajam'],
    englishDefinition: 'Modified Nun (ن) with three dots above representing the palatal nasal /ɲ/.',
    ethiopicDefinition: 'የኘ ድምፅን ለመወከል በኑን (ن) ላይ ሦስት ነጥቦችን በመጨመር የተሠራ የአጀም ፊደል።',
    phonetics: '/ɲ/',
    exampleAjam: 'ݧَـاطَـا',
    exampleEthiopic: 'ኛጣ',
    exampleEnglish: 'Soft Feather',
    scribalNote: 'Crucial for Ethiopian language possessive suffixes and regional place names.'
  },
  {
    id: 'char-tsa',
    termAjam: 'ڞ',
    termEthiopic: 'ጨ / ጪ',
    transliteration: 'Ch\' Ejective (Tsa)',
    category: 'character',
    dialects: ['Amharic Ajam', 'Oromo Ajam', 'Harari Ajam'],
    englishDefinition: 'Special Ajam character derived from Sad (ص) or Jim (ج) with extra dots for glottalized Ch\' /t͡ʃʼ/.',
    ethiopicDefinition: 'የጨ/ጪ ድምፅን (glottalized ch\') ለመግለጽ የተሠራ ልዩ የአጀም ምልክት።',
    phonetics: '/t͡ʃʼ/',
    exampleAjam: 'ڞَـلُـو',
    exampleEthiopic: 'ጨለማ',
    exampleEnglish: 'Darkness',
    scribalNote: 'Common in Wollo Sufi poems contrasting spiritual light (Nur) and darkness (Tsalmat).'
  },

  // --- SUFI & MANUSCRIPT MANUSCRIPT LEXICON ---
  {
    id: 'term-menzuma',
    termAjam: 'منዙማ',
    termEthiopic: 'መንዙማ',
    transliteration: 'Menzuma',
    category: 'genre',
    dialects: ['Amharic Ajam', 'Oromo Ajam', 'Raya Ajam'],
    englishDefinition: 'Traditional Ethiopian Sufi devotional poem composed in rhymed verse and recited in praise of the Prophet Muhammad and holy saints.',
    ethiopicDefinition: 'በኢትዮጵያ እስልምና ባህል ውስጥ በነቢዩና በወልዮች ላይ የሚቀነቀን መንፈሳዊ ግጥምና ዜማ።',
    phonetics: '/mɛn.zu.ma/',
    exampleAjam: 'يا سيّد الرّسل منዙማ',
    exampleEthiopic: 'ያ ሰይደ ረሱል መንዙማ',
    exampleEnglish: 'O Master of Messengers - Menzuma ode.',
    scribalNote: 'The primary musical-literary genre preserved in Wollo manuscript codices.'
  },
  {
    id: 'term-zikr',
    termAjam: 'ذكر',
    termEthiopic: 'ዚክር',
    transliteration: 'Zikr / Dhikr',
    category: 'word',
    dialects: ['All Regional Ajam Dialects'],
    englishDefinition: 'Ritual remembrance and repetition of divine names or sacred couplets, performed individually or in circle assemblies.',
    ethiopicDefinition: 'ፈጣሪን ማመስገንና ማስታወስ የሚያካትት መንፈሳዊ ድርጊትና ዜማ።',
    phonetics: '/ðikr / zikr/',
    exampleAjam: 'ذكر الله دواء القلوب',
    exampleEthiopic: 'ዚክሩላህ ደዋኡል ቁሉብ',
    exampleEnglish: 'The remembrance of Allah is the medicine of hearts.',
    scribalNote: 'Often written in red cinnabar ink (rukn) in manuscript margins.'
  },
  {
    id: 'term-hadra',
    termAjam: 'حضرة',
    termEthiopic: 'ሐድራ',
    transliteration: 'Hadra',
    category: 'genre',
    dialects: ['Wollo Ajam', 'Harari Ajam', 'Bale Ajam'],
    englishDefinition: 'Communal Sufi gathering featuring drum rhythms (Kebero), rhythmic body movement, and collective vocal chant recitations.',
    ethiopicDefinition: 'በከበሮና በዜማ የሚካሄድ የኅብረት መንፈሳዊ ስብሰባና ሥነ-ሥርዓት።',
    phonetics: '/ħadˤ.ra/',
    exampleAjam: 'في الحضرة نور وهداية',
    exampleEthiopic: 'ፊል ሐድራ ኑሩን ወሂዳያ',
    exampleEnglish: 'In the Hadra gathering lies light and spiritual guidance.',
    scribalNote: 'Manuscripts record specific drum patterns and chorus responses for Hadra sessions.'
  },
  {
    id: 'term-tawassul',
    termAjam: 'توسل',
    termEthiopic: 'ተወሱል',
    transliteration: 'Tawassul',
    category: 'phrase',
    dialects: ['Wollo Ajam', 'Jimma Ajam'],
    englishDefinition: 'Intercessory supplication invoking holy saints (Awliya) and spiritual masters to request grace and protection.',
    ethiopicDefinition: 'በወልዮችና በደጎች ስም ወደ ፈጣሪ የሚቀርብ የጸሎትና የትህትና አቤቱታ።',
    phonetics: '/ta.was.sul/',
    exampleAjam: 'توسلنا بأهل الله',
    exampleEthiopic: 'ተወሰልና ቢአህሊላህ',
    exampleEnglish: 'We petition through the holy people of God.',
    scribalNote: 'Serves as the opening stanza in over 60% of Wollo manuscript collections.'
  },
  {
    id: 'term-arham',
    termAjam: 'أرحم الراحمين',
    termEthiopic: 'አርሐመል ራሕሚን',
    transliteration: 'Arham al-Rahimin',
    category: 'phrase',
    dialects: ['Wollo Ajam', 'Harari Ajam'],
    englishDefinition: '"Most Merciful of the Merciful" — standard opening invocation across Ethiopian Sufi manuscripts.',
    ethiopicDefinition: 'የአዛኞች ሁሉ አዛኝ - በየመንዙማው መግቢያ ላይ የሚደጋገም የተቀደሰ አባባል፡',
    phonetics: '/ʔar.ħam ar.raː.ħi.miːn/',
    exampleAjam: 'يا أرحم الراحمين ارزقنا حسن الخاتمة',
    exampleEthiopic: 'ያ አርሐመል ራሕሚን እርዝቅና ሁስነል ኻቲማ',
    exampleEnglish: 'O Most Merciful of the Merciful, grant us a peaceful conclusion.',
    scribalNote: 'Frequently formatted with illuminated vocalization marks (harakat).'
  },
  {
    id: 'term-husn-khatimah',
    termAjam: 'حسن الخاتمة',
    termEthiopic: 'ሁስነል ኻቲማ',
    transliteration: 'Husn al-Khatimah',
    category: 'phrase',
    dialects: ['All Regional Ajam Dialects'],
    englishDefinition: '"A good and blessed conclusion" — traditional closing benediction stanza in Ajam manuscript poems.',
    ethiopicDefinition: 'መልካም ፍጻሜና ሰላማዊ ማጠቃለያ - የመንዙማዎች ማጠቃለያ ጸሎት።',
    phonetics: '/ħusn al.xaː.ti.mah/',
    exampleAjam: 'نسألك يا رب حسن الخاتمة',
    exampleEthiopic: 'ነስአሉከ ያ ረብ ሁስነል ኻቲማ',
    exampleEnglish: 'We ask You, O Lord, for a blessed and peaceful conclusion.',
    scribalNote: 'Marks the explicit end of a manuscript poem section before scribe colophon.'
  },
  {
    id: 'term-sheikh',
    termAjam: 'شيخ',
    termEthiopic: 'ሼኽ / ሼህ',
    transliteration: 'Sheikh',
    category: 'word',
    dialects: ['All Regional Ajam Dialects'],
    englishDefinition: 'Venerated Islamic scholar, spiritual master, or author of Ajam manuscript poetry.',
    ethiopicDefinition: 'የሃይማኖት አባት፣ የመንፈሳዊ ትምህርት መምህር ወይም የአጀም ድርሰት ደራሲ።',
    phonetics: '/ʃajx/',
    exampleAjam: 'الشيخ أحمد البدوي',
    exampleEthiopic: 'ሼኽ አሕመድ አል-በዳዊ',
    exampleEnglish: 'Sheikh Ahmad al-Badawi',
    scribalNote: 'Scribes list Sheikh lineage (Silsila) on frontispiece pages.'
  },
  {
    id: 'term-ajam-general',
    termAjam: 'عجم',
    termEthiopic: 'አጀም',
    transliteration: 'Ajam',
    category: 'word',
    dialects: ['All Regional Ajam Dialects'],
    englishDefinition: 'Literary tradition of writing African languages (Amharic, Afaan Oromo, Harari, Silte) using modified Arabic script.',
    ethiopicDefinition: 'የኢትዮጵያ ቋንቋዎችን በዓረብኛ አልፋቤትና ልዩ ነጥቦች በመጠቀም የመጻፍ የታሪክና የጽሑፍ ጥበብ።',
    phonetics: '/ʕa.ʒam/',
    exampleAjam: 'خط العجم الإثيوبي',
    exampleEthiopic: 'ኸጠል አጀም አል-ኢትዮጵይ',
    exampleEnglish: 'The Ethiopian Ajam Script Tradition',
    scribalNote: 'Prevalent in Wollo, Harar, Jimma, Bale, Silte, and Gurage regions from 17th to 20th centuries.'
  }
];

/**
 * Searches local lexicon for matching character or word queries
 */
export function searchLexicon(query: string): LexiconEntry[] {
  if (!query || !query.trim()) return AJAM_LEXICON;
  const q = query.trim().toLowerCase();
  
  return AJAM_LEXICON.filter(item => 
    item.termAjam.includes(q) ||
    item.termEthiopic.toLowerCase().includes(q) ||
    item.transliteration.toLowerCase().includes(q) ||
    item.englishDefinition.toLowerCase().includes(q) ||
    item.ethiopicDefinition.toLowerCase().includes(q) ||
    item.dialects.some(d => d.toLowerCase().includes(q))
  );
}

/**
 * Finds specific lexicon definition for a character or word
 */
export function lookupLexiconEntry(term: string): LexiconEntry | null {
  if (!term) return null;
  const clean = term.trim();
  
  // Exact match first
  let match = AJAM_LEXICON.find(e => 
    e.termAjam === clean || 
    e.termEthiopic === clean || 
    e.transliteration.toLowerCase() === clean.toLowerCase()
  );

  if (match) return match;

  // Partial match
  match = AJAM_LEXICON.find(e => 
    clean.includes(e.termAjam) || 
    clean.includes(e.termEthiopic) || 
    e.termAjam.includes(clean)
  );

  return match || null;
}
