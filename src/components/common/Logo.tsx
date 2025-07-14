import { cn } from "@/lib/utils";
import Link from "next/link";

type LogoSize = "sm" | "md" | "lg" | "xl";
type ResponsiveSizes = {
  sm?: LogoSize;
  md?: LogoSize;
  lg?: LogoSize;
  xl?: LogoSize;
};

export default function Logo({ 
  size = "md" 
}: { 
  size?: LogoSize | ResponsiveSizes 
}) {
    const sizeClasses = {
        sm: "text-lg",
        md: "text-2xl",
        lg: "text-3xl",
        xl: "text-4xl"
    };

    const getResponsiveClasses = (size: LogoSize | ResponsiveSizes) => {
        if (typeof size === "string") {
            return sizeClasses[size];
        }

        const classes = [];
        if (size.sm) classes.push(`sm:text-${sizeClasses[size.sm].split('-')[1]}`);
        if (size.md) classes.push(`md:text-${sizeClasses[size.md].split('-')[1]}`);
        if (size.lg) classes.push(`lg:text-${sizeClasses[size.lg].split('-')[1]}`);
        if (size.xl) classes.push(`xl:text-${sizeClasses[size.xl].split('-')[1]}`);

        // Default size (first defined or fallback to md)
        const defaultSize = size.sm || size.md || size.lg || size.xl || "md";
        classes.unshift(sizeClasses[defaultSize]);

        return classes.join(" ");
    };

    return (
        <Link href="/" className={cn("font-bold tracking-tight", getResponsiveClasses(size))}>
            <span className="text-purple-400">So</span>S
        </Link>
    )
}
