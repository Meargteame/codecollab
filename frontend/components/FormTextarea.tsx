interface FormTextareaProps {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  rows?: number;
  className?: string;
  id?: string;
}

export default function FormTextarea({ 
  label, 
  placeholder, 
  value, 
  onChange,
  required = false,
  rows = 4,
  className = "",
  id
}: FormTextareaProps) {
  const textareaId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={className}>
      <label 
        htmlFor={textareaId}
        className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold"
      >
        {label}
        {required && <span className="text-blue-500 ml-1">*</span>}
      </label>
      <textarea
        id={textareaId}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-600 resize-none"
      />
    </div>
  );
}
