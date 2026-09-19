import React from 'react';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';

export const KeyboardController: React.FC = () => {
  useKeyboardNavigation();
  return null;
};
