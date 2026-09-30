import React from 'react';

interface OfficialAFLIALogoProps {
  className?: string;
  variant?: 'color' | 'white' | 'on-navy';
  mode?: 'full' | 'mark-only' | 'horizontal';
  showBackgroundCard?: boolean;
}

/**
 * Official Logo for ALPINE FALCON LIFE INSURANCE AGENCY, INC. (AFLIA)
 * 
 * Recreated exactly from the official asset "LOGO AlpineFalcon_GoldNavyBLue-04.png":
 * - Left: Navy Blue geometric "A" with angled outer stroke, horizontal base, and inner triangular notch
 * - Right: Golden Falcon with sharp beak pointing left, white eye dot, dual ascending wings, and tapered tail
 * - Typography: "ALPINE FALCON" in bold navy Roman flared capitals with arched crescent crossbars on the "A"s
 * - Subtitle: "LIFE INSURANCE AGENCY, INC." tracked serif small caps
 * - Strict preserveAspectRatio="xMidYMid meet" on all modes to prevent ANY distortion
 */
export const OfficialAFLIALogo: React.FC<OfficialAFLIALogoProps> = ({
  className = 'w-full max-w-[340px] h-auto',
  variant = 'color',
  mode = 'full',
  showBackgroundCard = false,
}) => {
  const isWhite = variant === 'white' || variant === 'on-navy';
  const navyFill = isWhite ? '#ffffff' : 'url(#afliaNavyGrad)';
  const goldFill = isWhite ? '#FCD34D' : 'url(#afliaGoldGrad)';
  const eyeColor = isWhite ? '#0f2252' : '#ffffff';
  const titleColor = isWhite ? '#ffffff' : '#0f2357';
  const subColor = isWhite ? '#FCD34D' : '#344563';

  // 1. Full Stacked Official Logo (1000 x 650 aspect ratio)
  if (mode === 'full') {
    return (
      <div
        className={`inline-block ${
          showBackgroundCard
            ? 'bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-200/80 ring-1 ring-slate-900/5'
            : ''
        }`}
      >
        <svg
          viewBox="0 0 1000 650"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
          className={className}
          role="img"
          aria-label="Official Logo - Alpine Falcon Life Insurance Agency, Inc."
        >
          <defs>
            {/* Navy Blue Gradient - Exact matches to brand asset */}
            <linearGradient id="afliaNavyGrad" x1="20%" y1="100%" x2="80%" y2="0%">
              <stop offset="0%" stopColor="#0d1b42" />
              <stop offset="45%" stopColor="#12255e" />
              <stop offset="100%" stopColor="#233e84" />
            </linearGradient>

            {/* Golden Falcon Gradient */}
            <linearGradient id="afliaGoldGrad" x1="15%" y1="10%" x2="85%" y2="90%">
              <stop offset="0%" stopColor="#f5c22e" />
              <stop offset="50%" stopColor="#e7ab1f" />
              <stop offset="100%" stopColor="#d59414" />
            </linearGradient>
          </defs>

          {/* EMBLEM MARK: AF MONOGRAM (Centered around X = 500) */}
          <g id="official-af-emblem">
            {/* Navy Blue 'A' Geometric Glyph with Slanted Outer Stroke & Triangular Stencil Notch */}
            <path
              d="M 380 360 L 455 224 L 484 244 L 444 320 L 512 320 L 532 360 Z"
              fill={navyFill}
            />

            {/* Golden Falcon Head, Throat, Breast and Lower Tail */}
            <path
              d="M 445 204 C 454 196 466 188 482 186 C 494 186 506 192 512 202 L 512 210 L 488 238 C 478 226 466 216 444 212 L 445 204 Z"
              fill={goldFill}
            />

            {/* Falcon Breast line and Body sitting on baseline */}
            <path
              d="M 488 238 C 496 250 508 266 520 286 L 546 360 L 606 360 L 574 316 L 556 264 L 540 226 L 512 210 L 488 238 Z"
              fill={goldFill}
            />

            {/* Falcon Eye Dot */}
            <circle cx="472" cy="199" r="4.2" fill={eyeColor} />

            {/* Primary Upper Wing Bar */}
            <path
              d="M 494 204 L 568 94 C 576 86 588 92 590 102 L 528 230 L 494 204 Z"
              fill={goldFill}
            />

            {/* Secondary Parallel Wing Bar */}
            <path
              d="M 540 226 L 592 148 C 598 142 606 146 607 154 L 556 264 L 540 226 Z"
              fill={goldFill}
            />
          </g>

          {/* TYPOGRAPHY: ALPINE FALCON */}
          <text
            x="500"
            y="448"
            textAnchor="middle"
            fill={titleColor}
            fontFamily="'Cinzel', 'Cinzel Decorative', 'Trajan Pro', 'Bodoni MT', 'Times New Roman', serif"
            fontSize="72"
            fontWeight="800"
            letterSpacing="0.14em"
          >
            ALPINE FALCON
          </text>

          {/* Signature upward-curving crossbars for 'A' in ALPINE and 'A' in FALCON */}
          <path
            d="M 164 433 Q 176 424 188 433 Q 176 427 164 433 Z"
            fill={titleColor}
          />
          <path
            d="M 576 433 Q 588 424 600 433 Q 588 427 576 433 Z"
            fill={titleColor}
          />

          {/* TYPOGRAPHY: LIFE INSURANCE AGENCY, INC. */}
          <text
            x="500"
            y="516"
            textAnchor="middle"
            fill={subColor}
            fontFamily="'Georgia', 'Times New Roman', 'Didot', serif"
            fontSize="25"
            fontWeight="700"
            letterSpacing="0.34em"
          >
            LIFE INSURANCE AGENCY, INC.
          </text>
        </svg>
      </div>
    );
  }

  // 2. Horizontal Header Lockup (540 x 100 aspect ratio)
  if (mode === 'horizontal') {
    return (
      <svg
        viewBox="0 0 540 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        className={className}
        role="img"
        aria-label="Alpine Falcon Official Horizontal Logo"
      >
        <defs>
          <linearGradient id="navNavyGrad" x1="20%" y1="100%" x2="80%" y2="0%">
            <stop offset="0%" stopColor="#0d1b42" />
            <stop offset="100%" stopColor="#233e84" />
          </linearGradient>
          <linearGradient id="navGoldGrad" x1="15%" y1="10%" x2="85%" y2="90%">
            <stop offset="0%" stopColor="#f5c22e" />
            <stop offset="100%" stopColor="#d59414" />
          </linearGradient>
        </defs>

        {/* Scaled Emblem on the Left (X: 12 to 82, Y: 8 to 92) */}
        <g transform="translate(-105, -18) scale(0.307)">
          {/* Navy Blue 'A' Geometric Glyph */}
          <path
            d="M 380 360 L 455 224 L 484 244 L 444 320 L 512 320 L 532 360 Z"
            fill={navyFill}
          />

          {/* Golden Falcon Head */}
          <path
            d="M 445 204 C 454 196 466 188 482 186 C 494 186 506 192 512 202 L 512 210 L 488 238 C 478 226 466 216 444 212 L 445 204 Z"
            fill={goldFill}
          />

          {/* Breast & Body */}
          <path
            d="M 488 238 C 496 250 508 266 520 286 L 546 360 L 606 360 L 574 316 L 556 264 L 540 226 L 512 210 L 488 238 Z"
            fill={goldFill}
          />

          {/* Eye Dot */}
          <circle cx="472" cy="199" r="4.2" fill={eyeColor} />

          {/* Upper Wing */}
          <path
            d="M 494 204 L 568 94 C 576 86 588 92 590 102 L 528 230 L 494 204 Z"
            fill={goldFill}
          />

          {/* Lower Wing */}
          <path
            d="M 540 226 L 592 148 C 598 142 606 146 607 154 L 556 264 L 540 226 Z"
            fill={goldFill}
          />
        </g>

        {/* Text next to Emblem */}
        <text
          x="98"
          y="52"
          fill={titleColor}
          fontFamily="'Cinzel', 'Cinzel Decorative', 'Trajan Pro', 'Georgia', 'Times New Roman', serif"
          fontSize="28"
          fontWeight="800"
          letterSpacing="0.12em"
        >
          ALPINE FALCON
        </text>

        {/* Crossbar accents on header 'A's */}
        <path
          d="M 99.5 46 Q 104 43 108.5 46 Q 104 44 99.5 46 Z"
          fill={titleColor}
        />
        <path
          d="M 260 46 Q 264.5 43 269 46 Q 264.5 44 260 46 Z"
          fill={titleColor}
        />

        <text
          x="99"
          y="76"
          fill={subColor}
          fontFamily="'Georgia', 'Times New Roman', serif"
          fontSize="11"
          fontWeight="700"
          letterSpacing="0.26em"
        >
          LIFE INSURANCE AGENCY, INC.
        </text>
      </svg>
    );
  }

  // 3. Emblem Mark Only (Square 290 x 290 aspect ratio)
  return (
    <svg
      viewBox="348 80 290 290"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      role="img"
      aria-label="Alpine Falcon AF Emblem"
    >
      <defs>
        <linearGradient id="markNavyGrad" x1="20%" y1="100%" x2="80%" y2="0%">
          <stop offset="0%" stopColor="#0d1b42" />
          <stop offset="100%" stopColor="#233e84" />
        </linearGradient>
        <linearGradient id="markGoldGrad" x1="15%" y1="10%" x2="85%" y2="90%">
          <stop offset="0%" stopColor="#f5c22e" />
          <stop offset="100%" stopColor="#d59414" />
        </linearGradient>
      </defs>

      {/* Navy Blue 'A' Geometric Glyph */}
      <path
        d="M 380 360 L 455 224 L 484 244 L 444 320 L 512 320 L 532 360 Z"
        fill={navyFill}
      />

      {/* Golden Falcon Head */}
      <path
        d="M 445 204 C 454 196 466 188 482 186 C 494 186 506 192 512 202 L 512 210 L 488 238 C 478 226 466 216 444 212 L 445 204 Z"
        fill={goldFill}
      />

      {/* Breast & Body */}
      <path
        d="M 488 238 C 496 250 508 266 520 286 L 546 360 L 606 360 L 574 316 L 556 264 L 540 226 L 512 210 L 488 238 Z"
        fill={goldFill}
      />

      {/* Eye Dot */}
      <circle cx="472" cy="199" r="4.2" fill={eyeColor} />

      {/* Upper Wing */}
      <path
        d="M 494 204 L 568 94 C 576 86 588 92 590 102 L 528 230 L 494 204 Z"
        fill={goldFill}
      />

      {/* Lower Wing */}
      <path
        d="M 540 226 L 592 148 C 598 142 606 146 607 154 L 556 264 L 540 226 Z"
        fill={goldFill}
      />
    </svg>
  );
};
