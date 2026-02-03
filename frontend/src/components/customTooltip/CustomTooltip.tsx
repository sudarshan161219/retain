import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface CustomTooltipProps {
  label: string;
  position?: "top" | "right" | "bottom" | "left";
  className?: string;
  children: React.ReactNode;
}

export const CustomTooltip = ({
  label,
  position = "top",
  className,
  children,
}: CustomTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side={position} // Radix handles positioning
          className={cn("shadow-md", className)}
        >
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
