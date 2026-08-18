'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils/cn';

type PasswordInputProps = Omit<
  React.ComponentProps<typeof Input>,
  'type'
> & {
  wrapperClassName?: string;
};

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, wrapperClassName, disabled, ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <div className={cn('relative', wrapperClassName)}>
        <Input
          ref={ref}
          type={visible ? 'text' : 'password'}
          className={cn('pr-11', className)}
          disabled={disabled}
          {...props}
        />
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    );
  }
);
PasswordInput.displayName = 'PasswordInput';
