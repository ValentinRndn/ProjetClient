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
      <ul
        tabIndex={-1}
        className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
      >
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
