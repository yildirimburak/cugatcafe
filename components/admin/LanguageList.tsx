'use client';

import { Language } from '@/lib/firebase/languages';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface LanguageListProps {
  languages: Language[];
  onEdit: (language: Language) => void;
  onDelete: (id: string) => void;
  onToggleEnabled: (id: string, enabled: boolean) => void;
}

export function LanguageList({
  languages,
  onEdit,
  onDelete,
  onToggleEnabled,
}: LanguageListProps) {
  return (
    <div className="space-y-4">
      {languages.length === 0 ? (
        <p className="text-center text-slate-500 dark:text-slate-400 py-8">
          Henüz dil eklenmemiş
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {languages.map((language) => (
            <div
              key={language.id}
              className={`bg-white dark:bg-gray-800 p-4 rounded-xl border ${
                language.enabled 
                  ? 'border-slate-200 dark:border-gray-700' 
                  : 'border-slate-300 dark:border-gray-600 opacity-60'
              } flex justify-between items-center hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-600 transition-all`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {language.code}
                  </span>
                  {language.enabled ? (
                    <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                      Aktif
                    </span>
                  ) : (
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                      Pasif
                    </span>
                  )}
                </div>
                <h3 className="font-medium text-slate-900 dark:text-white mt-2">
                  {language.nativeName}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {language.name}
                </p>
              </div>
              <div className="flex flex-col gap-2 ml-4">
                <button
                  onClick={() => onToggleEnabled(language.id, !language.enabled)}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    language.enabled
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      : 'bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-300 dark:hover:bg-green-800'
                  }`}
                >
                  {language.enabled ? 'Pasif Yap' : 'Aktif Yap'}
                </button>
                <div className="flex gap-1">
                  <button
                    onClick={() => onEdit(language)}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all hover:scale-110"
                    title="Düzenle"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  {language.code !== 'tr' && (
                    <button
                      onClick={() => onDelete(language.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                      title="Sil"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

