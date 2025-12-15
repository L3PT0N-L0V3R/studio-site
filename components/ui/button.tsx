import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium",
    "ring-offset-background transition-[transform,box-shadow,background-color,color,border-color] duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",

    // Press/release physics (baseline)
    "active:translate-y-[1px] active:scale-[0.985]",
    "motion-reduce:transform-none motion-reduce:transition-none",

    // Slight hover lift for pointer devices
    
  ].join(" "),
  {
    variants: {
      variant: {
        default: "bg-zinc-900 text-white zinc-800",
        destructive: "bg-red-500 text-white red-600",
        outline:
          "border border-zinc-200 bg-white text-zinc-900 zinc-50 hover:text-zinc-900",
        secondary: "bg-zinc-100 text-zinc-900 zinc-200",
        ghost: "zinc-100 hover:text-zinc-900",
        link: "text-zinc-900 underline-offset-4 hover:underline active:translate-y-0 active:scale-100",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-11 rounded-xl px-6",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        // keep default button behavior unless the user overrides
        type={asChild ? undefined : type ?? "button"}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
