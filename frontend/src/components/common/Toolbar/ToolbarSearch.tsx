import Input from "@/components/ui/Input";

interface ToolbarSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function ToolbarSearch({
  value,
  onChange,
  placeholder = "Search...",
}: ToolbarSearchProps) {
  return (
    <Input
      className="w-72"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
