import { createPublicClient, http } from "viem";
import { polygonZkEvmCardona } from "viem/chains";

// Create a client for Polygon zkEVM
const client = createPublicClient({
  chain: polygonZkEvmCardona,
  transport: http("https://polygonzkevm-cardona.g.alchemy.com/v2/Yc7IP8a_JBNItO1C-Sfsj5Q6OQcxDQJ2"),
});

async function fetchBlock() {
  try {
    const block = await client.getBlock({
      blockNumber: 123456n, // Replace with desired block number
    });
    console.log(block);
  } catch (error) {
    console.error("Error fetching block:", error);
  }
}

fetchBlock();
