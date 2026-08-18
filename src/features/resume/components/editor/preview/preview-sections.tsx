'use client';

import React from 'react';
import type { ResumeSnapshot } from '@/features/resume/schemas/resume-snapshot-schema';
import { cn } from '@/lib/utils/cn';
import { contactLine, formatDateRange } from './format-date-range';

type TemplateVariant = 'modern' | 'classic' | 'minimal';

type PreviewSectionsProps = {
  snapshot: ResumeSnapshot;
  templateId: string;
};

function getVariant(templateId: string): TemplateVariant {
  if (templateId === 'classic' || templateId === 'minimal') return templateId;
  return 'modern';
}

export function PreviewSections({ snapshot, templateId }: PreviewSectionsProps) {
  const variant = getVariant(templateId);
  const info = snapshot.personalInfo ?? {};
  const name = info.fullName?.trim() || 'Your Name';
  const contact = contactLine(snapshot);

  const headerClass = cn(
    variant === 'classic' && 'text-center',
    variant === 'minimal' && 'text-left'
  );

  const nameClass = cn(
    'font-bold text-gray-900',
    variant === 'modern' && 'text-2xl',
    variant === 'classic' && 'text-xl text-center',
    variant === 'minimal' && 'text-lg font-normal'
  );

  return (
    <div className="space-y-5 text-sm text-gray-800">
      <header className={headerClass}>
        <h1 className={nameClass}>{name}</h1>
        {variant === 'modern' ? (
          <div className="mt-2 h-0.5 w-full bg-blue-600" />
        ) : variant === 'classic' ? (
          <hr className="mt-3 border-gray-900" />
        ) : (
          <div className="mt-2" />
        )}
        {contact ? (
          <p
            className={cn(
              'mt-3 text-[10px] text-gray-600 break-words',
              variant === 'classic' && 'text-center',
              variant === 'minimal' && 'text-[9px] text-gray-500'
            )}
          >
            {contact}
          </p>
        ) : null}
      </header>

      {snapshot.summary?.trim() ? (
        <PreviewBlock title="Summary" variant={variant}>
          <p className="whitespace-pre-wrap">{snapshot.summary}</p>
        </PreviewBlock>
      ) : null}

      {(snapshot.skills ?? []).some((s) => s.trim()) ? (
        <PreviewBlock title="Skills" variant={variant}>
          <p>{(snapshot.skills ?? []).filter(Boolean).join(' • ')}</p>
        </PreviewBlock>
      ) : null}

      {(snapshot.experience ?? []).length > 0 ? (
        <PreviewBlock title="Experience" variant={variant}>
          <div className="space-y-4">
            {(snapshot.experience ?? []).map((item, i) => {
              const heading =
                [item.title, item.company].filter(Boolean).join(' — ') || 'Experience';
              const dates = formatDateRange(item.startDate, item.endDate, item.current);
              const meta = [dates, item.location].filter(Boolean).join('  |  ');
              return (
                <div key={i}>
                  <p className="font-semibold">{heading}</p>
                  {meta ? <p className="text-[10px] text-gray-500 mt-0.5">{meta}</p> : null}
                  {item.description ? (
                    <p className="mt-1 whitespace-pre-wrap">{item.description}</p>
                  ) : null}
                  {(item.highlights ?? []).filter(Boolean).length > 0 ? (
                    <ul className="mt-1 list-disc pl-4 space-y-0.5">
                      {(item.highlights ?? []).filter(Boolean).map((h, j) => (
                        <li key={j}>{h}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              );
            })}
          </div>
        </PreviewBlock>
      ) : null}

      {(snapshot.education ?? []).length > 0 ? (
        <PreviewBlock title="Education" variant={variant}>
          <div className="space-y-3">
            {(snapshot.education ?? []).map((item, i) => {
              const heading =
                [item.degree, item.field].filter(Boolean).join(', ') ||
                item.institution ||
                'Education';
              const line = [
                item.institution,
                formatDateRange(item.startDate, item.endDate),
              ]
                .filter(Boolean)
                .join('  |  ');
              return (
                <div key={i}>
                  <p className="font-semibold">{heading}</p>
                  {line ? <p className="text-[10px] text-gray-500 mt-0.5">{line}</p> : null}
                  {item.description ? (
                    <p className="mt-1 whitespace-pre-wrap">{item.description}</p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </PreviewBlock>
      ) : null}

      {(snapshot.projects ?? []).length > 0 ? (
        <PreviewBlock title="Projects" variant={variant}>
          <div className="space-y-3">
            {(snapshot.projects ?? []).map((item, i) => (
              <div key={i}>
                <p className="font-semibold">{item.name || 'Project'}</p>
                {item.url ? (
                  <p className="text-[10px] text-gray-500 break-all">{item.url}</p>
                ) : null}
                {item.description ? (
                  <p className="mt-1 whitespace-pre-wrap">{item.description}</p>
                ) : null}
                {(item.highlights ?? []).filter(Boolean).length > 0 ? (
                  <ul className="mt-1 list-disc pl-4 space-y-0.5">
                    {(item.highlights ?? []).filter(Boolean).map((h, j) => (
                      <li key={j}>{h}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </PreviewBlock>
      ) : null}

      {(snapshot.certifications ?? []).length > 0 ? (
        <PreviewBlock title="Certifications" variant={variant}>
          <div className="space-y-2">
            {(snapshot.certifications ?? []).map((item, i) => {
              const label = [item.name, item.issuer, item.date].filter(Boolean).join(' — ');
              return <p key={i}>{label || 'Certification'}</p>;
            })}
          </div>
        </PreviewBlock>
      ) : null}

      {(snapshot.languages ?? []).some((l) => l.name?.trim()) ? (
        <PreviewBlock title="Languages" variant={variant}>
          <p>
            {(snapshot.languages ?? [])
              .filter((l) => l.name?.trim())
              .map((lang) =>
                lang.proficiency ? `${lang.name} (${lang.proficiency})` : lang.name
              )
              .join(' • ')}
          </p>
        </PreviewBlock>
      ) : null}
    </div>
  );
}

function PreviewBlock({
  title,
  variant,
  children,
}: {
  title: string;
  variant: TemplateVariant;
  children: React.ReactNode;
}) {
  return (
    <section>
      {variant === 'classic' ? <hr className="mb-2 border-gray-300" /> : null}
      <h2
        className={cn(
          'font-bold uppercase tracking-wide text-gray-900 mb-2',
          variant === 'modern' && 'text-xs',
          variant === 'classic' && 'text-[11px]',
          variant === 'minimal' && 'text-[10px] font-normal'
        )}
      >
        {title}
      </h2>
      <div
        className={cn(
          variant === 'minimal' && 'text-[10px] text-gray-700',
          variant !== 'minimal' && 'text-[11px]'
        )}
      >
        {children}
      </div>
    </section>
  );
}
