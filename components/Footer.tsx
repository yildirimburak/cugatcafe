import { Link } from '@/routing';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-10 border-t border-zinc-100 py-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-xs text-zinc-400">© {year} Cugat Café</p>
        <Link href="/gizlilik" className="text-xs text-zinc-400 underline hover:text-zinc-600">
          Gizlilik & KVKK
        </Link>
      </div>
    </footer>
  );
}
