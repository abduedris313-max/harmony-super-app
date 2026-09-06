import React, { useState, useRef } from 'react';
import { 
  PlusCircle, 
  Mic, 
  Square, 
  Play, 
  Upload, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Feather, 
  Music,
  User as UserIcon
} from 'lucide-react';
import { User } from 'firebase/auth';
import { addContribution } from '../lib/firebase';

interface ContributeViewProps {
  currentUser: User | null;
  onOpenAuthModal: () => void;
}

export const ContributeView: React.FC<ContributeViewProps> = ({ currentUser, onOpenAuthModal }) => {
  const [title, setTitle] = useState('');
  const [ajamScript, setAjamScript] = useState('');
  const [ethiopicText, setEthiopicText] = useState('');
  const [englishTranslation, setEnglishTranslation] = useState('');
  const [region, setRegion] = useState('Wollo');
  const [language, setLanguage] = useState('Amharic Ajam');
  const [notes, setNotes] = useState('');
  
  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Microphone audio recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      setErrorMsg('Microphone access denied or not available.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuthModal();
      return;
    }

    if (!title.trim() || !ajamScript.trim()) {
      setErrorMsg('Please enter a manuscript title and Ajam script content.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await addContribution({
        title: title.trim(),
        ajamScript: ajamScript.trim(),
        ethiopicText: ethiopicText.trim(),
        englishTranslation: englishTranslation.trim(),
        language,
        region,
        notes: notes.trim(),
        audioUrl: recordedAudioUrl || undefined,
        contributorUid: currentUser.uid,
        contributorName: currentUser.displayName || 'Guest Scholar'
      });

      setSubmittedSuccess(true);
      setTitle('');
      setAjamScript('');
      setEthiopicText('');
      setEnglishTranslation('');
      setNotes('');
      setRecordedAudioUrl(null);
    } catch (err: any) {
      setErrorMsg('Failed to submit contribution to database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <PlusCircle className="w-3.5 h-3.5" /> Community Preservation Workbench
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
          Contribute a Sufi Ajam Manuscript
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Help digitize and preserve rare Wollo, Harar, Silte, or Oromo Ajam verses and record vocal chant recitations (Menzuma/Zikr) for future generations.
        </p>
      </div>

      {!currentUser ? (
        <div className="glass-panel p-8 rounded-3xl text-center space-y-4 border border-amber-500/20">
          <UserIcon className="w-10 h-10 text-amber-400 mx-auto" />
          <h3 className="font-bold text-slate-100">Authentication Required</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Please sign in with Google or as a Guest Scholar to submit manuscript transcriptions and audio recordings.
          </p>
          <button
            onClick={onOpenAuthModal}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-emerald-600 text-slate-950 font-bold text-xs hover:opacity-90 transition-all shadow-lg shadow-amber-500/10"
          >
            Sign In to Contribute
          </button>
        </div>
      ) : submittedSuccess ? (
        <div className="glass-panel p-8 rounded-3xl text-center space-y-4 border border-emerald-500/30 bg-emerald-500/5 animate-in fade-in">
          <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="font-bold text-slate-100 text-lg">Manuscript Submitted Successfully!</h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Thank you for contributing to the Harmony Ajam digital repository. Your contribution is saved in Firestore and under community review.
          </p>
          <button
            onClick={() => setSubmittedSuccess(false)}
            className="px-6 py-2.5 rounded-2xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all"
          >
            Submit Another Manuscript
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Manuscript / Verse Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Sheikh Rayya Wollo Praise Verse"
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Region</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  {['Wollo', 'Harar', 'Bale', 'Silte', 'Jimma', 'Raya', 'Wallagga'].map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  {['Amharic Ajam', 'Oromo Ajam', 'Harari Ajam', 'Silte Ajam', 'Argobba Ajam'].map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-amber-400 block">Ajam Script Lines (Arabic-based)</label>
            <textarea
              value={ajamScript}
              onChange={(e) => setAjamScript(e.target.value)}
              placeholder="Enter Ajam script text..."
              rows={4}
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-3 text-lg text-amber-300 font-ajam focus:outline-none focus:border-amber-500 text-right leading-relaxed"
              dir="rtl"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Ethiopic Transliteration</label>
              <textarea
                value={ethiopicText}
                onChange={(e) => setEthiopicText(e.target.value)}
                placeholder="Ethiopic script version..."
                rows={3}
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-3 text-xs text-slate-100 font-ethiopic focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">English Translation</label>
              <textarea
                value={englishTranslation}
                onChange={(e) => setEnglishTranslation(e.target.value)}
                placeholder="English translation..."
                rows={3}
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Web Audio Microphone Vocal Chant Recorder */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Music className="w-4 h-4 text-amber-400" /> Vocal Chant Recitation (Optional Audio)
              </span>
              {recordedAudioUrl && <span className="text-[10px] text-emerald-400 font-semibold">Audio Recorded ✓</span>}
            </div>

            <div className="flex items-center gap-3">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={startRecording}
                  className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-2 hover:bg-rose-500 hover:text-white transition-all"
                >
                  <Mic className="w-4 h-4 text-rose-400" /> Record Vocal Chant
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs flex items-center gap-2 animate-pulse"
                >
                  <Square className="w-4 h-4" /> Stop Recording...
                </button>
              )}

              {recordedAudioUrl && (
                <audio src={recordedAudioUrl} controls className="h-8 flex-1" />
              )}
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-emerald-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 hover:opacity-90 disabled:opacity-50 transition-all"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? 'Submitting to Repository...' : 'Publish Contribution to Archive'}
          </button>

        </form>
      )}

    </div>
  );
};
