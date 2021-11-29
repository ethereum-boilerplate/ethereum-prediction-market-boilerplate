// SPDX-License-Identifier: MIT
pragma solidity >=0.4.17 <0.9.0;

interface IPriceConverter {
    function getDerivedPrice(
        address _base,
        address _quote,
        uint8 _decimals
    ) external view returns (int256);
}
