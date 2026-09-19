'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { getScoreLabel, getScoreStroke, getScoreTextClass } from '../utils/score-color';

type AtsScoreGaugeProps = {
  score: number;
  className?: string;
};

const SIZE = 168;
const STROKE = 12;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function AtsScoreGauge({ score, className }: AtsScoreGaugeProps) {
  const clamped = Math.min(100, Math.max(0, score));
  const offset = CIRCUMFERENCE * (1 - clamped / 100);
  const stroke = getScoreStroke(clamped);

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="-rotate-90">
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth={STROKE}
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={stroke}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('text-4xl font-bold tabular-nums', getScoreTextClass(clamped))}>
            {Math.round(clamped)}
          </span>
          <span className="text-xs font-medium text-gray-400">out of 100</span>
        </div>
      </div>
      <p className={cn('mt-3 text-sm font-semibold', getScoreTextClass(clamped))}>
        {getScoreLabel(clamped)}
      </p>
    </div>
  );
}
