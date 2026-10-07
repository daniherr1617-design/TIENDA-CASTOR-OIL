import React from 'react';
import {norm} from '../theme';

// Pinta un texto y colorea las palabras indicadas en `highlight`.
export const Highlighted: React.FC<{text: string; highlight?: string[]; color: string}> = ({text, highlight = [], color}) => {
  const keys = new Set(highlight.map(norm));
  return (
    <>
      {text.split(/(\s+)/).map((tok, i) =>
        keys.has(norm(tok)) ? (
          <span key={i} style={{color}}>{tok}</span>
        ) : (
          <React.Fragment key={i}>{tok}</React.Fragment>
        ),
      )}
    </>
  );
};
