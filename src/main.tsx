import {StrictMode, useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {AdminApp} from './admin/AdminApp.tsx';
import {BlogIndexPage} from './pages/BlogIndexPage.tsx';
import {BlogPostPage} from './pages/BlogPostPage.tsx';
import './index.css';

function normalizePath(p: string) {
  if (!p) return '/';
  // remove trailing slash except root, and keep case
  const cleaned = p.replace(/\/+$/, '') || '/';
  return cleaned.toLowerCase() === '/admin' ? '/admin' : cleaned;
}

function Root() {
  const [path, setPath] = useState(() => {
    try {
      return window.location.pathname.replace(/\/+$/, '') || '/';
    } catch { return '/'; }
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      try {
        setPath(window.location.pathname.replace(/\/+$/, '') || '/');
      } catch {}
    };
    const onPop = () => update();
    // intercept pushState/replaceState for SPA navigation
    const origPush = history.pushState;
    const origReplace = history.replaceState;
    (history as any).pushState = function(...args: any[]) {
      const ret = origPush.apply(this, args as any);
      update();
      return ret;
    };
    (history as any).replaceState = function(...args: any[]) {
      const ret = origReplace.apply(this, args as any);
      update();
      return ret;
    };
    window.addEventListener('popstate', onPop);
    // global error handler for admin rendering issues
    const onErr = (e: ErrorEvent) => {
      console.error('Global error:', e.error || e.message);
      if (window.location.pathname.startsWith('/admin')) {
        setError(e.message || 'Admin rendering error');
      }
    };
    window.addEventListener('error', onErr);
    window.addEventListener('unhandledrejection', (e: any) => {
      console.error('Unhandled rejection:', e.reason);
      if (window.location.pathname.startsWith('/admin')) {
        setError(String(e.reason?.message || e.reason || 'Admin async error'));
      }
    });
    return () => {
      window.removeEventListener('popstate', onPop);
      window.removeEventListener('error', onErr);
      history.pushState = origPush;
      history.replaceState = origReplace;
    };
  }, []);

  // normalize for matching
  const lower = path.toLowerCase();
  if (lower === '/admin' || lower.startsWith('/admin/')) {
    if (error) {
      return (
        <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-6">
          <div className="bg-white border border-[#fecaca] rounded-[18px] p-6 max-w-lg w-full">
            <h1 className="font-medium">Admin panel error</h1>
            <p className="text-sm text-[#57534e] mt-2">{error}</p>
            <p className="text-xs text-[#78716c] mt-3">Try hard refresh. If persists, check console. Default password: RudraAdmin@2025</p>
            <a href="/" className="mt-4 inline-block text-sm underline">Back to home</a>
          </div>
        </div>
      );
    }
    return <AdminApp />;
  }
  if (lower === '/blog') {
    return <BlogIndexPage />;
  }
  if (lower.startsWith('/blog/')) {
    const slug = decodeURIComponent(path.slice('/blog/'.length));
    return <BlogPostPage slug={slug} />;
  }
  return <App />;
}

const rootEl = document.getElementById('root');
if (!rootEl) {
  document.body.innerHTML = '<div style="padding:20px;font-family:sans-serif">Root element not found — check index.html</div>';
} else {
  createRoot(rootEl).render(
    <StrictMode>
      <Root />
    </StrictMode>,
  );
}
