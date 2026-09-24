import React, { useState } from 'react';
import { X, FileText, Check } from 'lucide-react';
import { useTypingStore } from '../../store/useTypingStore';

export function CustomTextModal() {
  const { showCustomModal, setShowCustomModal, setCustomText, customText } = useTypingStore();
  const [value, setValue] = useState(customText || '');

  if (!showCustomModal) return null;

  const handleApply = () => {
    if (value.trim().length > 0) {
      setCustomText(value.trim());
    }
    setShowCustomModal(false);
  };

  const wordCount = value.split(/\s+/).filter(Boolean).length;
  const charCount = value.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <FileText className="text-cyan-400" size={18} />
            <h2 className="text-base font-bold text-white font-display">
              Custom Practice Buffer
            </h2>
          </div>
          <button
            onClick={() => setShowCustomModal(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-400">
            Paste any technical documentation, code snippets, articles, or custom drills. Line breaks and punctuation are fully supported.
          </p>

          <textarea
            rows={8}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Paste or write your custom practice text here..."
            className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 font-mono text-sm focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/40 transition-all resize-none"
          />

          <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>{charCount} characters</span>
            <span>{wordCount} words</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-3 border-t border-slate-800 bg-slate-950/50">
          <button
            onClick={() => setShowCustomModal(false)}
            className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={value.trim().length === 0}
            className="flex items-center gap-1.5 px-5 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:pointer-events-none text-white rounded-xl text-xs font-semibold transition-colors shadow-md shadow-cyan-600/30"
          >
            <Check size={14} />
            <span>Load Custom Text</span>
          </button>
        </div>
      </div>
    </div>
  );
}
