import React from 'react';
import GameItemSquare from './GameItemSquare';

export default function index({ template = 'HULUSPORT', ...props }) {
  //   if (template == 'TOPBET') return <GameItemPortrate {...props} />;
  return <GameItemSquare {...props} />;
}
