import Select from "@/components/ui/Select";

type Option = Readonly<{
  label: string;
  value: string;
}>;

interface ToolbarFilterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: readonly Option[];
}

export default function ToolbarFilter({
  value,
  onChange,
  placeholder,
  options,
}: ToolbarFilterProps) {
  return (
    <Select
      className="w-56"
      value={value}
      placeholder={placeholder}
      options={options}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
