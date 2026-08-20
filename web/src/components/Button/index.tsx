import { Link } from "react-router-dom";

interface ButtonProps {
  to?: string;
  href?: string;
  primary?: boolean;
  outline?: boolean;
  text?: boolean;
  rounded?: boolean;
  disabled?: boolean;
  small?: boolean;
  large?: boolean;
  widthFull?: boolean;
  children: React.ReactNode;
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClick?: () => void;
}

export default function Button({
  to,
  href,
  primary = false,
  outline = false,
  text = false,
  rounded = false,
  disabled = false,
  small = false,
  large = false,
  widthFull = false,
  children,
  className,
  leftIcon,
  rightIcon,
  onClick,
  ...passProps
}: ButtonProps) {
  const classes = [
    "inline-flex items-center justify-center gap-2 font-medium transition-opacity",
    primary && "bg-crm-primary text-white hover:opacity-90",
    outline &&
      "border border-crm-primary text-crm-primary hover:bg-crm-primary/10",
    text && "text-crm-primary hover:underline px-2! py-0!",
    rounded ? "rounded-full" : "rounded-md",
    small && "px-3 py-1.5 text-sm",
    large && "px-6 py-3 text-base",
    widthFull && "w-full",
    !small && !large && "px-4 py-2 text-sm",
    disabled && "cursor-not-allowed opacity-50",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {leftIcon}
      <span>{children}</span>
      {rightIcon}
    </>
  );

  if (to && !disabled) {
    return (
      <Link to={to} className={classes} {...passProps}>
        {content}
      </Link>
    );
  }

  if (href && !disabled) {
    return (
      <a href={href} className={classes} {...passProps}>
        {content}
      </a>
    );
  }

  return (
    <button
      className={`cursor-pointer ${classes}`}
      disabled={disabled}
      onClick={onClick}
      {...passProps}
    >
      {content}
    </button>
  );
}
