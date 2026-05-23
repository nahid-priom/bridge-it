'use client';

import { motion } from 'framer-motion';

const ID = 'hero-v2';

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

export function HeroDecorations() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
    >
      {/* Bottom light blue fade */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-sky-50/80 via-transparent to-transparent dark:from-sky-950/30" />

      {/* Far left mint blob */}
      <div className="absolute -left-24 md:-left-32 top-[15%] w-64 h-64 md:w-96 md:h-96 rounded-full bg-teal-200/40 dark:bg-teal-500/10 blur-3xl opacity-80 md:opacity-100 scale-75 md:scale-100" />

      {/* Left top — tilted purple dot cluster */}
      <svg
        className="absolute left-[2%] md:left-[5%] top-[12%] md:top-[14%] w-20 h-20 md:w-28 md:h-28 text-[#6D35F5] opacity-50 md:opacity-70 -rotate-12"
        viewBox="0 0 100 100"
      >
        <defs>
          <pattern id={`${ID}-cluster`} width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="4" r="3" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill={`url(#${ID}-cluster)`} />
      </svg>

      {/* Purple sparkle — mid left near headline */}
      <motion.div
        className="absolute left-[14%] md:left-[18%] top-[32%] md:top-[30%]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <FourPointStar className="w-4 h-4 md:w-5 md:h-5" color="#6D35F5" />
      </motion.div>

      {/* Green plus accent — lower left */}
      <span className="absolute left-[10%] md:left-[12%] top-[48%] md:top-[46%] text-[#00A85A] text-xl md:text-2xl font-light opacity-60 md:opacity-80">
        +
      </span>

      {/* Right top — green sparkle */}
      <motion.div
        className="absolute right-[22%] md:right-[26%] top-[16%] md:top-[14%]"
        animate={{ scale: [1, 1.15, 1], opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
      >
        <FourPointStar className="w-4 h-4 md:w-5 md:h-5" color="#00A85A" />
      </motion.div>

      {/* Paper plane + dashed flight path */}
      <motion.svg
        className="absolute right-[2%] sm:right-[4%] md:right-[8%] top-[8%] sm:top-[10%] w-36 h-40 sm:w-44 sm:h-48 md:w-56 md:h-60 opacity-70 sm:opacity-90 md:opacity-100"
        viewBox="0 0 220 240"
        fill="none"
        animate={{ y: [0, -10, 0], x: [0, 4, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <path
          d="M25 200 C 70 150, 110 120, 155 75"
          stroke="#6D35F5"
          strokeWidth="2.5"
          strokeDasharray="7 9"
          strokeLinecap="round"
          opacity="0.55"
          className="dark:opacity-40"
        />
        <g transform="translate(148, 58) rotate(-18)">
          <path
            d="M0 28 L52 2 L36 38 L54 56 L0 28 Z"
            fill="#00A85A"
            className="drop-shadow-[0_4px_12px_rgba(0,168,90,0.35)]"
          />
          <path d="M14 26 L36 14 L30 30 Z" fill="#059669" opacity="0.45" />
        </g>
      </motion.svg>

      {/* Right — purple wave fan (ripple lines) */}
      <svg
        className="absolute -right-4 md:right-0 top-[22%] h-[55%] w-24 md:w-32 text-[#6D35F5] opacity-25 md:opacity-40 dark:opacity-20 dark:md:opacity-30 hidden sm:block"
        viewBox="0 0 80 200"
        preserveAspectRatio="none"
        fill="none"
      >
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <path
            key={i}
            d={`M0 ${20 + i * 22} Q ${40 + i * 3} ${10 + i * 20}, 80 ${25 + i * 22}`}
            stroke="currentColor"
            strokeWidth={1.2 - i * 0.05}
            opacity={0.9 - i * 0.08}
          />
        ))}
      </svg>

      {/* Mid-right purple star */}
      <motion.div
        className="absolute right-[12%] md:right-[16%] top-[38%] md:top-[36%] hidden sm:block"
        animate={{ opacity: [0.4, 0.75, 0.4] }}
        transition={{ duration: 3.5, repeat: Infinity }}
      >
        <FourPointStar className="w-3.5 h-3.5 md:w-4 md:h-4" color="#6D35F5" />
      </motion.div>

      {/* Bottom right — yellow star */}
      <motion.div
        className="absolute right-[6%] md:right-[10%] bottom-[28%] md:bottom-[30%]"
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 2.8, repeat: Infinity, delay: 0.2 }}
      >
        <FourPointStar className="w-3 h-3 md:w-4 md:h-4" color="#FBBF24" />
      </motion.div>

      {/* Bottom right — purple star */}
      <motion.div
        className="absolute right-[14%] md:right-[18%] bottom-[22%] md:bottom-[24%]"
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 3.2, repeat: Infinity, delay: 0.6 }}
      >
        <FourPointStar className="w-2.5 h-2.5 md:w-3.5 md:h-3.5" color="#6D35F5" />
      </motion.div>

      {/* Soft purple glow — right */}
      <div className="absolute top-0 right-0 w-[45%] h-[70%] bg-gradient-to-bl from-violet-100/50 via-transparent to-transparent dark:from-violet-900/20 blur-2xl" />
    </div>
  );
}
