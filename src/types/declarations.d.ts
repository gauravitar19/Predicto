import { VariantProps } from 'class-variance-authority';

// Define proper Badge component types
declare module '@/components/ui/badge' {
  import { HTMLAttributes } from 'react';
  import { VariantProps } from 'class-variance-authority';

  const badgeVariants: (props?: any) => string;
  
  export interface BadgeProps
    extends HTMLAttributes<HTMLDivElement>,
      VariantProps<typeof badgeVariants> {
        variant?: 'default' | 'secondary' | 'destructive' | 'outline';
      }
  
  export function Badge(props: BadgeProps): JSX.Element;
  
  export { badgeVariants };
}

// Add other component type declarations as needed 