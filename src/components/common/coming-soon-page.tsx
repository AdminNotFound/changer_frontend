'use client';

import React from 'react';
import { type LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type ComingSoonPageProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export function ComingSoonPage({
  title,
  description,
  icon: Icon,
}: ComingSoonPageProps) {
  return (
    <Card className="max-w-xl mx-auto text-center">
      <CardHeader className="items-center">
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
          <Icon className="h-6 w-6" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">
          This feature is coming in a later phase. Resume management is available
          now under My Resumes.
        </p>
      </CardContent>
    </Card>
  );
}
