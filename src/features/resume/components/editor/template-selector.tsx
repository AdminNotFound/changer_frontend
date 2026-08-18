'use client';

import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Check, LayoutTemplate, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils/cn';
import type { ResumeSnapshot } from '@/features/resume/schemas/resume-snapshot-schema';
import {
  useChangeTemplateMutation,
  useTemplates,
} from '@/features/resume/hooks/use-templates';
import { PreviewSections } from './preview/preview-sections';

type TemplateSelectorProps = {
  resumeId: string;
  currentTemplateId: string;
};

export function TemplateSelector({ resumeId, currentTemplateId }: TemplateSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const { control } = useFormContext<ResumeSnapshot>();
  const snapshot = useWatch({ control }) as ResumeSnapshot;
  const { data: templates, isLoading, isError, refetch, isFetching } = useTemplates();
  const changeTemplate = useChangeTemplateMutation(resumeId);

  const handleSelect = (templateId: string) => {
    if (templateId === currentTemplateId || changeTemplate.isPending) return;
    changeTemplate.mutate(
      { templateId },
      {
        onSuccess: () => setOpen(false),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <LayoutTemplate className="h-4 w-4 mr-1.5" />
          Template
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose a template</DialogTitle>
          <DialogDescription>
            Select a layout for your resume. The preview updates immediately and is saved to
            your resume.
          </DialogDescription>
        </DialogHeader>

        {isLoading || isFetching ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-xl border border-gray-100 bg-gray-50"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-center">
            <p className="text-sm font-medium text-red-700">
              Failed to load templates. Please try again.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => void refetch()}
            >
              <RefreshCw className="h-4 w-4 mr-1.5" />
              Retry
            </Button>
          </div>
        ) : !templates?.length ? (
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-600">
            No templates available.
          </div>
        ) : (
          <>
            {changeTemplate.isError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                Failed to update template. Please try again.
              </div>
            ) : null}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => {
                const isSelected = template.id === currentTemplateId;
                const isPending =
                  changeTemplate.isPending && changeTemplate.variables?.templateId === template.id;

                return (
                  <button
                    key={template.id}
                    type="button"
                    disabled={changeTemplate.isPending}
                    onClick={() => handleSelect(template.id)}
                    className={cn(
                      'group relative flex flex-col rounded-xl border p-3 text-left transition-colors',
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50',
                      changeTemplate.isPending && !isPending && 'opacity-60'
                    )}
                  >
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{template.name}</p>
                        <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">
                          {template.description}
                        </p>
                      </div>
                      {isSelected ? (
                        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                      ) : isPending ? (
                        <Loader2 className="h-5 w-5 shrink-0 animate-spin text-blue-600" />
                      ) : null}
                    </div>
                    <div className="pointer-events-none overflow-hidden rounded-lg border border-gray-100 bg-white p-3 shadow-sm">
                      <div className="origin-top scale-[0.65]">
                        <PreviewSections snapshot={snapshot} templateId={template.id} />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
