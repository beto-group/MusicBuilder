const css = `
  .exit-icon { opacity: 0; transition: opacity 0.2s; }
  .djbooth-wrapper:hover .exit-icon { opacity: 0.7; }
  .exit-icon:hover { opacity: 1; }
  .step-button { transition: all 0.1s; }
  .step-button:hover { transform: scale(1.1); }
  .pattern-letter-btn { transition: all 0.15s; position: relative; }
  .pattern-letter-btn:not(:disabled):hover { transform: scale(1.1); box-shadow: 0 0 12px rgba(78, 205, 196, 0.5); }
  
  /* Custom scrollbars for premium look */
  .djbooth-scroll::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .djbooth-scroll::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.3);
  }
  .djbooth-scroll::-webkit-scrollbar-thumb {
    background: rgba(157, 124, 206, 0.4);
    border-radius: 3px;
  }
  .djbooth-scroll::-webkit-scrollbar-thumb:hover {
    background: rgba(157, 124, 206, 0.6);
  }
`;

export { css };
