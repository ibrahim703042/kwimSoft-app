import SendSharpIcon from "@mui/icons-material/SendSharp";
import UploadFileSharpIcon from "@mui/icons-material/UploadFileSharp";

interface CardDataTableProps {
  title: string;
  nmbre: number;
}

export default function CardDataTable({ title, nmbre }: CardDataTableProps) {
  return (
    <div className="mb-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 bg-[#FFFFFF] p-4 rounded-xl py-7 gap-y-2">
        {/* Section 1 */}
        <div className="lg:col-span-6 sm:col-span-2">
          <div className="flex flex-col sm:flex-row space-x-0 sm:space-x-8 space-y-3 sm:space-y-0">
            <p className="font-medium text-[#191c21c8]">
              {title} <span className="text-[0.7rem] font-normal">({nmbre})</span>
            </p>
            <div className="flex items-center">
              <SendSharpIcon sx={{ color: "#191c21c8", fontSize: "18px" }} className="-rotate-45" />
              <p className="text-[#191c21c8] text-[0.8rem]">Data</p>
            </div>
          </div>
          <div className="text-[#191c21c8] text-[0.8rem] flex flex-col sm:flex-row items-start sm:items-center space-x-0 sm:space-x-5 mt-5 space-y-3 sm:space-y-0">
            <p className="whitespace-nowrap">Total | 305</p>
            <p className="whitespace-nowrap">Stock | 35</p>
            <p className="whitespace-nowrap">En réserve | 17</p>
          </div>
        </div>
        <div className="lg:col-span-6 justify-end sm:col-span-1 flex items-center gap-4">
          <div className="bg-[#707eae3a] mx-1 rounded-full h-8 w-8 flex justify-center items-center">
            <UploadFileSharpIcon sx={{ color: "#707eae", fontSize: "18px" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
