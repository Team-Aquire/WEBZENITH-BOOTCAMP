type Props = {
  query: string;
  onQueryChange: (q: string) => void;
  onSearch: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export default function SearchBar({ query, onQueryChange, onSearch, loading, disabled }: Props) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') onSearch();
  }
  return (
    <div className="searchbar">
      <input
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      <button onClick={onSearch} disabled={loading || disabled}>
        {loading ? 'Searching...' : 'Search'}
      </button>
    </div>
  );
}
