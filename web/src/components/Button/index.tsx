import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface ButtonProps {
  to?: string;
  href?: string;
  title?: string;
  primary?: boolean;
  outline?: boolean;
  text?: boolean;
  rounded?: boolean;
  gradient?: boolean;
  success?: boolean;
  info?: boolean;
  disabled?: boolean;
  small?: boolean;
  large?: boolean;
  widthFull?: boolean;
  buttonTitle?: string;
  children?: React.ReactNode;
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClick?: () => void;
}

export default function Button({
  to,
  href,
  title,
  primary = false,
  outline = false,
  text = false,
  rounded = false,
  gradient = false,
  success = false,
  info = false,
  disabled = false,
  small = false,
  large = false,
  widthFull = false,
  buttonTitle,
  children,
  className,
  leftIcon,
  rightIcon,
  onClick,
  ...passProps
}: ButtonProps) {
  const { t } = useTranslation();

  const classes = [
    "inline-flex items-center justify-center gap-2 font-medium transition-opacity",
    primary && "bg-crm-primary text-white hover:opacity-90",
    outline &&
      "border border-crm-primary text-crm-primary hover:bg-crm-primary/10",
    text && "text-crm-primary hover:underline px-2! py-0!",
    rounded ? "rounded-full" : "rounded-md",
    gradient &&
      "bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white",
    success && "bg-crm-success text-white",
    info && "bg-crm-info text-white",
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
      {(buttonTitle || children) && (
        <span>{buttonTitle ? t(buttonTitle) : children}</span>
      )}
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
      title={title}
      {...passProps}
    >
      {content}
    </button>
  );
}
