import { Lesson } from '../types';
import { AJAM_RULES } from '../lib/ajamEngine';

export const ajamLessons: Lesson[] = [
  {
    id: 'intro-ajam-history',
    title: 'Introduction to Ethiopian Ajam Script',
    subtitle: 'The Sacred Bridge Between Arabic Orthography and Ethiopian Languages',
    description: 'Learn how Ethiopian Sufi scholars over 300 years ago adapted the Arabic script to transcribe Amharic, Afaan Oromo, Harari, and Silte for religious poetry and songs.',
    content: `For centuries, Sufi scholars in Wollo, Harar, Wallagga, Jimma, and Bale developed "Ajam" (also known as Ajami or Ajamii) — an adapted Arabic orthography tailored to express Ethiopian native phonemes not present in standard Arabic.

In Ethiopian Sufi culture, Ajam allowed reciters (Menzuma chanting groups) to compose devotional poems (*Menzuma*, *Zikr*, *Qasida*) that could be sung in local languages while maintaining the sacred visual aesthetic of Arabic script.

Key Features of Ethiopian Ajam:
1. **Three-Dot Diacritics**: Adding three dots above or below Arabic base letters to represent sounds like [P] (پ), [CH] (چ), [ZH] (ژ), [G] (گ), and [V] (ڤ).
2. **Vowel Order System**: Mapping Arabic short vowels (Fatha, Damma, Kasra) and long vowels (Alif, Waw, Ya) to Ethiopic vowel orders (1st to 7th order).
3. **Regional Variations**: Wollo Ajam, Harari Ajam, and Oromo Ajam each developed subtle localized scribal conventions.`,
    keyRules: AJAM_RULES.slice(0, 5),
    quiz: [
      {
        question: 'What was the primary purpose of developing Ajam script in Ethiopia?',
        options: [
          'To replace the Ge’ez script for government administration',
          'To write local Ethiopian languages in Arabic script for Sufi poetry and songs',
          'To translate European books into Arabic',
          'To encode secret mathematical codes'
        ],
        answerIndex: 1,
        explanation: 'Ajam enabled Sufi scholars and Menzuma poets to transcribe local Ethiopian languages using adapted Arabic letters.'
      },
      {
        question: 'How is the Amharic [CH] sound represented in Ajam script?',
        options: [
          'By adding a circle on top of Alif',
          'By using Jim (ج) with three dots inside (چ)',
          'By doubling the letter Dal',
          'By removing dots from Qaf'
        ],
        answerIndex: 1,
        explanation: 'The letter Che (چ) is formed by adding three dots inside the loop of Jim (ج).'
      }
    ]
  },
  {
    id: 'wollo-sufi-tradition',
    title: 'Wollo Sufi Menzuma & Phonetics',
    subtitle: 'The Epicenter of Amharic Ajam Literature',
    description: 'Explore the rhyming structure of Wollo Menzuma chants and how glottal and ejective Amharic consonants (T\', C\', P\') are rendered in Wollo manuscripts.',
    content: `Wollo is widely revered as the cradle of Ethiopian Sufi poetry. Great Sheikhs like Sheikh Rayya, Sheikh Al-Amoudi, and Sheikh Sayid Bushra composed thousands of verses praising the Prophet Muhammad and seeking spiritual guidance.

Wollo Ajam manuscripts are renowned for their poetic meter (Wollo Bahr) and rhythmic call-and-response refrain during Mawlid celebrations.`,
    keyRules: AJAM_RULES.slice(5),
    quiz: [
      {
        question: 'Which Ethiopian region is famous as the epicenter of Ajam Menzuma poetry?',
        options: ['Gondar', 'Wollo', 'Axum', 'Lalibela'],
        answerIndex: 1,
        explanation: 'Wollo Sufi lodges (Zawiyas) produced the vast majority of Amharic Ajam manuscripts.'
      }
    ]
  }
];
