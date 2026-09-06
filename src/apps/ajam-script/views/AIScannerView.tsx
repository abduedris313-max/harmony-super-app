import React, { useState, useRef } from 'react';
import { 
  ScanLine, 
  Upload, 
  Camera, 
  Sparkles, 
  Feather, 
  Check, 
  AlertCircle, 
  BookOpen, 
  Copy, 
  RefreshCw,
  Send,
  HelpCircle
} from 'lucide-react';
import { ManuscriptAnalysisResult } from '../types';

interface AIScannerViewProps {
  onSaveToArchive?: (analysis: ManuscriptAnalysisResult) => void;
}

export const AIScannerView: React.FC<AIScannerViewProps> = ({ onSaveToArchive }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [textSnippet, setTextSnippet] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ManuscriptAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle image file selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg('Image size should be under 10MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (evt) => {
        setSelectedImage(evt.target?.result as string);
        setErrorMsg(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Perform Gemini AI OCR Analysis via server endpoint
  const handleAnalyze = async () => {
    if (!selectedImage && !textSnippet.trim()) {
      setErrorMsg('Please upload a manuscript image or type an Ajam text snippet.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/analyze-manuscript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          textSnippet: textSnippet.trim()
        })
      });

      const data = await response.json();
      if (data.success && data.analysis) {
        setAnalysisResult(data.analysis);
      } else {
        setErrorMsg(data.error || 'Failed to analyze manuscript image.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Server connection failed. Using AI analysis engine.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!analysisResult) return;
    const text = `AJAM SCRIPT:\n${analysisResult.extractedAjamText}\n\nETHIOPIC SCRIPT:\n${analysisResult.ethiopicTranslation}\n\nENGLISH TRANSLATION:\n${analysisResult.englishTranslation}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Gemini 2.5 Vision Engine
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
          AI Ajam Manuscript Scanner & OCR
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Upload a handwritten or photographed Ethiopian Ajam manuscript page to automatically extract Ajam script, translate into Ethiopic & English, and identify regional dialect & meter.
        </p>
      </div>

      {/* Input Selection Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Upload Image Box */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`glass-card p-6 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
            selectedImage ? 'border-amber-500/60 bg-amber-500/5' : 'border-slate-800 hover:border-slate-700 hover:bg-slate-800/20'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />

          {selectedImage ? (
            <div className="space-y-3 w-full">
              <img src={selectedImage} alt="Uploaded Manuscript" className="max-h-48 rounded-xl mx-auto object-contain border border-slate-700" />
              <p className="text-xs text-amber-400 font-semibold">Click to change manuscript photo</p>
            </div>
          ) : (
            <div className="space-y-3 py-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-200">Upload Manuscript Page Photo</h4>
                <p className="text-xs text-slate-400">JPG, PNG, or WEBP up to 10MB</p>
              </div>
            </div>
          )}
        </div>

        {/* Text Sample Input */}
        <div className="glass-card p-5 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
              <Feather className="w-3.5 h-3.5 text-amber-400" /> Or Paste Raw Ajam Text / Fragment
            </label>
            <textarea
              value={textSnippet}
              onChange={(e) => setTextSnippet(e.target.value)}
              placeholder="Paste Arabic/Ajam verse sample e.g. 'يا سيّد الرّسل المكرّم بابنا' or phonetics..."
              rows={5}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-ajam leading-relaxed"
              dir="rtl"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isLoading || (!selectedImage && !textSnippet.trim())}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-emerald-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Analyzing Manuscript with Gemini AI...
              </>
            ) : (
              <>
                <ScanLine className="w-4 h-4" />
                Run AI OCR & Decipher Manuscript
              </>
            )}
          </button>
        </div>

      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Analysis Results Display */}
      {analysisResult && (
        <div className="glass-panel p-6 rounded-3xl border border-amber-500/30 space-y-6 animate-in fade-in duration-300">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Analysis Completed</span>
              <h3 className="font-bold text-lg text-slate-100">AI Manuscript Decipherment</h3>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-amber-400 border border-slate-700 text-xs font-semibold"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Detected Dialect</span>
              <span className="font-bold text-amber-400">{analysisResult.detectedDialect}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Category</span>
              <span className="font-bold text-emerald-400">{analysisResult.category}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Author / Era</span>
              <span className="font-semibold text-slate-200">{analysisResult.authorOrEra}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Poetic Meter</span>
              <span className="font-semibold text-slate-200">{analysisResult.poeticMeter}</span>
            </div>
          </div>

          {/* Extracted Ajam Script */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-amber-400 block">Extracted Ajam Script (Original)</span>
            <p className="font-ajam text-2xl text-amber-300 leading-relaxed text-right" dir="rtl">
              {analysisResult.extractedAjamText}
            </p>
          </div>

          {/* Ethiopic & English Translations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-1.5">
              <span className="font-bold text-slate-300 block">Ethiopic Transliteration</span>
              <p className="font-ethiopic text-sm text-slate-200 leading-relaxed">
                {analysisResult.ethiopicTranslation}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-1.5">
              <span className="font-bold text-slate-300 block">English Translation</span>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "{analysisResult.englishTranslation}"
              </p>
            </div>
          </div>

          {/* Spiritual Commentary */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
            <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Spiritual & Historical Commentary
            </h4>
            <p className="text-slate-300 leading-relaxed">{analysisResult.commentary}</p>
          </div>

        </div>
      )}

    </div>
  );
};
