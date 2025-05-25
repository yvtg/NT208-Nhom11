import React, { useState } from 'react';
import useUserProfile from '../hooks/useUserProfile';
import { useParams } from 'react-router-dom';

const Intro = () => {
    const { userId } = useParams();
    const { userData, loading, error, updateUserSection } = useUserProfile(userId);
    const [isEditing, setIsEditing] = useState(false);
    const [editedAbout, setEditedAbout] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Initialize editedAbout when userData changes
    React.useEffect(() => {
        if (userData.about) {
            setEditedAbout(userData.about);
        }
    }, [userData.about]);

    const handleEdit = () => {
        setIsEditing(true);
        setEditedAbout(userData.about || '');
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedAbout(userData.about || '');
    };

    const handleSave = async () => {
        if (editedAbout === userData.about) {
            setIsEditing(false);
            return;
        }

        setIsSaving(true);
        try {
            const success = await updateUserSection('about', { about: editedAbout });
            if (success) {
                setIsEditing(false);
            }
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="mt-4 p-4 bg-white rounded-lg shadow animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/4"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-4 p-4 bg-red-50 rounded-lg shadow">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="mt-4 p-4 bg-white rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">About Me</h3>
                {!isEditing ? (
                    <button
                        onClick={handleEdit}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        Edit
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={handleCancel}
                            className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                            disabled={isSaving}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            disabled={isSaving}
                        >
                            {isSaving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                )}
            </div>

            {isEditing ? (
                <div className="space-y-4">
                    <textarea
                        value={editedAbout}
                        onChange={(e) => setEditedAbout(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[150px] resize-y"
                        placeholder="Write something about yourself..."
                    />
                    <p className="text-sm text-gray-500">
                        {editedAbout.length}/1000 characters
                    </p>
                </div>
            ) : (
                <div className="prose max-w-none">
                    {userData.about ? (
                        <p className="text-gray-600 whitespace-pre-wrap">{userData.about}</p>
                    ) : (
                        <p className="text-gray-400 italic">No introduction available.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Intro; 