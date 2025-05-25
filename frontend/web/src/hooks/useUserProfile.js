import { useState, useEffect } from 'react';
import axios from 'axios';

const useUserProfile = (userId) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState({
        username: '',
        title: '',
        email: '',
        avatar: '',
        rating: 0,
        isOnline: false,
        about: '',
        skills: [],
        postedJobs: [],
        completedJobs: [],
        cv: null
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/users/${userId}`);
                setUserData(response.data);
                setError(null);
            } catch (err) {
                setError('Failed to load user data');
                console.error('Error fetching user data:', err);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    // Function to update user profile
    const updateUserProfile = async (updatedData) => {
        try {
            setLoading(true);
            const response = await axios.put(`/api/users/${userId}`, updatedData);
            setUserData(response.data);
            setError(null);
            return true;
        } catch (err) {
            setError('Failed to update user data');
            console.error('Error updating user data:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Function to update specific sections
    const updateUserSection = async (section, data) => {
        try {
            setLoading(true);
            const response = await axios.patch(`/api/users/${userId}/${section}`, data);
            setUserData(prev => ({
                ...prev,
                [section]: response.data[section]
            }));
            setError(null);
            return true;
        } catch (err) {
            setError(`Failed to update ${section}`);
            console.error(`Error updating ${section}:`, err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        userData,
        loading,
        error,
        updateUserProfile,
        updateUserSection
    };
};

export default useUserProfile; 