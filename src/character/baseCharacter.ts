export const CHARACTER_IMAGE_HREF = "/assets/1.png";

export const BASE_CHARACTER_SVG = String.raw`<svg xmlns="http://www.w3.org/2000/svg" id="svgotchi-root" viewBox="0 0 100 100" tabindex="0" role="img" aria-labelledby="svgotchi-title svgotchi-desc">
  <title id="svgotchi-title">SVGotchi uploaded anime companion</title>
  <desc id="svgotchi-desc">An SVG app shell that renders the uploaded character asset from assets/1.png and adds app-owned SVG expression overlays for emotion changes.</desc>
  <style>
    #svgotchi-root { background: #140f1f; }
    .rig-slot { fill: none; opacity: 0; pointer-events: none; }
    .face-slot { pointer-events: none; }
    .character-image { image-rendering: auto; }
    .face-patch { fill: #fff1f0; stroke: #f0c9cf; stroke-width: 0.3; }
    .eye-fill { fill: #6f54b8; stroke: #3c286d; stroke-width: 0.55; }
    .eye-shine { fill: #fffaff; }
    .eye-heart { fill: #ff78ad; stroke: #963f72; stroke-width: 0.35; }
    .mouth-line, .eye-line, .brow-line { fill: none; stroke: #4b2a4d; stroke-width: 1.25; stroke-linecap: round; stroke-linejoin: round; }
    .blush-fill { fill: #ff9ab8; }
    .effect-fill { fill: #ff7dac; }
    .effect-tear { fill: #7ed8ff; }
    .effect-line { stroke: #ffe889; stroke-width: 1.2; stroke-linecap: round; fill: none; }
    .effect-symbol { fill: #ffe889; font-size: 8px; font-weight: 700; }
    .hidden-layer { opacity: 0; }
    .prompt-panel { fill: #211832; stroke: #cbb5ea; stroke-width: 1; }
    .prompt-fill { fill: #140f1f; }
    .prompt-accent { fill: #cdb9ff; }
    text { fill: #f7eaff; font-family: monospace; font-size: 5px; }
  </style>
  <rect id="pet-area" x="0" y="0" width="100" height="80" fill="#140f1f"/>
  <g id="pet">
    <rect id="body" x="10" y="0" width="80" height="80" rx="0" class="rig-slot"/>
    <image id="character-image" href="${CHARACTER_IMAGE_HREF}" x="0" y="0" width="100" height="80" preserveAspectRatio="xMidYMid meet" class="character-image"/>
    <g id="face" class="face-slot">
      <g id="face-cover" opacity="0">
        <ellipse cx="41.8" cy="31.6" rx="7.3" ry="4.9" class="face-patch"/>
        <ellipse cx="58.2" cy="31.6" rx="7.3" ry="4.9" class="face-patch"/>
        <ellipse cx="50" cy="39.9" rx="6" ry="3.3" class="face-patch"/>
      </g>
      <g id="face-features" opacity="0">
        <path id="brow-left" d="M37.2 25.7q4.6-2 9.2 0" class="brow-line" opacity="0"/>
        <path id="brow-right" d="M53.6 25.7q4.6-2 9.2 0" class="brow-line" opacity="0"/>
        <ellipse id="eye-left" cx="41.8" cy="31.6" rx="4.9" ry="5.8" class="eye-fill" opacity="1"/>
        <ellipse id="eye-right" cx="58.2" cy="31.6" rx="4.9" ry="5.8" class="eye-fill" opacity="1"/>
        <circle id="eye-left-shine" cx="40.2" cy="29.2" r="1.1" class="eye-shine" opacity="1"/>
        <circle id="eye-right-shine" cx="56.6" cy="29.2" r="1.1" class="eye-shine" opacity="1"/>
        <path id="eye-left-heart" d="M41.8 29.6c-1.8-3.2-5.8-1.6-5 1.7c.8 3 5 5.5 5 5.5s4.2-2.5 5-5.5c.8-3.3-3.2-4.9-5-1.7z" class="eye-heart" opacity="0"/>
        <path id="eye-right-heart" d="M58.2 29.6c-1.8-3.2-5.8-1.6-5 1.7c.8 3 5 5.5 5 5.5s4.2-2.5 5-5.5c.8-3.3-3.2-4.9-5-1.7z" class="eye-heart" opacity="0"/>
        <path id="mouth" d="M46 40.6h8" class="mouth-line"/>
        <ellipse id="blush-left" cx="36.8" cy="38" rx="5.4" ry="2.1" class="blush-fill" opacity="0"/>
        <ellipse id="blush-right" cx="63.2" cy="38" rx="5.4" ry="2.1" class="blush-fill" opacity="0"/>
      </g>
    </g>
    <g id="effect-hearts" class="hidden-layer">
      <path d="M67 22c-2-4-8-2-6 3c1 3 6 6 6 6s5-3 6-6c2-5-4-7-6-3z" class="effect-fill"/>
    </g>
    <g id="effect-tears" class="hidden-layer">
      <path d="M39 35c-2.8 4.8-1.8 7.5 1 7.5s3.6-2.7-1-7.5z" class="effect-tear"/>
      <path d="M60 35c-2.8 4.8-1.8 7.5 1 7.5s3.6-2.7-1-7.5z" class="effect-tear"/>
    </g>
    <g id="effect-zzz" class="hidden-layer">
      <text x="66" y="20" class="effect-symbol">Zz</text>
    </g>
    <g id="effect-sparkles" class="hidden-layer">
      <path d="M64 19v10M59 24h10M69 16v6M66 19h6" class="effect-line"/>
    </g>
    <g id="effect-question" class="hidden-layer">
      <text x="67" y="26" class="effect-symbol">?</text>
    </g>
    <g id="effect-anger" class="hidden-layer">
      <path d="M65 20l4 5M70 20l-4 5" class="effect-line"/>
    </g>
    <g id="speech-bubble" class="hidden-layer">
      <rect x="20" y="4" width="60" height="13" rx="4" class="prompt-panel"/>
      <path d="M45 17l5 4l3-4" class="prompt-accent"/>
    </g>
  </g>
  <rect id="prompt-area" x="0" y="81" width="100" height="19" fill="#140f1f"/>
  <rect id="prompt-bg" x="2" y="82" width="96" height="16" rx="3" class="prompt-panel"/>
  <text id="prompt-placeholder" x="7" y="92">say hi...</text>
  <text id="prompt-text" x="7" y="92"></text>
  <rect id="prompt-caret" x="7" y="86" width="1" height="8" class="prompt-accent" opacity="0"/>
  <rect id="send-zone" x="84" y="84" width="12" height="12" rx="3" class="prompt-panel"/>
  <text id="send-label" x="87" y="92">&gt;</text>
</svg>
`;
