'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRestoreVersionMutation } from '@/features/resume/hooks/use-version-history';

type VersionRestoreDialogProps = {
  resumeId: string;
  versionId: string | null;
  versionNumber: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRestored: (resume: import('@/types/resume').PublicResume) => void;
};

export function VersionRestoreDialog({
  resumeId,
  versionId,
  versionNumber,
  open,
  onOpenChange,
  onRestored,
}: VersionRestoreDialogProps) {
  const restoreMutation = useRestoreVersionMutation();

  const handleRestore = async () => {
    if (!versionId) return;
    const result = await restoreMutation.mutateAsync({ resumeId, versionId });
    onRestored(result.resume);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Restore version {versionNumber ?? ''}?</DialogTitle>
          <DialogDescription>
            This replaces your current draft with the selected version snapshot.
            Your editor content will update immediately.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={restoreMutation.isPending}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={restoreMutation.isPending || !versionId}
            onClick={() => void handleRestore()}
          >
            {restoreMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
            ) : null}
            Restore to draft
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
