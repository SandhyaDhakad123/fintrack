import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { addTransaction } from '../api';
import { format } from 'date-fns';

const CATEGORIES = ['FOOD', 'TRAVEL', 'BILLS', 'SHOPPING', 'ENTERTAINMENT', 'HEALTH', 'OTHERS'];

const TransactionForm = ({ onTransactionAdded }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState(null);

    const formik = useFormik({
        initialValues: {
            amount: '',
            type: 'DEBIT',
            category: 'OTHERS',
            date: format(new Date(), 'yyyy-MM-dd'),
            description: '',
        },
        validationSchema: Yup.object({
            amount: Yup.number().positive('Must be positive').required('Required'),
            type: Yup.string().oneOf(['CREDIT', 'DEBIT']).required('Required'),
            category: Yup.string().oneOf(CATEGORIES).required('Required'),
            date: Yup.date().required('Required'),
            description: Yup.string().max(255, 'Too long'),
        }),
        onSubmit: async (values, { resetForm }) => {
            if (isSubmitting) return;
            setIsSubmitting(true);
            setMessage(null);
            try {
                 await addTransaction(values);
                 setMessage({ type: 'success', text: 'Success!' });
                 setTimeout(() => setMessage(null), 3000);
                 resetForm();
                 if (onTransactionAdded) onTransactionAdded();
            } catch (err) {
                 setMessage({ type: 'error', text: 'Error adding transaction.' });
                 console.error(err);
            } finally {
                 setIsSubmitting(false);
            }
        },
    });

    const handleDescriptionChange = (e) => {
        const desc = e.target.value;
        formik.handleChange(e);
        
        // Simple auto-categorization logic
        const lowerDesc = desc.toLowerCase();
        if (lowerDesc.includes('food') || lowerDesc.includes('restaurant') || lowerDesc.includes('swiggy') || lowerDesc.includes('zomato')) {
            formik.setFieldValue('category', 'FOOD');
        } else if (lowerDesc.includes('uber') || lowerDesc.includes('ola') || lowerDesc.includes('flight') || lowerDesc.includes('train')) {
            formik.setFieldValue('category', 'TRAVEL');
        } else if (lowerDesc.includes('electricity') || lowerDesc.includes('rent') || lowerDesc.includes('water') || lowerDesc.includes('bill')) {
            formik.setFieldValue('category', 'BILLS');
        } else if (lowerDesc.includes('amazon') || lowerDesc.includes('flipkart') || lowerDesc.includes('myntra')) {
            formik.setFieldValue('category', 'SHOPPING');
        } else if (lowerDesc.includes('netflix') || lowerDesc.includes('movie') || lowerDesc.includes('prime')) {
            formik.setFieldValue('category', 'ENTERTAINMENT');
        } else if (lowerDesc.includes('hospital') || lowerDesc.includes('pharmacy') || lowerDesc.includes('doctor')) {
            formik.setFieldValue('category', 'HEALTH');
        }
    };

    return (
        <div className="cloud-monitor-container" style={{ maxWidth: '100%', margin: '0' }}>
            <div className="cloud-monitor-header">
                <h2>New Transaction</h2>
                {message && (
                    <div className={`status-badge ${message.type === 'success' ? 'healthy' : 'degraded'}`} style={{ textTransform: 'none' }}>
                        {message.text}
                    </div>
                )}
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        type="button"
                        onClick={() => formik.setFieldValue('type', 'CREDIT')}
                        className={`glass-input items-center justify-center p-3 cursor-pointer transition-all ${formik.values.type === 'CREDIT' ? 'ring-2 ring-emerald-500 bg-emerald-500/10' : ''}`}
                    >
                        <span className={`font-bold ${formik.values.type === 'CREDIT' ? 'text-emerald-400' : 'text-slate-400'}`}>+ Credit</span>
                    </button>
                    <button 
                        type="button"
                        onClick={() => formik.setFieldValue('type', 'DEBIT')}
                        className={`glass-input items-center justify-center p-3 cursor-pointer transition-all ${formik.values.type === 'DEBIT' ? 'ring-2 ring-rose-500 bg-rose-500/10' : ''}`}
                    >
                        <span className={`font-bold ${formik.values.type === 'DEBIT' ? 'text-rose-400' : 'text-slate-400'}`}>- Debit</span>
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold ml-1">Amount ($)</label>
                        <input
                            type="number"
                            name="amount"
                            step="0.01"
                            placeholder="0.00"
                            className="glass-input w-full font-black text-xl"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.amount}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold ml-1">Category</label>
                        <select
                            name="category"
                            className="glass-input w-full text-sm"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.category}
                        >
                            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold ml-1">Date</label>
                        <input
                            type="date"
                            name="date"
                            className="glass-input w-full text-sm"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.date}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold ml-1">Description</label>
                        <input
                            type="text"
                            name="description"
                            placeholder="Optional"
                            className="glass-input w-full text-sm"
                            onChange={handleDescriptionChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.description}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-black tracking-widest uppercase text-xs shadow-lg shadow-indigo-900/40 transition-all active:scale-95 disabled:opacity-50"
                >
                    {isSubmitting ? 'Syncing...' : 'Log Transaction'}
                </button>
            </form>
        </div>
    );
};

export default TransactionForm;
