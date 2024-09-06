"use client"

const SearchBar = () => {
  const HandleSubmit = () => {};

  return (
    <form className="flex flex-wrap gap-4 mt-12" onSubmit={HandleSubmit}>
        <input
            type="text"
            placeholder="Enter Product link"
            className="searchbar-input"
        />
        <button type="submit" className="searchbar-btn">
            Search
        </button>
    </form>
  );
};

export default SearchBar;
