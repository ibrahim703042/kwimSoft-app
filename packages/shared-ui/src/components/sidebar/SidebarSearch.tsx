import { useSidebarStore } from "../../stores/useSidebarStore";

interface SidebarSearchProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export default function SidebarSearch({
  onSearch,
  placeholder = "Search",
}: SidebarSearchProps) {
  const { isOpen } = useSidebarStore();

  return isOpen ? (
    <div className="flex items-center space-x-2 mx-2 bg-[#b5bbc516] dark:bg-gray-800 px-3 py-[5px] rounded-md border-[#90959e96] dark:border-gray-700 border">
      <svg className="size-5" fill="#b5bbc5" viewBox="0 0 24 24">
        <path
          fill="#b5bbc5"
          d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
        />
      </svg>
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => onSearch?.(e.target.value)}
        className="bg-transparent outline-none text-[#b5bbc5] text-[0.8rem] w-full"
      />
    </div>
  ) : (
    <div className="bg-[#b5bbc516] dark:bg-gray-800 border-[#90959e96] dark:border-gray-700 border flex justify-center items-center px-2 py-1 rounded-md">
      <svg className="size-6" fill="#b5bbc5" viewBox="0 0 24 24">
        <path
          fill="#b5bbc5"
          d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
        />
      </svg>
    </div>
  );
}
