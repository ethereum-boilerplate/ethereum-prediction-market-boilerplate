import { useState } from "react";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";

const useNativeTokenPrice = () => {
  const { token } = useMoralisWeb3Api();
  const { Moralis } = useMoralis();
  const [nativeTokenPrice, setNativeTokenPrice] = useState(0);

  const fetchNativeTokenPrice = async (options) => {
    try {
      const result = await token.getTokenPrice(options);
      setNativeTokenPrice(
        Moralis.Units.FromWei(
          parseFloat(result?.nativePrice.value),
          result.nativePrice.decimals
        )
      );
    } catch (e) {
      alert(e.message);
    }
  };

  return { fetchNativeTokenPrice, nativeTokenPrice };
};

export default useNativeTokenPrice;
