import React from 'react';

export default function JJSLogo({ className = "h-9 sm:h-11 w-auto", alt = "JJs Running" }) {
  return (
    <img
      src="/images/jjs-logo.png"
      alt={alt}
      className={`object-contain transition-all duration-300 drop-shadow-sm select-none ${className}`}
      style={{
        // On dark themes, subtly enhance stroke visibility so the dark grey lettering pops cleanly on black
        filter: 'var(--logo-filter, none)'
      }}
    />
  );
}
