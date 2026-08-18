'use client';

import React from 'react';
import Link from 'next/link';
import { Clock3, FileText, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { DashboardResumeItem } from '@/types/resume';

function formatDate(value: string | null): string {
  if (!value) return 'Never';
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function formatTemplate(templateId: string): string {
  if (!templateId) return 'Unknown';
  return templateId.charAt(0).toUpperCase() + templateId.slice(1);
}

type ResumeCardProps = {
  resume: DashboardResumeItem;
};

export function ResumeCard({ resume }: ResumeCardProps) {
  const lastUpdated = resume.lastEditedAt ?? resume.updatedAt;

  return (
    <Card className="flex flex-col h-full hover:shadow-md hover:border-purple-100 transition-all">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <Badge variant={resume.hasPublished ? 'success' : 'secondary'}>
            {resume.hasPublished ? 'Published' : 'Draft'}
          </Badge>
        </div>
        <CardTitle className="text-base line-clamp-2">{resume.title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 text-sm text-gray-500 flex-1">
        <p>
          Template:{' '}
          <span className="font-medium text-gray-700">
            {formatTemplate(resume.templateId)}
          </span>
        </p>
        <p className="flex items-center gap-1.5">
          <Clock3 className="h-3.5 w-3.5" />
          Updated {formatDate(lastUpdated)}
        </p>
        <p className="text-xs text-gray-400">
          Version {resume.currentVersionNumber}
        </p>
      </CardContent>

      <CardFooter className="gap-2">
        <Button asChild variant="default" size="sm" className="flex-1">
          <Link href={`/edit/${resume.id}`}>
            <Pencil className="h-3.5 w-3.5 mr-1.5" />
            Open
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
