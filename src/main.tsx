import {StrictMode, useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {AdminApp} from './admin/AdminApp.tsx';
import {BlogIndexPage} from './pages/BlogIndexPage.tsx';
import {BlogPostPage} from './pages/BlogPostPage.tsx';
import './index.css';

function Root() {
  const [path, setPath] = useState(() => window.location.pathname.replace(/\/$/, '') || '/');

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname.replace(/\/$/, '') || '/');
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  if (path === '/admin' || path.startsWith('/admin/')) {
    return <AdminApp />;
  }
  if (path === '/blog') {
    return <BlogIndexPage />;
  }
  if (path.startsWith('/blog/')) {
    const slug = decodeURIComponent(path.slice('/blog/'.length));
    return <BlogPostPage slug={slug} />;
  }
  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
