import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

const bg = document.getElementById("bg-parallax");

if (bg) {
  const onScroll = () => {
    const y = window.scrollY * 0.15;
    bg.style.transform = `translate3d(0, ${-y}px, 0)`;
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}
