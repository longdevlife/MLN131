import React from 'react';
import { PresentationShell } from '../presentation/PresentationShell';
import { PresenterConsole } from '../presenter/PresenterConsole';
import { PreflightScreen } from '../preflight/PreflightScreen';
import '../styles/global.css';

export const App: React.FC = () => {
  const isPresenterMode = typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('mode') === 'control';

  const isPreflightMode = typeof window !== 'undefined' &&
    (new URLSearchParams(window.location.search).get('preflight') === '1' ||
     window.location.pathname.endsWith('/preflight'));

  if (isPreflightMode) {
    return <PreflightScreen />;
  }

  if (isPresenterMode) {
    return <PresenterConsole />;
  }

  return <PresentationShell />;
};

export default App;
