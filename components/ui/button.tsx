import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/*
 * Horizon OS buttons are pill-shaped at every size — a fully rounded rect for
 * labelled buttons, a circle for icon-only ones. The variant set mirrors the
 * Meta Horizon OS UI Set families (Primary, Secondary, Bordered, Borderless,
 * Destructive); the shadcn names are kept as aliases so registry consumers and
 * stock shadcn components keep working.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        /*
         * Horizon "Primary" — the single highest-emphasis action on a panel.
         * The hairline ring is load-bearing, not decoration: dark panels are
         * bright enough that the blue fill alone sits under 3:1 against them, so
         * the ring is what makes the control's boundary perceivable per WCAG
         * 1.4.11. Removing it fails non-text contrast on any dark panel.
         * 40% is the floor that clears 3:1 against page, card and popover
         * (3.83 / 3.42 / 3.25); at 30% it drops below 3:1 on a card.
         *
         * Dark-only: in light mode the darker blue already clears 3:1 against
         * every surface, so a white ring there would be a halo doing no work.
         */
        default:
          "bg-primary text-primary-foreground shadow-xs dark:ring-1 dark:ring-white/40 hover:bg-primary/90 active:bg-primary/80",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 active:bg-destructive/80 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        /* Horizon "Bordered" — stroke only, transparent fill. */
        bordered:
          "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
        /* shadcn alias for Bordered. */
        outline:
          "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
        /* Horizon "Secondary" — filled, lower emphasis than Primary. */
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 active:bg-secondary/70",
        /* Horizon "Borderless" — no fill until hover. */
        borderless:
          "hover:bg-accent hover:text-accent-foreground active:bg-accent/80 dark:hover:bg-accent/50",
        /* shadcn alias for Borderless. */
        ghost:
          "hover:bg-accent hover:text-accent-foreground active:bg-accent/80 dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 px-6 has-[>svg]:px-4",
        /* Quest-friendly: meets the 48px minimum hit target, 24dp icons. */
        xl: "min-h-touch px-7 text-base has-[>svg]:px-6 [&_svg:not([class*='size-'])]:size-icon",
        icon: "size-9",
        /* Quest-friendly circular icon button at the 48px hit target. */
        "icon-touch":
          "size-touch [&_svg:not([class*='size-'])]:size-icon",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
