import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './App.css';
import App from './App.jsx';
import { tenant } from './tenant/config';

document.title = tenant.appTitle;
const themeMeta = document.querySelector('meta[name="theme-color"]');
if (themeMeta) themeMeta.setAttribute('content', tenant.branding.themeColor);
const appleTitle = document.querySelector('meta[name="apple-mobile-web-app-title"]');
if (appleTitle) appleTitle.setAttribute('content', tenant.branding.pwaShortName);
const descMeta = document.querySelector('meta[name="description"]');
if (descMeta) descMeta.setAttribute('content', tenant.description);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
