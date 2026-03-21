import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HelpTooltipProps {
  text: string;
}

export function HelpTooltip({ text }: HelpTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="ml-1 inline-flex items-center justify-center w-4 h-4 text-xs text-gray-500 bg-gray-200 rounded-full hover:bg-gray-300 hover:text-gray-700 transition-colors"
        >
          ?
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  );
}
