import { ComponentPropsWithoutRef } from "react";
import { buttonBase, buttonVariants } from "./buttonStyles";

type ButtonActionProps = {
  variant?: keyof typeof buttonVariants;
} & ComponentPropsWithoutRef<"button">;

export default function ButtonAction({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonActionProps) {
  return (
    <button className={`${buttonBase} ${buttonVariants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
