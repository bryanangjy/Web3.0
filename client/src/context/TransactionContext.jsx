import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import { contractABI, contractAddress } from '../utils/constants';

export const TransactionContext = React.createContext();

const getEthereumContract = () => {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);
        return transactionContract;
    } else {
        console.error("Ethereum object is not available. Make sure MetaMask is installed and configured.");
        return null;
    }
};

export const TransactionProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState('');
    const [formData, setFormData] = useState({ addressTo: '', amount: '', keyword: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));
    const [transactions, setTransactions] = useState([]);

    const handleChange = (e, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
    };

    const getALLTransactions = async () => {
        try {
            if (!window.ethereum) return alert("Please install MetaMask");
            const transactionContract = getEthereumContract();

            if (transactionContract) {
                const availableTransactions = await transactionContract.getAllTransactions();

                const structuredTransactions = availableTransactions.map((transaction) => ({
                    addressTo: transaction.receiver,
                    addressFrom: transaction.sender,
                    timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
                    message: transaction.message,
                    amount: parseInt(transaction.amount._hex) / (10 ** 18),
                }));

                setTransactions(structuredTransactions);
            }
        } catch (error) {
            console.log("Error fetching transactions:", error);
        }
    };

    const checkIfWalletIsConnected = async () => {
        try {
            if (!window.ethereum) return alert("Please install MetaMask");

            const accounts = await window.ethereum.request({ method: 'eth_accounts' });

            if (accounts.length) {
                setCurrentAccount(accounts[0]);
                getALLTransactions();
            } else {
                console.log("No accounts found.");
            }
        } catch (error) {
            console.log("Error checking if wallet is connected:", error);
        }
    };

    const checkIfTransactionsExist = async () => {
        try {
            const transactionContract = getEthereumContract();
            if (!transactionContract) return;

            const transactionCount = await transactionContract.getTransactionCount();
            window.localStorage.setItem('transactionCount', transactionCount.toString());
        } catch (error) {
            console.log("Error checking transaction count:", error);
        }
    };

    const connectWallet = async () => {
        try {
            if (!window.ethereum) return alert("Please install MetaMask");

            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log("Error connecting wallet:", error);
        }
    };

    const sendTransaction = async () => {
        try {
            if (!window.ethereum) return alert("Please install MetaMask");

            const { addressTo, amount, keyword, message } = formData;
            const transactionContract = getEthereumContract();
            if (!transactionContract) return;

            const parsedAmount = ethers.utils.parseEther(amount);

            // Initiate the transaction
            await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208', // 21000 GWEI
                    value: parsedAmount._hex,
                }],
            });

            // Call the smart contract function to log the transaction
            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait(); // Wait for the transaction to be mined
            setIsLoading(false);
            console.log(`Success - ${transactionHash.hash}`);

            const transactionCount = await transactionContract.getTransactionCount();
            setTransactionCount(transactionCount.toNumber());

            window.location.reload(); // Reload the page
        } catch (error) {
            console.log("Error sending transaction:", error);
        }
    };

    useEffect(() => {
        checkIfWalletIsConnected();
        checkIfTransactionsExist();
    }, []);

    return (
        <TransactionContext.Provider
            value={{
                connectWallet,
                currentAccount,
                formData,
                setFormData,
                handleChange,
                sendTransaction,
                transactions,
                isLoading,
            }}
        >
            {children}
        </TransactionContext.Provider>
    );
};