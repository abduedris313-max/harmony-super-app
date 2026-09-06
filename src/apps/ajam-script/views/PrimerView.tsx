import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Award, 
  ArrowRight,
  Info
} from 'lucide-react';
import { ajamLessons } from '../data/ajamLessons';
import { AJAM_RULES } from '../lib/ajamEngine';

export const PrimerView: React.FC = () => {
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);

  const currentLesson = ajamLessons[selectedLessonIndex];

  const handleSelectOption = (questionIdx: number, optionIdx: number) => {
    setQuizAnswers(prev => ({ ...prev, [questionIdx]: optionIdx }));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <GraduationCap className="w-3.5 h-3.5" /> Educational & Scholar Primer
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
          Ajam Script Literacy & History
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Learn how 18th-century Ethiopian Sufi scholars engineered specialized Arabic letters with localized diacritics to write Amharic, Afaan Oromo, Harari, and Silte.
        </p>
      </div>

      {/* Lesson Selector Segment Control */}
      <div className="flex gap-2 p-1 bg-slate-900 rounded-2xl border border-slate-800">
        {ajamLessons.map((l, idx) => (
          <button
            key={l.id}
            onClick={() => {
              setSelectedLessonIndex(idx);
              setQuizAnswers({});
              setShowResults(false);
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
              selectedLessonIndex === idx 
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {l.title}
          </button>
        ))}
      </div>

      {/* Lesson Content Box */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
        <div>
          <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Lesson {selectedLessonIndex + 1}</span>
          <h3 className="text-xl font-bold text-slate-100">{currentLesson.title}</h3>
          <p className="text-xs text-amber-300 font-medium">{currentLesson.subtitle}</p>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
          {currentLesson.content}
        </p>

        {/* Character Rules Table */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <h4 className="font-bold text-xs uppercase tracking-wider text-amber-400">
            Ajam Character & Diacritic Rules
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentLesson.keyRules.map((rule, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">{rule.soundName}</span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
                    {rule.ethiopicChar} ({rule.latinPhonetic})
                  </span>
                </div>
                <div className="flex items-center justify-between bg-slate-950 p-2 rounded-xl">
                  <span className="text-[11px] text-slate-400">Ajam Glyph:</span>
                  <span className="font-ajam font-bold text-2xl text-amber-300">{rule.ajamChar}</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  <span className="text-amber-400 font-semibold">Rule:</span> {rule.diacriticDescription}
                </p>
                <div className="pt-1 text-[11px] text-slate-300 flex justify-between">
                  <span>Example: <strong className="font-ajam text-amber-300 text-sm">{rule.exampleWordAjam}</strong> ({rule.exampleWordEthiopic})</span>
                  <span className="text-slate-400 italic">"{rule.exampleMeaning}"</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Quiz Section */}
        <div className="pt-6 border-t border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" /> Lesson Quiz & Knowledge Check
            </h4>
          </div>

          <div className="space-y-4">
            {currentLesson.quiz.map((q, qIdx) => (
              <div key={qIdx} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <p className="text-xs font-semibold text-slate-200">
                  {qIdx + 1}. {q.question}
                </p>

                <div className="space-y-2">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = quizAnswers[qIdx] === oIdx;
                    const isCorrect = oIdx === q.answerIndex;
                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectOption(qIdx, oIdx)}
                        className={`w-full text-left p-3 rounded-xl text-xs transition-all flex items-center justify-between ${
                          isSelected 
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold' 
                            : 'bg-slate-800/60 text-slate-300 border border-slate-700/60 hover:bg-slate-700/60'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
