'use client';

import { motion } from 'framer-motion';

function FourPointStar({
  className,
  color,
}: {
  className?: string;
  color: string;
}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={color} aria-hidden>
      <path d="M12 1.5l2.2 6.8H21l-5.5 4 2.1 6.7L12 18.5l-5.6 4.5 2.1-6.7L3 8.3h6.8L12 1.5z" />
    </svg>
  );
}

/** Premium moving / rotating atmosphere for the consultation page only. */
export function ConsultationAtmosphere() {
  return (
    <div
      className="consultation-atmosphere pointer-events-none absolute inset-0 overflow-hidden select-none"
      aria-hidden
    >
      {/* Soft aurora base */}
      <div className="consultation-aurora absolute inset-0" />

      {/* Drifting glow orbs */}
      <motion.div
        className="absolute -left-20 top-[8%] h-[22rem] w-[22rem] rounded-full bg-teal-400/20 blur-3xl dark:bg-teal-500/15"
        animate={{ x: [0, 36, 0], y: [0, 28, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-16 top-[18%] h-[20rem] w-[20rem] rounded-full bg-blue-500/15 blur-3xl dark:bg-blue-400/12"
        animate={{ x: [0, -40, 0], y: [0, 22, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
      />
      <motion.div
        className="absolute bottom-[8%] left-[28%] h-[18rem] w-[18rem] rounded-full bg-emerald-400/10 blur-3xl dark:bg-cyan-400/10"
        animate={{ x: [0, 24, 0], y: [0, -30, 0], opacity: [0.45, 0.8, 0.45] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
      />

      {/* Slow rotating premium rings */}
      <div className="consultation-ring--lg absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2">
        <svg viewBox="0 0 400 400" className="h-full w-full" fill="none">
          <circle
            cx="200"
            cy="200"
            r="168"
            stroke="url(#consult-ring-a)"
            strokeWidth="1.2"
            strokeDasharray="6 14"
            opacity="0.55"
          />
          <circle
            cx="200"
            cy="200"
            r="132"
            stroke="url(#consult-ring-b)"
            strokeWidth="1"
            strokeDasharray="2 10"
            opacity="0.4"
          />
          <defs>
            <linearGradient id="consult-ring-a" x1="0" y1="0" x2="400" y2="400">
              <stop stopColor="#2563EB" stopOpacity="0.9" />
              <stop offset="0.5" stopColor="#10B981" stopOpacity="0.7" />
              <stop offset="1" stopColor="#22D3EE" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="consult-ring-b" x1="400" y1="0" x2="0" y2="400">
              <stop stopColor="#22D3EE" stopOpacity="0.8" />
              <stop offset="1" stopColor="#2563EB" stopOpacity="0.5" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="consultation-ring--sm absolute right-[6%] top-[22%] hidden sm:block">
        <svg viewBox="0 0 160 160" className="h-full w-full" fill="none">
          <circle
            cx="80"
            cy="80"
            r="62"
            stroke="#60A5FA"
            strokeWidth="1"
            strokeDasharray="4 8"
            opacity="0.35"
          />
        </svg>
      </div>

      {/* Orbiting accent dots */}
      <div className="consultation-orbit absolute left-[12%] top-[55%] hidden h-40 w-40 md:block">
        <span className="consultation-orbit-dot absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-[#60a5fa] shadow-[0_0_12px_rgba(96,165,250,0.8)]" />
      </div>
      <div className="consultation-orbit consultation-orbit--slow absolute right-[14%] top-[48%] hidden h-28 w-28 lg:block">
        <span className="consultation-orbit-dot absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#34d399] shadow-[0_0_10px_rgba(52,211,153,0.75)]" />
      </div>

      {/* Dot cluster */}
      <motion.svg
        className="absolute left-[4%] top-[14%] h-20 w-20 text-[#2563EB] opacity-50 md:left-[8%] md:h-28 md:w-28 md:opacity-65"
        viewBox="0 0 100 100"
        animate={{ rotate: [-12, -6, -12], y: [0, -8, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      >
        <defs>
          <pattern id="consult-dot-cluster" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="4" r="2.5" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#consult-dot-cluster)" />
      </motion.svg>

      {/* Green arrow accent */}
      <motion.svg
        className="absolute right-[4%] top-[12%] h-36 w-32 opacity-80 sm:right-[8%] sm:h-44 sm:w-40 md:opacity-95"
        viewBox="0 0 220 240"
        fill="none"
        animate={{ y: [0, -12, 0], rotate: [0, 3, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <path
          d="M25 200 C 70 150, 110 120, 155 75"
          stroke="#2563EB"
          strokeWidth="2.5"
          strokeDasharray="7 9"
          strokeLinecap="round"
          opacity="0.5"
        />
        <g transform="translate(148, 58) rotate(-18)">
          <path d="M0 28 L52 2 L36 38 L54 56 L0 28 Z" fill="#00A85A" />
          <path d="M14 26 L36 14 L30 30 Z" fill="#059669" opacity="0.45" />
        </g>
      </motion.svg>

      {/* Twinkling stars */}
      <motion.div
        className="absolute left-[18%] top-[28%]"
        animate={{ scale: [1, 1.25, 1], opacity: [0.45, 1, 0.45] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <FourPointStar className="h-4 w-4 md:h-5 md:w-5" color="#2563EB" />
      </motion.div>
      <motion.div
        className="absolute right-[24%] top-[20%]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >
        <FourPointStar className="h-4 w-4 md:h-5 md:w-5" color="#00A85A" />
      </motion.div>
      <motion.div
        className="absolute bottom-[22%] right-[12%]"
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }}
      >
        <FourPointStar className="h-3 w-3 md:h-4 md:w-4" color="#FBBF24" />
      </motion.div>

      {/* Right ripple fan — slow breathe */}
      <motion.svg
        className="absolute -right-2 top-[28%] hidden h-[50%] w-24 text-[#2563EB] opacity-25 sm:block md:w-32 md:opacity-35"
        viewBox="0 0 80 200"
        preserveAspectRatio="none"
        fill="none"
        animate={{ opacity: [0.18, 0.38, 0.18], x: [0, -6, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      >
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <path
            key={i}
            d={`M0 ${20 + i * 22} Q ${40 + i * 3} ${10 + i * 20}, 80 ${25 + i * 22}`}
            stroke="currentColor"
            strokeWidth={1.2 - i * 0.05}
            opacity={0.9 - i * 0.08}
          />
        ))}
      </motion.svg>
    </div>
  );
}
