"use client"

import { FormEvent, useState } from "react";

const isvalidAmzProductURL = (url: string) =>{
  try {
    const parsedURL = new URL(url);
    const hostname = parsedURL.hostname;
    if(
      hostname.includes('amazon.com') || 
      hostname.includes('amazon.') || 
      hostname.includes('amazon.in') || 
      hostname.endsWith('amazon') 
    ){
      return true;
    }
  } catch (error) {
    return false;
  }
}

const SearchBar = () => {

  const [searchPrompt, setsearchPrompt] = useState('');
  const [isLoading, setisLoading] = useState(false);

  const HandleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isvalidLink = isvalidAmzProductURL(searchPrompt);
    if(!isvalidLink) return alert('Please provide a valid Link');

    try {
      setisLoading(true);
      
      // scrape the product page
    } catch (error) {
      console.log(error); 
    } finally{
      setisLoading(false);
    }
  };

  return (
    <form className="flex flex-wrap gap-4 mt-12" onSubmit={HandleSubmit}>
        <input
            type="text"
            value={searchPrompt}
            onChange={(e) => setsearchPrompt(e.target.value)}
            placeholder="Enter Product link"
            className="searchbar-input"
        />
        <button 
        type="submit" 
        className="searchbar-btn"
        disabled={searchPrompt===''}
        >
            {isLoading ? 'Searching...' : 'Search'}
        </button>
    </form>
  );
};

export default SearchBar;
