/**
 * @file index.tsx
 * @description Harmony Calculator & Multi-Unit Converter Mini-App Module.
 * Features standard and scientific calculation engine, memory tape, and unit converters.
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calculator as CalcIcon, 
  RotateCcw, 
  History, 
  ArrowLeftRight, 
  Percent, 
  Divide, 
  X, 
  Minus, 
  Plus, 
  Equal,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { triggerHaptic } from '../../utils/haptics';

type CalcMode = 'calculator' | 'converter';
type ConverterType = 'currency' | 'length' | 'weight' | 'temperature';

export const HarmonyCalculatorApp: React.FC = () => {
  const theme = useTheme();
  const isDarkMode = theme.isDark;

  const [mode, setMode] = useState<CalcMode>('calculator');
  const [display, setDisplay] = useState<string>('0');
  const [prevVal, setPrevVal] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [overwrite, setOverwrite] = useState<boolean>(true);
  const [history, setHistory] = useState<string[]>([]);
  const [isScientific, setIsScientific] = useState<boolean>(false);

  // Converter state
  const [converterType, setConverterType] = useState<ConverterType>('currency');
  const [convertInput, setConvertInput] = useState<string>('100');
  const [fromUnit, setFromUnit] = useState<string>('USD');
  const [toUnit, setToUnit] = useState<string>('EUR');

  // Input numbers
  const handleDigit = (digit: string) => {
    triggerHaptic('light');
    if (overwrite || display === '0') {
      setDisplay(digit);
      setOverwrite(false);
    } else {
      if (display.length < 12) {
        setDisplay(display + digit);
      }
    }
  };

  const handleDecimal = () => {
    triggerHaptic('light');
    if (overwrite) {
      setDisplay('0.');
      setOverwrite(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleClear = () => {
    triggerHaptic('medium');
    setDisplay('0');
    setPrevVal(null);
    setOperation(null);
    setOverwrite(true);
  };

  const handleOperator = (op: string) => {
    triggerHaptic('selection');
    const current = parseFloat(display);
    if (prevVal !== null && operation && !overwrite) {
      const result = compute(prevVal, current, operation);
      setPrevVal(result);
      setDisplay(String(result));
    } else {
      setPrevVal(current);
    }
    setOperation(op);
    setOverwrite(true);
  };

  const handleEquals = () => {
    triggerHaptic('medium');
    if (prevVal === null || !operation) return;
    const current = parseFloat(display);
    const result = compute(prevVal, current, operation);
    const equation = `${prevVal} ${operation} ${current} = ${result}`;
    setHistory((prev) => [equation, ...prev.slice(0, 9)]);
    setDisplay(String(result));
    setPrevVal(null);
    setOperation(null);
    setOverwrite(true);
  };

  const compute = (a: number, b: number, op: string): number => {
    let res = 0;
    switch (op) {
      case '+': res = a + b; break;
      case '-': res = a - b; break;
      case '×': res = a * b; break;
      case '÷': res = b !== 0 ? a / b : 0; break;
      case '^': res = Math.pow(a, b); break;
      default: res = b;
    }
    return Math.round(res * 100000000) / 100000000;
  };

  const handlePercent = () => {
    triggerHaptic('light');
    const val = parseFloat(display) / 100;
    setDisplay(String(val));
  };

  const handleToggleSign = () => {
    triggerHaptic('light');
    const val = parseFloat(display) * -1;
    setDisplay(String(val));
  };

  const handleSciFunc = (fn: string) => {
    triggerHaptic('selection');
    const val = parseFloat(display);
    let res = val;
    switch (fn) {
      case 'sin': res = Math.sin(val); break;
      case 'cos': res = Math.cos(val); break;
      case 'tan': res = Math.tan(val); break;
      case 'sqrt': res = Math.sqrt(val); break;
      case 'ln': res = Math.log(val); break;
      case 'pi': res = Math.PI; break;
      case 'e': res = Math.E; break;
    }
    res = Math.round(res * 1000000) / 1000000;
    setDisplay(String(res));
    setOverwrite(true);
  };

  // Convert function
  const computeConversion = (): string => {
    const val = parseFloat(convertInput) || 0;
    if (converterType === 'currency') {
      const ratesToUSD: Record<string, number> = {
        USD: 1,
        EUR: 1.08,
        GBP: 1.28,
        JPY: 0.0067,
        ETB: 0.0084,
      };
      const inUSD = val * (ratesToUSD[fromUnit] || 1);
      const converted = inUSD / (ratesToUSD[toUnit] || 1);
      return converted.toFixed(2);
    }
    if (converterType === 'length') {
      const meters: Record<string, number> = {
        m: 1,
        km: 1000,
        mi: 1609.34,
        ft: 0.3048
      };
      const inM = val * (meters[fromUnit] || 1);
      const converted = inM / (meters[toUnit] || 1);
      return converted.toFixed(4);
    }
    if (converterType === 'temperature') {
      if (fromUnit === 'C' && toUnit === 'F') return ((val * 9/5) + 32).toFixed(1);
      if (fromUnit === 'F' && toUnit === 'C') return (((val - 32) * 5/9)).toFixed(1);
      return val.toFixed(1);
    }
    return val.toString();
  };

  return (
    <div className={`h-full w-full flex flex-col items-center overflow-y-auto p-4 select-none ${
      isDarkMode ? 'bg-[#0d1117] text-white' : 'bg-neutral-100 text-neutral-900'
    }`}>
      {/* Top Segmented Mode Switcher */}
      <div className="w-full max-w-sm flex items-center justify-between mb-4">
        <div className={`flex items-center p-1 rounded-2xl border ${
          isDarkMode ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-neutral-300 shadow-sm'
        }`}>
          <button
            onClick={() => setMode('calculator')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              mode === 'calculator' ? 'bg-amber-500 text-white shadow-xs' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <CalcIcon className="w-3.5 h-3.5" />
            <span>Calculator</span>
          </button>
          <button
            onClick={() => setMode('converter')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              mode === 'converter' ? 'bg-amber-500 text-white shadow-xs' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Converter</span>
          </button>
        </div>

        {mode === 'calculator' && (
          <button
            onClick={() => setIsScientific(!isScientific)}
            className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition-all ${
              isScientific
                ? 'bg-indigo-600 text-white border-indigo-500'
                : isDarkMode
                  ? 'bg-[#161b22] border-[#30363d] text-neutral-400 hover:text-white'
                  : 'bg-white border-neutral-300 text-neutral-600 shadow-xs'
            }`}
          >
            {isScientific ? 'Sci Mode On' : 'Scientific'}
          </button>
        )}
      </div>

      {mode === 'calculator' ? (
        <div className="w-full max-w-sm flex flex-col">
          {/* LCD Display */}
          <div className={`p-4 rounded-3xl mb-3 text-right flex flex-col justify-end border shadow-inner ${
            isDarkMode ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-neutral-300'
          }`}>
            <div className="h-5 text-xs text-neutral-400 font-mono overflow-hidden">
              {prevVal !== null && operation && `${prevVal} ${operation}`}
            </div>
            <div className="text-4xl sm:text-5xl font-extralight tracking-tight truncate font-mono">
              {display}
            </div>
          </div>

          {/* Scientific Row if enabled */}
          {isScientific && (
            <div className="grid grid-cols-5 gap-2 mb-2">
              {['sin', 'cos', 'tan', 'sqrt', 'pi'].map((fn) => (
                <button
                  key={fn}
                  onClick={() => handleSciFunc(fn)}
                  className={`py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                    isDarkMode ? 'bg-[#21262d] text-indigo-300 hover:bg-[#30363d]' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                  }`}
                >
                  {fn}
                </button>
              ))}
            </div>
          )}

          {/* Standard Keypad Grid */}
          <div className="grid grid-cols-4 gap-2.5">
            {/* Row 1 */}
            <button
              onClick={handleClear}
              className="py-4 rounded-2xl text-base font-bold bg-neutral-400 dark:bg-neutral-700 text-neutral-900 dark:text-white hover:opacity-90 active:scale-95 transition-all"
            >
              {display !== '0' || prevVal !== null ? 'C' : 'AC'}
            </button>
            <button
              onClick={handleToggleSign}
              className="py-4 rounded-2xl text-base font-bold bg-neutral-400 dark:bg-neutral-700 text-neutral-900 dark:text-white hover:opacity-90 active:scale-95 transition-all"
            >
              ±
            </button>
            <button
              onClick={handlePercent}
              className="py-4 rounded-2xl text-base font-bold bg-neutral-400 dark:bg-neutral-700 text-neutral-900 dark:text-white hover:opacity-90 active:scale-95 transition-all"
            >
              %
            </button>
            <button
              onClick={() => handleOperator('÷')}
              className={`py-4 rounded-2xl text-lg font-bold transition-all ${
                operation === '÷' ? 'bg-white text-amber-500' : 'bg-amber-500 hover:bg-amber-400 text-white'
              }`}
            >
              ÷
            </button>

            {/* Row 2 */}
            {['7', '8', '9'].map((d) => (
              <button
                key={d}
                onClick={() => handleDigit(d)}
                className={`py-4 rounded-2xl text-lg font-medium transition-all active:scale-95 ${
                  isDarkMode ? 'bg-[#21262d] text-white hover:bg-[#30363d]' : 'bg-white text-neutral-900 hover:bg-neutral-200 shadow-xs'
                }`}
              >
                {d}
              </button>
            ))}
            <button
              onClick={() => handleOperator('×')}
              className={`py-4 rounded-2xl text-lg font-bold transition-all ${
                operation === '×' ? 'bg-white text-amber-500' : 'bg-amber-500 hover:bg-amber-400 text-white'
              }`}
            >
              ×
            </button>

            {/* Row 3 */}
            {['4', '5', '6'].map((d) => (
              <button
                key={d}
                onClick={() => handleDigit(d)}
                className={`py-4 rounded-2xl text-lg font-medium transition-all active:scale-95 ${
                  isDarkMode ? 'bg-[#21262d] text-white hover:bg-[#30363d]' : 'bg-white text-neutral-900 hover:bg-neutral-200 shadow-xs'
                }`}
              >
                {d}
              </button>
            ))}
            <button
              onClick={() => handleOperator('-')}
              className={`py-4 rounded-2xl text-lg font-bold transition-all ${
                operation === '-' ? 'bg-white text-amber-500' : 'bg-amber-500 hover:bg-amber-400 text-white'
              }`}
            >
              −
            </button>

            {/* Row 4 */}
            {['1', '2', '3'].map((d) => (
              <button
                key={d}
                onClick={() => handleDigit(d)}
                className={`py-4 rounded-2xl text-lg font-medium transition-all active:scale-95 ${
                  isDarkMode ? 'bg-[#21262d] text-white hover:bg-[#30363d]' : 'bg-white text-neutral-900 hover:bg-neutral-200 shadow-xs'
                }`}
              >
                {d}
              </button>
            ))}
            <button
              onClick={() => handleOperator('+')}
              className={`py-4 rounded-2xl text-lg font-bold transition-all ${
                operation === '+' ? 'bg-white text-amber-500' : 'bg-amber-500 hover:bg-amber-400 text-white'
              }`}
            >
              +
            </button>

            {/* Row 5 */}
            <button
              onClick={() => handleDigit('0')}
              className={`col-span-2 py-4 rounded-2xl text-lg font-medium pl-6 text-left transition-all active:scale-95 ${
                isDarkMode ? 'bg-[#21262d] text-white hover:bg-[#30363d]' : 'bg-white text-neutral-900 hover:bg-neutral-200 shadow-xs'
              }`}
            >
              0
            </button>
            <button
              onClick={handleDecimal}
              className={`py-4 rounded-2xl text-lg font-medium transition-all active:scale-95 ${
                isDarkMode ? 'bg-[#21262d] text-white hover:bg-[#30363d]' : 'bg-white text-neutral-900 hover:bg-neutral-200 shadow-xs'
              }`}
            >
              .
            </button>
            <button
              onClick={handleEquals}
              className="py-4 rounded-2xl text-lg font-bold bg-amber-500 hover:bg-amber-400 text-white active:scale-95 transition-all shadow-md"
            >
              =
            </button>
          </div>

          {/* History Roll */}
          {history.length > 0 && (
            <div className="mt-4 p-3 rounded-2xl border text-xs bg-neutral-50 dark:bg-[#161b22] border-neutral-200 dark:border-[#30363d]">
              <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-neutral-200 dark:border-neutral-700">
                <span className="font-semibold text-neutral-400 flex items-center gap-1">
                  <History className="w-3 h-3" /> Recent Computations
                </span>
                <button
                  onClick={() => setHistory([])}
                  className="text-[10px] text-neutral-400 hover:text-rose-400"
                >
                  Clear Tape
                </button>
              </div>
              <div className="space-y-1 font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                {history.slice(0, 3).map((item, i) => (
                  <p key={i} className="truncate">{item}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Multi-Unit Converter Tab */
        <div className="w-full max-w-sm space-y-4">
          <div className="flex items-center justify-center gap-2">
            {(['currency', 'length', 'temperature'] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setConverterType(t);
                  if (t === 'currency') { setFromUnit('USD'); setToUnit('EUR'); }
                  if (t === 'length') { setFromUnit('km'); setToUnit('mi'); }
                  if (t === 'temperature') { setFromUnit('C'); setToUnit('F'); }
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize border transition-all ${
                  converterType === t
                    ? 'bg-amber-500 text-white border-amber-500'
                    : isDarkMode
                      ? 'bg-[#161b22] border-[#30363d] text-neutral-400'
                      : 'bg-white border-neutral-300 text-neutral-600'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className={`p-4 rounded-3xl border shadow-sm ${
            isDarkMode ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-neutral-200'
          }`}>
            <label className="text-xs text-neutral-400 block mb-1">Source Value</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={convertInput}
                onChange={(e) => setConvertInput(e.target.value)}
                className={`flex-1 p-2 rounded-xl text-lg font-bold font-mono outline-none border ${
                  isDarkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-neutral-50 border-neutral-300'
                }`}
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className={`p-2 rounded-xl text-xs font-bold font-mono outline-none border ${
                  isDarkMode ? 'bg-[#0d1117] border-[#30363d] text-white' : 'bg-neutral-50 border-neutral-300'
                }`}
              >
                {converterType === 'currency' && ['USD', 'EUR', 'GBP', 'JPY', 'ETB'].map(u => <option key={u} value={u}>{u}</option>)}
                {converterType === 'length' && ['km', 'm', 'mi', 'ft'].map(u => <option key={u} value={u}>{u}</option>)}
                {converterType === 'temperature' && ['C', 'F'].map(u => <option key={u} value={u}>°{u}</option>)}
              </select>
            </div>

            <div className="flex items-center justify-center my-3">
              <button
                onClick={() => {
                  const temp = fromUnit;
                  setFromUnit(toUnit);
                  setToUnit(temp);
                }}
                className="p-2 rounded-full bg-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-white transition-all"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            </div>

            <label className="text-xs text-neutral-400 block mb-1">Converted Result</label>
            <div className="flex items-center gap-2">
              <div className={`flex-1 p-2.5 rounded-xl text-xl font-bold font-mono border ${
                isDarkMode ? 'bg-[#0d1117] border-[#30363d] text-emerald-400' : 'bg-neutral-50 border-neutral-300 text-emerald-600'
              }`}>
                {computeConversion()}
              </div>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className={`p-2 rounded-xl text-xs font-bold font-mono outline-none border ${
                  isDarkMode ? 'bg-[#0d1117] border-[#30363d] text-white' : 'bg-neutral-50 border-neutral-300'
                }`}
              >
                {converterType === 'currency' && ['USD', 'EUR', 'GBP', 'JPY', 'ETB'].map(u => <option key={u} value={u}>{u}</option>)}
                {converterType === 'length' && ['km', 'm', 'mi', 'ft'].map(u => <option key={u} value={u}>{u}</option>)}
                {converterType === 'temperature' && ['C', 'F'].map(u => <option key={u} value={u}>°{u}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
