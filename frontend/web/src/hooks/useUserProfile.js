import { useState, useEffect, useRef } from 'react';
import { getUserById } from '../api/userAPI';

const initialUserData = {
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
};

const useUserProfile = (id) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(initialUserData);
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;

        const fetchUserData = async () => {
            if (!id) {
                setUserData(initialUserData);
                setLoading(false);
                setError(null);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const response = await getUserById(id);

                if (!response) {
                    throw new Error('Không nhận được dữ liệu từ API');
                }

                if (isMounted.current) {
                    setUserData(response);
                    setError(null);
                }
            } catch (err) {
                if (isMounted.current) {
                    setError(err.message || 'Không thể tải thông tin người dùng');
                    setUserData(initialUserData);
                }
            } finally {
                if (isMounted.current) {
                    setLoading(false);
                }
            }
        };

        fetchUserData();

        return () => {
            isMounted.current = false;
        };
    }, [id]);

    return { userData, loading, error };
};

export default useUserProfile;