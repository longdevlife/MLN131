import React from 'react';
import { PresentationShell } from '../presentation/PresentationShell';
import { PresenterConsole } from '../presenter/PresenterConsole';
import '../styles/global.css';

export const App: React.FC = () => {
  // Check whether this window is presenter console mode
  const isPresenterMode = typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('mode') === 'control';

  if (isPresenterMode) {
    return <PresenterConsole />;
  }

  return <PresentationShell />;
};

export default App;
