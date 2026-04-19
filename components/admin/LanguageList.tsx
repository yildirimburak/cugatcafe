'use client';

import { Language } from '@/lib/firebase/languages';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface LanguageListProps {
  languages: Language[];
  onEdit: (language: Language) => void;
  onDelete: (id: string) => void;
  onToggleEnabled: (id: string, enabled: boolean) => void;
}

export function LanguageList({ languages, onEdit, onDelete, onToggleEnabled }: LanguageListProps) {
  if (languages.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-zinc-200">
        <p className="text-zinc-400">Henüz dil eklenmemiş</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
      {languages.map((lang, i) => (
        <div
          key={lang.id}
          className={`flex items-center justify-between px-4 py-3.5 hover:bg-zinc-50 transition-colors ${
            i < languages.length - 1 ? 'border-b border-zinc-100' : ''
          } ${!lang.enabled ? 'opacity-50' : ''}`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-8 h-8 bg-zinc-100 rounded-md flex items-center justify-center text-xs font-mono font-bold text-zinc-600 uppercase flex-shrink-0">
              {lang.code}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-zinc-900 truncate">{lang.nativeName}</p>
              <p className="text-xs text-zinc-500">{lang.name}</p>
            </div>
            <span className={`ml-2 px-1.5 py-0.5 text-[10px] font-medium rounded ${
              lang.enabled ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-500'
            }`}>
              {lang.enabled ? 'Aktif' : 'Pasif'}
            </span>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            {lang.code !== 'tr' && (
              <button
                onClick={() => onToggleEnabled(lang.id, !lang.enabled)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
                  lang.enabled
                    ? 'text-zinc-600 hover:bg-zinc-100'
                    : 'text-emerald-600 hover:bg-emerald-50'
                }`}
              >
                {lang.enabled ? 'Pasif Yap' : 'Aktif Yap'}
              </button>
            )}
            <button onClick={() => onEdit(lang)} className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors">
              <PencilIcon className="w-4 h-4" />
            </button>
            {lang.code !== 'tr' && (
              <button onClick={() => onDelete(lang.id)} className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                <TrashIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
