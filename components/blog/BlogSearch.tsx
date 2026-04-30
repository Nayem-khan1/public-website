"use client";

import { Search } from "lucide-react";

interface BlogSearchProps {
  placeholder?: string;
}

export function BlogSearch({ placeholder = "Search articles..." }: BlogSearchProps) {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
      </div>
    </div>
  );
}
