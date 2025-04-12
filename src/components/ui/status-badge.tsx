
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input bg-background",
        success: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
        warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
        info: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
        pending: "bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100",
        completed: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function StatusBadge({
  className,
  variant,
  ...props
}: StatusBadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
