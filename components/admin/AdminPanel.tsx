'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { MenuItem, Category } from '@/lib/types';
import { LoginForm } from './LoginForm';
import { MenuItemManager } from './MenuItemManager';
import { CategoryManager } from './CategoryManager';
import { LanguageManager } from './LanguageManager';
import { Header } from '@/components/Header';
import { getMenuItems, getCategories } from '@/lib/firebase/menu';

interface AdminPanelProps {
  locale: string;
}

export function AdminPanel({ locale }: AdminPanelProps) {
  const t = useTranslations('admin');
  const { user, loading } = useAuth();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<'items' | 'categories' | 'languages'>('items');
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (user) {
      async function fetchData() {
        try {
          const [menuItems, categoryList] = await Promise.all([
            getMenuItems(),
            getCategories()
          ]);
          setItems(menuItems);
          setCategories(categoryList);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setDataLoading(false);
        }
      }
      fetchData();
    }
  }, [user]);

  if (loading || (user && dataLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">Yükleniyor...</p>
          </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <LoginForm />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {t('title')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Hoş geldiniz, <span className="font-medium text-indigo-600 dark:text-indigo-400">{user.email}</span>
          </p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 dark:border-gray-700/50 overflow-hidden">
          <div className="border-b border-slate-200 dark:border-gray-700 bg-gradient-to-r from-slate-50 to-indigo-50/30 dark:from-gray-800 dark:to-gray-800">
            <div className="flex gap-1 p-2">
              <button
                onClick={() => setActiveTab('items')}
                className={`px-6 py-3 font-medium transition-all rounded-lg ${
                  activeTab === 'items'
                    ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/50 dark:hover:bg-gray-700/50'
                }`}
              >
                {t('items')}
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`px-6 py-3 font-medium transition-all rounded-lg ${
                  activeTab === 'categories'
                    ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/50 dark:hover:bg-gray-700/50'
                }`}
              >
                {t('categories')}
              </button>
              <button
                onClick={() => setActiveTab('languages')}
                className={`px-6 py-3 font-medium transition-all rounded-lg ${
                  activeTab === 'languages'
                    ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/50 dark:hover:bg-gray-700/50'
                }`}
              >
                Diller
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'items' ? (
              <MenuItemManager 
                items={items}
                categories={categories}
                onItemsChange={setItems}
                locale={locale}
              />
            ) : activeTab === 'categories' ? (
              <CategoryManager
                categories={categories}
                onCategoriesChange={setCategories}
                locale={locale}
              />
            ) : (
              <LanguageManager locale={locale} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

