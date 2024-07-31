export default function Option({ label, option, selection, setSelection}) { 
  return (
    <div onClick={() => setSelection(option.value)} className={`flex flex-row gap-2 py-1  ${selection === option.value ? "border-blue-300 text-blue-500" : "border-2"} ${option.error && "text-red-500 border-red-500" }`}>
      <div className={`bg-white rounded-sm`}>
        {label}
      </div>
      {option.value}
    </div>
  ); 
}
