import React from 'react';
import { FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-white/50 my-6">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 mb-4">
        {icon || <FolderOpen className="h-7 w-7" />}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="default">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
