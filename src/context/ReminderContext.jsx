import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getReminders } from '../services/api';

const ReminderContext = createContext();

export const useReminders = () => useContext(ReminderContext);

export const ReminderProvider = ({ children }) => {
    const { user } = useAuth();
    const [reminders, setReminders] = useState([]);
    const [isBannerDismissed, setIsBannerDismissed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [showValidation, setShowValidation] = useState(false);

    const refreshReminders = useCallback(async () => {
        if (user?.rollNo) {
            setLoading(true);
            try {
                const today = new Date().toISOString().split('T')[0];
                const res = await getReminders(user.rollNo, today);
                // Filter for only pending reminders
                const pending = (res.data || []).filter(r => r.status === 'pending');
                setReminders(pending);
            } catch (err) {
                console.error("Failed to fetch reminders:", err);
            } finally {
                setLoading(false);
            }
        } else {
            setReminders([]);
        }
    }, [user?.rollNo]);

    useEffect(() => {
        refreshReminders();
    }, [refreshReminders]);

    const dismissBanner = () => setIsBannerDismissed(true);
    
    const openValidation = (slug) => {
        setSelectedQuestion({ slug });
        setShowValidation(true);
    };

    const closeValidation = () => {
        setShowValidation(false);
        setSelectedQuestion(null);
    };

    const value = {
        reminders,
        refreshReminders,
        isBannerDismissed,
        dismissBanner,
        loading,
        showValidation,
        selectedQuestion,
        openValidation,
        closeValidation
    };

    return (
        <ReminderContext.Provider value={value}>
            {children}
        </ReminderContext.Provider>
    );
};
