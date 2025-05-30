import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (term: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = 'Search fisheries...' 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Call onSearch on every keystroke for live search
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="relative w-full"
    >
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder={placeholder} 
          className="w-full py-3 pl-12 pr-4 text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-transparent" 
        />
        <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
      </div>
      <button 
        type="submit"
        className="absolute right-3 top-2 bg-customBlue hover:bg-primary-800 text-white py-1 px-4 rounded-lg transition-colors"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
