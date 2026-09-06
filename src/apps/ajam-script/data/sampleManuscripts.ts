import { Manuscript } from '../types';

export const sampleManuscripts: Manuscript[] = [
  {
    id: 'wollo-menzuma-01',
    titleAjam: 'منظومة الشيخ ريّا في مدح النّبيّ',
    titleEthiopic: 'የሼኽ ረያ መንዙማ በነቢዩ ሙሐመድ ሙገሳ',
    titleEnglish: "Sheikh Rayya's Menzuma in Praise of the Prophet",
    author: 'Sheikh Rayya Al-Wollawi',
    region: 'Wollo',
    language: 'Amharic Ajam',
    era: 'Late 19th Century',
    category: 'Menzuma',
    poeticMeter: 'Wollo Bahr (Hexasyllabic Rhyme)',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&fit=crop&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=ambient-arabic-meditation-113578.mp3',
    summary: 'A seminal 19th-century Wollo Sufi manuscript written in Amharic Ajam script, featuring rhythmic devotionals performed during Mawlid and Zikr gatherings.',
    historicalContext: 'Wollo has been the intellectual heartland of Ethiopian Ajam literature since the 17th century. Scholars adapted Arabic letters with three-dot diacritics above and below consonants to write local Amharic sounds like [ch], [g], and [ñ].',
    verified: true,
    likesCount: 142,
    contributorUid: 'scholar-wollo-01',
    contributorName: 'Ustaz Ahmed Wollo Institute',
    createdAt: '2026-01-15T10:00:00Z',
    verses: [
      {
        lineNum: 1,
        ajamText: 'يا سيّد الرّسل المكرّم بابنا',
        ethiopicText: 'ያ ሰይደል ሩስል አል-ሙከረም ባበና',
        englishText: 'O Chief of the honored Messengers, you are our gateway to Divine Grace.',
        audioTimestampStart: 0,
        audioTimestampEnd: 8,
        notes: 'Opening invocation establishing spiritual lineage.'
      },
      {
        lineNum: 2,
        ajamText: 'فيك الهداية والرّجاء ونورنا',
        ethiopicText: 'ፊከል ሂዳያቱ ወር-ረጃኡ ወኑሩና',
        englishText: 'In you is guidance, hope, and our illuminating light.',
        audioTimestampStart: 8,
        audioTimestampEnd: 16,
        notes: 'Classic metaphor of light (Nur) in Ethiopian Sufism.'
      },
      {
        lineNum: 3,
        ajamText: 'شوقي إليك مضاعف متجدّد',
        ethiopicText: 'ሸውቂ እሌከ ሙዳዐፉን ሙተጀዲዱ',
        englishText: 'My yearning for you is manifold and forever renewed.',
        audioTimestampStart: 16,
        audioTimestampEnd: 24
      },
      {
        lineNum: 4,
        ajamText: 'صلي عليك الله ما طرب الشّادي',
        ethiopicText: 'ሰላ አለይከላሁ ማ ጠሪበሽ-ሻዲ',
        englishText: 'May God send blessings upon you as long as the reciter chants in ecstasy.',
        audioTimestampStart: 24,
        audioTimestampEnd: 32
      }
    ]
  },
  {
    id: 'harar-qasida-02',
    titleAjam: 'قصيدة الشيخ سيد صادق الهرري',
    titleEthiopic: 'የሼኽ ሰይድ ሳዲቅ የሐረሪ ዐጀም ቐሲዳ',
    titleEnglish: "Sheikh Sayid Sadiq's Harari Ajam Qasida",
    author: 'Sheikh Sayid Sadiq',
    region: 'Harar',
    language: 'Harari Ajam',
    era: '18th Century',
    category: 'Qasida',
    poeticMeter: 'Bahr Al-Basit',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&fit=crop&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8211a76.mp3?filename=oriental-strings-10022.mp3',
    summary: 'A rare 18th-century manuscript from the walled city of Harar Jugol, transcribing the Harari language into Ajam script with vocalic markers.',
    historicalContext: 'Harar Jugol was an Islamic metropolis where scholars preserved local history and Sufi liturgy in Harari Ajam script. Harari Ajam manuscripts often utilize red rubricated headings and gold leaf borders.',
    verified: true,
    likesCount: 98,
    contributorUid: 'harar-heritage-org',
    contributorName: 'Harar Jugol Heritage Society',
    createdAt: '2026-02-01T12:00:00Z',
    verses: [
      {
        lineNum: 1,
        ajamText: 'أحيا النّفوس بنور ربّ العرش',
        ethiopicText: 'አሕየን-ኑፉሰ ቢኑሪ ረቢል ዐርሽ',
        englishText: 'He revived souls with the light of the Lord of the Throne.',
        audioTimestampStart: 0,
        audioTimestampEnd: 10
      },
      {
        lineNum: 2,
        ajamText: 'هرر المدينة حصن أهل التّقوى',
        ethiopicText: 'ሐረር አል-መዲናቱ ሒስኑ አህሊት-ተቅዋ',
        englishText: 'Harar, the sacred city, is the fortress of the righteous.',
        audioTimestampStart: 10,
        audioTimestampEnd: 20
      }
    ]
  },
  {
    id: 'oromo-zikr-03',
    titleAjam: 'ذكر الشيخ نور حسين بالي بنغم العجم',
    titleEthiopic: 'የሼኽ ኑር ሁሴን ባሌ ዚክር በአፋን ኦሮሞ ዐጀም',
    titleEnglish: 'Afaan Oromo Ajam Zikr of Sheikh Nur Husayn of Bale',
    author: 'Sheikh Nur Husayn Followers',
    region: 'Bale',
    language: 'Oromo Ajam',
    era: 'Early 19th Century',
    category: 'Zikr',
    poeticMeter: 'Oromo Geerarsa Metric Syncopation',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&fit=crop&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9932130e92.mp3?filename=arabic-flute-123490.mp3',
    summary: 'A foundational Afaan Oromo Ajam text praising Sheikh Nur Husayn of Sof Omar, chanted across Bale and Arsi during annual pilgrimage (Khatmma).',
    historicalContext: 'Oromo Ajam manuscripts represent an essential cultural bridge where Afaan Oromo phonetic nuances like implosive consonants and long vowels are captured through unique dot patterns added to Arabic letters.',
    verified: true,
    likesCount: 176,
    contributorUid: 'bale-cultural-center',
    contributorName: 'Bale Heritage & Sufi Archives',
    createdAt: '2026-02-10T08:30:00Z',
    verses: [
      {
        lineNum: 1,
        ajamText: 'ربّي قبينا نور حسين جالاتا',
        ethiopicText: 'ረቢ ቀቢና ኑር ሁሴን ጃላታ',
        englishText: 'Our Lord accepted us; the love of Sheikh Nur Husayn unites us.',
        audioTimestampStart: 0,
        audioTimestampEnd: 9
      },
      {
        lineNum: 2,
        ajamText: 'بالي دتّي نفني جلمت يرتا',
        ethiopicText: 'ባሌ ድቲ ነፍኒ ጀልመታ የርታ',
        englishText: 'In Bale, the spirit finds comfort and divine protection.',
        audioTimestampStart: 9,
        audioTimestampEnd: 18
      }
    ]
  },
  {
    id: 'silte-hymn-04',
    titleAjam: 'أنشودة السلتي العجم للشيخ أحمد الجمي',
    titleEthiopic: 'የሼኽ አሕመድ ጂማ የስልጤ ዐጀም መንዙማ',
    titleEnglish: 'Silte Ajam Hymn of Sheikh Ahmed Al-Jimmi',
    author: 'Sheikh Ahmed Al-Jimmi',
    region: 'Silte',
    language: 'Silte Ajam',
    era: 'Mid 19th Century',
    category: 'Mawlid',
    poeticMeter: 'Silte Dual Rhyme',
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&fit=crop&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=mystic-sufi-loop-11029.mp3',
    summary: 'A melodic Silte Ajam manuscript recited during Friday evening gatherings (Jumaa Zikr) in Gurage and Silte regions.',
    historicalContext: 'Silte Ajam scholars engineered precise letter extensions to represent the palatalized and labialized consonants native to the Silte language.',
    verified: true,
    likesCount: 84,
    contributorUid: 'silte-scholars-club',
    contributorName: 'Silte Sufi Studies Initiative',
    createdAt: '2026-02-20T14:15:00Z',
    verses: [
      {
        lineNum: 1,
        ajamText: 'سلامي برتي أمت السلتي حنينا',
        ethiopicText: 'ሰላሚ በርቲ ኡመተ ስልጤ ሐኒና',
        englishText: 'Greetings of peace to the compassionate Silte community.',
        audioTimestampStart: 0,
        audioTimestampEnd: 12
      }
    ]
  }
];
