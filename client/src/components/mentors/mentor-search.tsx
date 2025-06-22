import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface MentorSearchProps {
  onSearch: (searchTerm: string) => void;
}

export default function MentorSearch({ onSearch }: MentorSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };
  
  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <Input
        type="text"
        placeholder="Search mentors by name, title, career cluster, or keywords..."
        className="pl-10 py-3"
        value={searchTerm}
        onChange={handleSearch}
      />
    </div>
  );
}