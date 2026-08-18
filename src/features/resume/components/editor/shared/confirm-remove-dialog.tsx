'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type ConfirmRemoveDialogProps = {
  open: boolean;
  title?: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmRemoveDialog({
  open,
  title = 'Remove item?',
  description = 'This cannot be undone until you save your changes.',
  onConfirm,
  onCancel,
}: ConfirmRemoveDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" variant="default" className="bg-red-600 hover:bg-red-700" onClick={onConfirm}>
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
