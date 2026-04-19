'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/lib/hooks/useAuth';
import { MenuItem, Category } from '@/lib/types';
import { LoginForm } from './LoginForm';
import { MenuItemManager } from './MenuItemManager';
import { CategoryManager } from './CategoryManager';
import { LanguageManager } from './LanguageManager';
import { BusinessManager } from './BusinessManager';
import { ReviewManager } from './ReviewManager';
import { subscribeToMenuItems, subscribeToCategories } from '@/lib/firebase/menu';
import {
  Squares2X2Icon,
  TagIcon,
  LanguageIcon,
  BuildingStorefrontIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface AdminPanelProps {
  locale: string;
}

type Tab = 'items' | 'categories' | 'languages' | 'business' | 'reviews';

const tabs: { key: Tab; icon: typeof Squares2X2Icon; label: string }[] = [
  { key: 'items', icon: Squares2X2Icon, label: 'Menü' },
  { key: 'categories', icon: TagIcon, label: 'Kategoriler' },
  { key: 'languages', icon: LanguageIcon, label: 'Diller' },
  { key: 'business', icon: BuildingStorefrontIcon, label: 'İşletme' },
  { key: 'reviews', icon: ChatBubbleLeftRightIcon, label: 'Yorumlar' },
];

export function AdminPanel({ locale }: AdminPanelProps) {
  const adminLocale = 'tr';
  const t = useTranslations('admin');
  const { user, loading, signOut } = useAuth();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('items');
  const [dataLoading, setDataLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setDataLoading(true);
      const unsubscribeItems = subscribeToMenuItems((menuItems) => {
        setItems(menuItems);
        setDataLoading(false);
      });
      const unsubscribeCategories = subscribeToCategories((categoryList) => {
        setCategories(categoryList);
      });
      return () => {
        unsubscribeItems();
        unsubscribeCategories();
      };
    }
  }, [user]);

  if (loading || (user && dataLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-50">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-zinc-500 text-sm">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-zinc-900 text-white
        flex flex-col transition-transform duration-200 ease-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-5 border-b border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
                <span className="text-lg">☕</span>
              </div>
              <div>
                <h1 className="font-bold text-sm tracking-wide">CUGAT CAFE</h1>
                <p className="text-[11px] text-zinc-500">Yönetim Paneli</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-zinc-400 hover:text-white"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white text-zinc-900'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-zinc-800">
          <div className="px-3 py-2 mb-2">
            <p className="text-xs text-zinc-500 truncate">{user.email}</p>
          </div>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors"
          >
            <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-zinc-50/80 backdrop-blur-sm border-b border-zinc-200">
          <div className="flex items-center gap-3 px-4 md:px-8 h-14">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg"
            >
              <Bars3Icon className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-zinc-900">
              {tabs.find(t => t.key === activeTab)?.label}
            </h2>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 md:p-8 max-w-6xl">
          {activeTab === 'items' ? (
            <MenuItemManager
              items={items}
              categories={categories}
              onItemsChange={setItems}
              locale={adminLocale}
            />
          ) : activeTab === 'categories' ? (
            <CategoryManager
              categories={categories}
              onCategoriesChange={setCategories}
              locale={adminLocale}
            />
          ) : activeTab === 'languages' ? (
            <LanguageManager locale={adminLocale} />
          ) : activeTab === 'business' ? (
            <BusinessManager locale={adminLocale} />
          ) : (
            <ReviewManager locale={adminLocale} />
          )}
        </div>
      </main>
    </div>
  );
}
