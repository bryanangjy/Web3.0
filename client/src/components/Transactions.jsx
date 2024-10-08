import React, { useContext } from 'react';

import { TransactionContext } from '../context/TransactionContext';

import dummyData from '../utils/dummyData';
import { shortenAddress } from '../utils/shortenAddress';
import useFetch from '../hooks/useFetch';

const TransactionCard = ({ addressTo, addressFrom, timestamp, message, amount, url, transactionHash }) => {
    // No need to use keyword here
    return (
        <div className="bg-[#181918] m-4 flex flex-1
            2x1:min-w-[450px]
            2x1:max-w-[500px]
            sm:min-w-[270px]
            sm:max-w-[300px]
            flex-col p-3 rounded-md hover:shadow-2xl
        ">
            <div className="flex flex-col items-center w-full mt-3">
                <div className="w-full mb-6 p-2">
                    <a href={`https://cardona-zkevm.polygonscan.com/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">
                        <p className="text-white text-base">From: {shortenAddress(addressFrom)}</p>
                    </a>
                    <a href={`https://cardona-zkevm.polygonscan.com/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">
                        <p className="text-white text-base">To: {shortenAddress(addressTo)}</p>
                    </a>
                    <p className="text-white text-base">Amount: {amount}</p>
                    {message && (
                        <>
                            <br />
                            <p className="text-white text-base">Message: {message}</p>
                        </>
                    )}
                </div>
                <img 
                    src={url} // No gifUrl since keyword is removed
                    alt="gif"
                    className="w-full h-64 2x:h-96 rounded-md shadow-lg object-cover"
                />
                <div className="bg-black p-3 px-5 w-max rounded-3xl -mt-5 shadow-2xl">
                    <p className="text-[#37c7da] font-bold">{timestamp}</p>
                </div>
            </div>
        </div>
    )
}

const Transactions = () => {
    const { currentAccount, transactions } = useContext(TransactionContext);

    return (
        <div className="flex w-full justify-center items-center 2xl:px-20 gradient-bg-transactions">
            <div className="flex flex-col md:p-12 py-12 px-4">
                {currentAccount ? (
                    <h3 className="text-white text-3xl text-center my-2">Latest Transactions</h3>
                ) : (
                    <h3 className="text-white text-3xl text-center my-2">Connect your account to see the latest transactions</h3>
                )}
                <div className="flex flex-wrap justify-center items-center mt-10">
                    {transactions.reverse().map((transaction, i) => (
                        <TransactionCard 
                            key={i} 
                            addressTo={transaction.addressTo}
                            addressFrom={transaction.addressFrom}
                            timestamp={transaction.timestamp}
                            message={transaction.message}
                            amount={transaction.amount}
                            keyword={transaction.keyword}
                            url={transaction.url}
                            transactionHash={transaction.transactionHash}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Transactions;