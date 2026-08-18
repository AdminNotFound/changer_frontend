'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { handleApiError } from '@/lib/api/error';
import { useCreateResumeMutation } from '../hooks/use-resumes';

const createResumeSchema = z.object({
  title: z.string().max(200, 'Title must be at most 200 characters'),
});

type CreateResumeFormData = z.infer<typeof createResumeSchema>;

type CreateResumeDialogProps = {
  triggerLabel?: string;
  triggerVariant?: React.ComponentProps<typeof Button>['variant'];
};

export function CreateResumeDialog({
  triggerLabel = 'Create Resume',
  triggerVariant = 'default',
}: CreateResumeDialogProps) {
  const [open, setOpen] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const createMutation = useCreateResumeMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateResumeFormData>({
    resolver: zodResolver(createResumeSchema),
    defaultValues: { title: '' },
  });

  const onSubmit = async (data: CreateResumeFormData) => {
    setApiError(null);
    try {
      const title = data.title?.trim();
      await createMutation.mutateAsync(title ? { title } : {});
      setOpen(false);
      reset();
    } catch (err) {
      setApiError(handleApiError(err).message);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setApiError(null);
          reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant={triggerVariant}>
          <Plus className="h-4 w-4 mr-2" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new resume</DialogTitle>
          <DialogDescription>
            Give your resume a title to get started. You can edit everything in
            the editor next.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {apiError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
              {apiError}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="resume-title" className="text-xs font-semibold text-gray-700">
              Title
            </label>
            <Input
              id="resume-title"
              placeholder="Untitled Resume"
              disabled={createMutation.isPending}
              {...register('title')}
            />
            {errors.title && (
              <p className="text-xs text-red-600 font-medium">{errors.title.message}</p>
            )}
            <p className="text-[11px] text-gray-400">
              Leave blank to use “Untitled Resume”. Template defaults to Modern.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={createMutation.isPending}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Create & open editor
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
