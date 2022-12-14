import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

interface TransactionInput {
    title: string;
    amount: number;
    type: string;
    category: string;
}

interface Transaction {
    id: number;
    title: string;
    amount: number;
    type: string;
    category: string;
    createdAt: string
}

interface TransactionsProviderProps {
    children: ReactNode;
}

interface TransactionContextData {
    transactions: Transaction[]
    createTransaction: (transaction: TransactionInput) => Promise<void>;
}

export const TransactionsContext = createContext<TransactionContextData>({} as TransactionContextData);

export function TransactionsProvider({children}:TransactionsProviderProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([])

    useEffect(() => {
        api.get('transactions')
        .then(response => setTransactions(response.data.transactions))
    }, []);

    async function createTransaction(transactionIput: TransactionInput) {

      const response = await api.post('/transactions', {...transactionIput, createdAt: new Date()})
      const {transaction} = response.data;

      setTransactions([...transactions, transaction]);
    }

    return (
       <TransactionsContext.Provider value={{transactions, createTransaction}}>
        {children}
       </TransactionsContext.Provider>
    );
}