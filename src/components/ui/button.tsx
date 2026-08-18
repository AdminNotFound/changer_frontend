import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-purple-button text-white shadow-md shadow-purple-200 hover:shadow-lg hover:shadow-purple-300 hover:opacity-95',
        gradient:
          'bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white shadow-md hover:opacity-95',
        destructive:
          'bg-red-500 text-white shadow-sm hover:bg-red-600',
        outline:
          'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 shadow-xs',
        secondary:
          'bg-purple-100 text-purple-700 hover:bg-purple-200 font-semibold',
        ghost:
          'hover:bg-purple-50 text-gray-700 hover:text-purple-700',
        muted:
          'bg-gray-100 text-gray-800 hover:bg-gray-200 font-medium',
        dark:
          'bg-gray-900 text-white hover:bg-black shadow-md',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-8 px-3.5 text-xs',
        lg: 'h-12 px-7 text-base rounded-full',
        icon: 'h-9 w-9 p-0 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
