/** Animated SVG backdrop: a race-circuit outline with a lap trail and telemetry traces. Pure CSS animation. */
export default function CircuitBackdrop() {
  const track =
    'M180 470 C110 410 140 290 260 262 S430 330 530 246 S704 118 828 170 S1018 250 1046 364 S984 566 842 562 S640 470 520 522 S300 604 180 470 Z';
  return (
    <div className="circuit" aria-hidden="true">
      <svg viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" focusable="false">
        <defs>
          <linearGradient id="trail" x1="0" x2="1">
            <stop offset="0" stopColor="#FFD500" stopOpacity="0" />
            <stop offset="1" stopColor="#FFD500" />
          </linearGradient>
        </defs>

        <path d={track} className="circuit-asphalt" />
        <path d={track} className="circuit-line" />
        <path d={track} className="circuit-lap" pathLength={100} />
        <path d={track} className="circuit-lap circuit-lap-2" pathLength={100} />

        <path id="circuit-path" d={track} fill="none" stroke="none" />
        <g className="circuit-car">
          <g transform="scale(1.1)" stroke="#0c0d10" strokeWidth="1" strokeLinejoin="round">
            {/* wheels */}
            <rect x="-22" y="-14" width="11" height="7" rx="1.5" fill="#1b1d23" stroke="#f4f4ee" />
            <rect x="-22" y="7" width="11" height="7" rx="1.5" fill="#1b1d23" stroke="#f4f4ee" />
            <rect x="12" y="-13" width="9" height="6" rx="1.5" fill="#1b1d23" stroke="#f4f4ee" />
            <rect x="12" y="7" width="9" height="6" rx="1.5" fill="#1b1d23" stroke="#f4f4ee" />
            {/* axles */}
            <rect x="-17" y="-8" width="2" height="16" fill="#f4f4ee" />
            <rect x="15" y="-8" width="2" height="16" fill="#f4f4ee" />
            {/* rear wing */}
            <rect x="-30" y="-12" width="6" height="24" fill="#f4f4ee" />
            {/* front wing */}
            <rect x="22" y="-12" width="6" height="24" fill="#f4f4ee" />
            {/* body: sidepods + nose */}
            <path d="M-26 -3 L-10 -8 L6 -7 L18 -2 L30 -1.5 L30 1.5 L18 2 L6 7 L-10 8 L-26 3 Z" fill="#FFD500" />
            <rect x="-8" y="-4" width="12" height="8" rx="2" fill="#111216" stroke="none" />
            <circle cx="-2" cy="0" r="2.4" fill="#ffffff" stroke="none" />
          </g>
          <animateMotion dur="9s" repeatCount="indefinite" rotate="auto">
            <mpath href="#circuit-path" />
          </animateMotion>
        </g>

        {/* start / finish ticks */}
        <g className="circuit-start">
          <rect x="172" y="440" width="16" height="60" />
        </g>

        {/* telemetry traces */}
        <polyline className="trace trace-a" pathLength={100} points="0,640 80,610 160,650 240,590 320,625 400,570 480,615 560,560 640,600 720,545 800,590 880,540 960,585 1040,530 1120,570 1200,520" />
        <polyline className="trace trace-b" pathLength={100} points="0,670 100,650 200,676 300,640 400,664 500,632 600,660 700,628 800,652 900,622 1000,648 1100,620 1200,640" />

        {/* speed lines */}
        <g className="speed">
          <line x1="60" y1="150" x2="260" y2="150" />
          <line x1="140" y1="205" x2="420" y2="205" />
          <line x1="20" y1="520" x2="190" y2="520" />
          <line x1="900" y1="90" x2="1160" y2="90" />
          <line x1="980" y1="140" x2="1200" y2="140" />
        </g>
      </svg>
    </div>
  );
}
