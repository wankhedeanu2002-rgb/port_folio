import { useMagnetic } from "@/hooks/useMagnetic";
import { useSound } from "@/context/SoundContext";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  magnetic?: boolean;
  href?: string;
  download?: boolean | string;
}

export function Button({
  children,
  className,
  variant = "primary",
  magnetic = false,
  href,
  download,
  onClick,
  onMouseEnter,
  ...props
}: ButtonProps) {
  const { ref, onMouseMove, onMouseLeave: onMagLeave } = useMagnetic<HTMLButtonElement>();
  const { play } = useSound();

  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] active:scale-[0.98]";

  const variants = {
    primary: "bg-white text-black hover:bg-zinc-200 border border-transparent",
    secondary:
      "bg-transparent text-white border border-[var(--color-border)] hover:border-[var(--color-border-hover)] hover:bg-white/5",
    ghost: "bg-transparent text-zinc-400 hover:text-white",
  };

  const handleEnter = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    play("hover");
    onMouseEnter?.(e as React.MouseEvent<HTMLButtonElement>);
  };

  const handleLeave = () => {
    onMagLeave();
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    play("click");
    onClick?.(e as React.MouseEvent<HTMLButtonElement>);
  };

  const content = <span className="inline-flex items-center gap-2">{children}</span>;

  if (href) {
    return (
      <a
        href={href}
        download={download}
        className={cn(base, variants[variant], className)}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onClick={handleClick}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={magnetic ? ref : undefined}
      onMouseMove={magnetic ? onMouseMove : undefined}
      onMouseLeave={handleLeave}
      onMouseEnter={handleEnter}
      className={cn(base, variants[variant], magnetic && "will-change-transform", className)}
      onClick={handleClick}
      {...props}
    >
      {content}
    </button>
  );
}
