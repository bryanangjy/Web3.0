import { useEffect, useState } from "react";
import { ethers } from "ethers"; // Import ethers.js properly

const API_KEY = import.meta.env.VITE_GIPHY_API;
const ETH_RPC_URL = "https://polygonzkevm-cardona.g.alchemy.com/v2/Yc7IP8a_JBNItO1C-Sfsj5Q6OQcxDQJ2"; // Your Ethereum RPC URL

const useFetch = (keyword) => {
  const [gifUrl, setGifUrl] = useState("");
  const [block, setBlock] = useState(null); // State to store block data

  // Fetch GIF from Giphy API
  const fetchGifs = async () => {
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${keyword.split(" ").join("")}&limit=1`
      );
      const { data } = await response.json();

      setGifUrl(data[0]?.images?.downsized_medium?.url);
    } catch (error) {
      setGifUrl(
        "https://metro.co.uk/wp-content/uploads/2015/05/pokemon_crying.gif?quality=90&strip=all&zoom=1&resize=500%2C284"
      );
    }
  };

  // Fetch Ethereum block data
  const fetchBlock = async () => {
    const provider = new ethers.JsonRpcProvider(ETH_RPC_URL); // Correctly instantiate JsonRpcProvider
    try {
      const blockData = await provider.getBlock("latest"); // Fetch latest block
      setBlock(blockData); // Set block data
    } catch (error) {
      console.error("Error fetching block:", error);
    }
  };

  // Effect to fetch GIF and block data when keyword changes
  useEffect(() => {
    if (keyword) {
      fetchGifs(); // Fetch GIF based on keyword
      fetchBlock(); // Fetch latest Ethereum block
    }
  }, [keyword]);

  return { gifUrl, block }; // Return both GIF URL and block data
};

export default useFetch;