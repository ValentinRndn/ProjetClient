import { cn } from "@/lib/utils";

interface DropdownProps {
  trigger: React.ReactNode;
  items: React.ReactNode[];
}

export function Dropdown({
  className,
  trigger,
  items,
  ...props
}: React.ComponentProps<"div"> & DropdownProps) {
  return (
    <div className={cn("dropdown", className)} {...props}>
      <>{trigger}</>
      <div
        tabIndex={-1}
        className="dropdown-content bg-white rounded-xl z-50 min-w-[280px] p-2 shadow-xl border border-gray-100"
      >
        {items.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </div>
    </div>
  );
}
