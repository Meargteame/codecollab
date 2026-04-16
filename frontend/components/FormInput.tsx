interface FormInputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
  id?: string;
}

export default function FormInput({ 
  label, 
  type = "text", 
  placeholder, 
  value, 
  onChange,
  required = false,
  className = "",
  id
}: FormInputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={className}>
      <label 
        htmlFor={inputId}
        className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold"
      >
        {label}
        {required && <span className="text-blue-500 ml-1">*</span>}
      </label>
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-600"
      />
    </div>
  );
}
