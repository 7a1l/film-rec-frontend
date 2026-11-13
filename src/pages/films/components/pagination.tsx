import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 pt-6 pb-4 select-none">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1E1E22] border border-border/80 text-white transition-colors hover:bg-[#27272A] disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
        aria-label="Предыдущая страница"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-1.5">
        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span key={`dots-${index}`} className="px-2 text-xs text-muted-foreground">
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(Number(page))}
              className={`flex h-9 min-w-[36px] px-2 items-center justify-center rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                currentPage === page
                  ? "bg-[#FF6B00] text-white border-[#FF6B00] shadow-md shadow-[#FF6B00]/20"
                  : "bg-[#1E1E22] text-muted-foreground border-border/80 hover:text-white hover:bg-[#27272A]"
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1E1E22] border border-border/80 text-white transition-colors hover:bg-[#27272A] disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
        aria-label="Следующая страница"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
