import { useState, useRef, useCallback, useMemo } from 'react';
import { clsx } from 'clsx';

/**
 * Prize wheel spinner matching SwiftGifts app style.
 * Segment colors from the app: red, gold, dark blue, blue, gray.
 */
const PRIZE_COLORS = ['#DC2626', '#F4C430', '#004499', '#0098EA', '#9A45E5', '#00B843', '#2C2E30', '#0098EA'];

export function WheelSpinner({ prizes = [], onResult, className }) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState(null);

  const segAngle = prizes.length > 0 ? 360 / prizes.length : 360;

  const spin = useCallback(() => {
    if (spinning || !prizes.length) return;
    setSpinning(true);
    setWinner(null);
    const winIndex = Math.floor(Math.random() * prizes.length);
    const targetAngle = 360 * 5 + (360 - winIndex * segAngle - segAngle / 2);
    const newRotation = rotation + targetAngle;
    setRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
      setWinner(prizes[winIndex]);
      onResult?.(prizes[winIndex]);
    }, 4000);
  }, [spinning, prizes, rotation, segAngle, onResult]);

  const R = 90;
  const cx = 100, cy = 100;

  return (
    <div className={clsx('flex flex-col items-center gap-4', className)}>
      <div className="relative">
        {/* Pointer -- arrow at top, styled like app's ArrowDownIcon */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-0.5 z-10">
          <svg width="19" height="22" viewBox="0 0 19 22" fill="none">
            <path d="M9.5 22L0 0h19L9.5 22z" fill="var(--color-text-primary)" />
          </svg>
        </div>

        <svg
          width="200" height="200" viewBox="0 0 200 200"
          style={{
            transform: `rotate(${rotation}deg)`,
            transitionDuration: spinning ? '4s' : '0s',
            transitionTimingFunction: 'cubic-bezier(0.17, 0.67, 0.12, 0.99)',
          }}
        >
          {prizes.map((prize, i) => {
            const startDeg = i * segAngle - 90;
            const endDeg = (i + 1) * segAngle - 90;
            const startRad = (startDeg * Math.PI) / 180;
            const endRad = (endDeg * Math.PI) / 180;
            const x1 = cx + R * Math.cos(startRad);
            const y1 = cy + R * Math.sin(startRad);
            const x2 = cx + R * Math.cos(endRad);
            const y2 = cy + R * Math.sin(endRad);
            const large = segAngle > 180 ? 1 : 0;
            const color = PRIZE_COLORS[i % PRIZE_COLORS.length];
            const midRad = ((startDeg + endDeg) / 2) * Math.PI / 180;
            const tx = cx + 58 * Math.cos(midRad);
            const ty = cy + 58 * Math.sin(midRad);
            const midDeg = (startDeg + endDeg) / 2;
            return (
              <g key={i}>
                <path
                  d={`M${cx},${cy} L${x1},${y1} A${R},${R} 0 ${large},1 ${x2},${y2} Z`}
                  fill={color}
                  stroke="var(--color-surface)"
                  strokeWidth="1"
                />
                <text
                  x={tx} y={ty}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="8"
                  fontWeight="600"
                  fontFamily="inherit"
                  transform={`rotate(${midDeg + 90}, ${tx}, ${ty})`}
                >
                  {prize.label}
                </text>
              </g>
            );
          })}
          {/* Center circle */}
          <circle cx={cx} cy={cy} r="16" fill="var(--color-surface-raised)" stroke="var(--color-border-subtle)" strokeWidth="1.5" />
        </svg>
      </div>

      <button
        onClick={spin}
        disabled={spinning}
        className={clsx(
          'px-8 py-2.5 rounded-xl text-xs font-semibold transition-all',
          spinning
            ? 'bg-surface-raised text-text-muted cursor-not-allowed'
            : 'bg-accent text-white hover:brightness-110',
        )}
      >
        {spinning ? 'Spinning...' : 'Spin'}
      </button>

      {winner && !spinning && (
        <div className="text-center">
          <p className="text-[10px] text-text-muted">You won</p>
          <p className="text-sm font-bold text-accent">{winner.label}</p>
        </div>
      )}
    </div>
  );
}
