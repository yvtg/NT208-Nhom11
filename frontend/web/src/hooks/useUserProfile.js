import { useState, useEffect } from 'react';
import { getCurrentUser } from '../api/userAPI';

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
                console.log("Fetching user data...");
                const response = await getCurrentUser();
                console.log("API Response:", response);
                
                if (!response) {
                    throw new Error('No data received from API');
                }

                setUserData(response);
                setError(null);
            } catch (err) {
                console.error('Error fetching user data:', err);
                setError(err.message || 'Failed to load user data');
                setUserData({
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
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []); 

    console.log("Current user data:", JSON.stringify(userData, null, 2));

    return {
        userData,
        loading,
        error
    };
};

export default useUserProfile; 