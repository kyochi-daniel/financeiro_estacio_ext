import React, { createContext, useContext, useState } from 'react';

export type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number; // positivo = receita, negativo = despesa
};

export type BudgetItem = {
  id: string;
  name: string;
  materialCost: number;
  inkCost: number;
  laborHours: number;
  laborRate: number;
  fixedAllocation: number; // fração dos custos fixos alocados a este produto
  markupPercent: number; // % sobre custo para definir preço
};

export type InventoryItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  reorderThreshold: number;
};

type AppData = {
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
  budgets: BudgetItem[];
  addBudget: (b: BudgetItem) => void;
  updateBudget: (b: BudgetItem) => void;
  removeBudget: (id: string) => void;
  inventory: InventoryItem[];
  updateInventory: (item: InventoryItem) => void;
};

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', date: '2025-09-01', description: 'Impressão cartazes', amount: 2500 },
  { id: '2', date: '2025-09-05', description: 'Compra de papel', amount: -420 },
  { id: '3', date: '2025-09-12', description: 'Serviço terceirizado', amount: -800 },
  { id: '4', date: '2025-09-20', description: 'Venda flyers', amount: 1200 },
];

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'tinta', name: 'Tinta', quantity: 12, unit: 'litros', reorderThreshold: 5 },
  { id: 'papel', name: 'Papel A3', quantity: 2000, unit: 'folhas', reorderThreshold: 500 },
  { id: 'lona', name: 'Lona 440g', quantity: 25, unit: 'm', reorderThreshold: 10 },
];

const INITIAL_BUDGETS: BudgetItem[] = [
  {
    id: 'b1',
    name: 'Banner 1x2m',
    materialCost: 50,
    inkCost: 25,
    laborHours: 1,
    laborRate: 25,
    fixedAllocation: 0.05,
    markupPercent: 40,
  },
  {
    id: 'b2',
    name: 'Flyer A4 (1000 un.)',
    materialCost: 300,
    inkCost: 120,
    laborHours: 3,
    laborRate: 20,
    fixedAllocation: 0.02,
    markupPercent: 30,
  },
  {
    id: 'b3',
    name: 'Cartaz 50x70',
    materialCost: 40,
    inkCost: 30,
    laborHours: 1.5,
    laborRate: 22,
    fixedAllocation: 0.03,
    markupPercent: 35,
  },
];

const AppDataContext = createContext<AppData | undefined>(undefined);

export const AppDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [budgets, setBudgets] = useState<BudgetItem[]>(INITIAL_BUDGETS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);

  const addTransaction = (tx: Transaction) => setTransactions((s) => [tx, ...s]);
  const addBudget = (b: BudgetItem) => setBudgets((s) => [b, ...s]);
  const updateBudget = (b: BudgetItem) => setBudgets((s) => s.map((it) => (it.id === b.id ? b : it)));
  const removeBudget = (id: string) => setBudgets((s) => s.filter((it) => it.id !== id));
  const updateInventory = (item: InventoryItem) =>
    setInventory((s) => s.map((it) => (it.id === item.id ? item : it)));

  return (
    <AppDataContext.Provider
      value={{ transactions, addTransaction, budgets, addBudget, updateBudget, removeBudget, inventory, updateInventory }}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
};

export default AppDataContext;
