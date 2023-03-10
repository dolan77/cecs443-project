import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import { Server } from '../tools'
import { Budgets } from "../components"
import { IBudget, ICategoryStates } from "../types"

function BudgetPage() {

    const [modalOpen, setModalOpen] = useState(false)
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState(0);

    const [budgets, setBudgets] = useState<IBudget[]>([]);
    const [categoryStates, setCategoryStates] = useState<ICategoryStates>({});
    const [isOpen, setIsOpen] = useState<boolean[]>([]);

    useEffect(() => {
        const getBudget = async () => {
            const { response } = await Server.get<IBudget[]>("/user/budget");
            setBudgets(response as IBudget[])
        }
        getBudget();
    }, []);

    const toggleOpen = (index: number) => {
        const newIsOpen = [...isOpen];
        newIsOpen[index] = !newIsOpen[index];
        setIsOpen(newIsOpen);
    };

    const toggleCategory = (category: string) => {
        setCategoryStates({
            ...categoryStates,
            [category]: !categoryStates[category]
        });
    };

    const handleDelete = async (id: string, key: number) => {
        const { error } = await Server.delete<IBudget[]>('/user/budget', {
            params: {
                id: id
            }
        })
        if (error) return
        const tmp = [...budgets]
        tmp.splice(key, 1)
        setBudgets(tmp)
    };

    return (
        <div>
            <NavBar />
            <div className="flex flex-row justify-center items-center mt-5">
                <Budgets
                    budgets={budgets}
                    isOpen={isOpen}
                    toggleOpen={toggleOpen}
                    categoryStates={categoryStates}
                    toggleCategory={toggleCategory}
                    modalOpen={modalOpen}
                    title={title}
                    amount={amount}
                    setModalOpen={setModalOpen}
                    setTitle={setTitle}
                    setAmount={setAmount}
                    handleDelete={(id: string, index: number) => handleDelete(id, index)}
                    setBudgets={setBudgets} />
            </div>
        </div>
    );
}

export default BudgetPage;

