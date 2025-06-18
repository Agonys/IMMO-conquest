import { useRef, useState } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { cn } from '@/utils';

// interface SearchProps {}
export const Search = () => {
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleContainerOnClick = () => {
    searchRef.current?.focus();
  };

  const handleClear = () => {
    setSearchTerm('');
  };

  return (
    <div
      className={cn(
        'has-focus-visible:border-yellow-dark bg-card border-card-border flex w-full max-w-md cursor-pointer gap-4 rounded-md border px-6 py-4 transition-colors',
        'cursor-auto opacity-50', // temp while search is not available
      )}
      onClick={handleContainerOnClick}
    >
      <SearchIcon />
      <input
        ref={searchRef}
        type="text"
        // placeholder="Search players and guilds..."
        placeholder="Search - Coming Soon..."
        className="w-full outline-0"
        id="mainSearch"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        disabled
      />
      <X
        onClick={handleClear}
        className={cn(
          'hover:text-yellow-light ml-auto w-0 opacity-0 transition-all',
          !!searchTerm.length && 'w-auto opacity-100',
        )}
      />
    </div>
  );
};
