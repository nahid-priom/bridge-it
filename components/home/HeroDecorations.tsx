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

/** Light hero accents — no side-edge color blobs or ripple noise. */
export function HeroDecorations() {
  return (
    <div
      className="pointer-events-none absolute inset-0 select-none overflow-hidden"
      aria-hidden="true"
    >
      <svg
        className="absolute left-[6%] top-[14%] h-14 w-14 text-[#2563EB] opacity-40 md:left-[10%] md:h-16 md:w-16 md:opacity-50 -rotate-12"
        viewBox="0 0 100 100"
      >
        <defs>
          <pattern id={`${ID}-cluster`} width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="2" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill={`url(#${ID}-cluster)`} />
      </svg>

      <motion.div
        className="absolute left-[16%] top-[30%] hidden sm:block"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <FourPointStar className="h-3.5 w-3.5 md:h-4 md:w-4" color="#2563EB" />
      </motion.div>

      <motion.div
        className="absolute right-[20%] top-[16%]"
        animate={{ opacity: [0.45, 0.9, 0.45] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
      >
        <FourPointStar className="h-3.5 w-3.5 md:h-4 md:w-4" color="#00A85A" />
      </motion.div>

      <motion.svg
        className="absolute right-[5%] top-[10%] h-28 w-24 opacity-70 sm:right-[8%] sm:h-36 sm:w-32 md:opacity-85"
        viewBox="0 0 220 240"
        fill="none"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <path
          d="M25 200 C 70 150, 110 120, 155 75"
          stroke="#2563EB"
          strokeWidth="2"
          strokeDasharray="7 9"
          strokeLinecap="round"
          opacity="0.45"
        />
        <g transform="translate(148, 58) rotate(-18)">
          <path d="M0 28 L52 2 L36 38 L54 56 L0 28 Z" fill="#00A85A" />
          <path d="M14 26 L36 14 L30 30 Z" fill="#059669" opacity="0.45" />
        </g>
      </motion.svg>
    </div>
  );
}
