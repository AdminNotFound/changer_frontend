'use client';

import React from 'react';
import { Download, Eye, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { PdfGenerationStatus } from '@/types/resume-pdf';

type PdfActionsMenuProps = {
  status: PdfGenerationStatus;
  onPreview: () => void;
  onDownload: () => void;
};

export function PdfActionsMenu({ status, onPreview, onDownload }: PdfActionsMenuProps) {
  const isGenerating = status === 'generating';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" size="sm" disabled={isGenerating}>
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
          ) : (
            <FileText className="h-4 w-4 mr-1.5" />
          )}
          {isGenerating ? 'Generating…' : 'PDF'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem disabled={isGenerating} onClick={onPreview}>
          <Eye className="h-4 w-4 mr-2" />
          Preview PDF
        </DropdownMenuItem>
        <DropdownMenuItem disabled={isGenerating} onClick={onDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
