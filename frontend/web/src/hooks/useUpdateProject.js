import { useState } from 'react';

// xử lý update project
const useUpdateProject = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateProject = async (projectId, updateData) => {
        try {
            setIsLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/project/updateproject/${projectId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                throw new Error('Không thể cập nhật dự án');
            }

            const updatedProject = await response.json();
            return updatedProject;

        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        updateProject,
        isLoading,
        error
    };
};

// update tên project
const useUpdateProjectName = () => {
    const { updateProject, isLoading, error } = useUpdateProject();

    const updateProjectName = async (projectId, newName, currentProject) => {
        const updateData = {
            projectName: newName,
            expiredDate: currentProject.expireddate,
            workingType: currentProject.workingtype,
            budget: currentProject.budget,
            description: currentProject.description,
            skills: currentProject.skills
        };

        return updateProject(projectId, updateData);
    };

    return {
        updateProjectName,
        isLoading,
        error
    };
};

// update ngày hết hạn
const useUpdateExpiredDate = () => {
    const { updateProject, isLoading, error } = useUpdateProject();

    const updateExpiredDate = async (projectId, newExpiredDate, currentProject) => {
        const updateData = {
            projectName: currentProject.projectname,
            expiredDate: newExpiredDate,
            workingType: currentProject.workingtype,
            budget: currentProject.budget,
            description: currentProject.description,
            skills: currentProject.skills
        };

        return updateProject(projectId, updateData);
    };

    return {
        updateExpiredDate,
        isLoading,
        error
    };
};

// update hình thức làm việc
const useUpdateWorkingType = () => {
    const { updateProject, isLoading, error } = useUpdateProject();

    const updateWorkingType = async (projectId, newWorkingType, currentProject) => {
        const updateData = {
            projectName: currentProject.projectname,
            expiredDate: currentProject.expireddate,
            workingType: newWorkingType,
            budget: currentProject.budget,
            description: currentProject.description,
            skills: currentProject.skills
        };

        return updateProject(projectId, updateData);
    };

    return {
        updateWorkingType,
        isLoading,
        error
    };
};

// update ngân sách
const useUpdateBudget = () => {
    const { updateProject, isLoading, error } = useUpdateProject();

    const updateBudget = async (projectId, newBudget, currentProject) => {
        const updateData = {
            projectName: currentProject.projectname,
            expiredDate: currentProject.expireddate,
            workingType: currentProject.workingtype,
            budget: newBudget,
            description: currentProject.description,
            skills: currentProject.skills
        };

        return updateProject(projectId, updateData);
    };

    return {
        updateBudget,
        isLoading,
        error
    };
};

// update mô tả
const useUpdateDescription = () => {
    const { updateProject, isLoading, error } = useUpdateProject();

    const updateDescription = async (projectId, newDescription, currentProject) => {
        const updateData = {
            projectName: currentProject.projectname,
            expiredDate: currentProject.expireddate,
            workingType: currentProject.workingtype,
            budget: currentProject.budget,
            description: newDescription,
            skills: currentProject.skills
        };

        return updateProject(projectId, updateData);
    };

    return {
        updateDescription,
        isLoading,
        error
    };
};

// update kỹ năng
const useUpdateSkills = () => {
    const { updateProject, isLoading, error } = useUpdateProject();

    const updateSkills = async (projectId, newSkills, currentProject) => {

        const skillsArray = Array.isArray(newSkills) ? newSkills : [];
        
        const updateData = {
            projectName: currentProject.projectname,
            expiredDate: currentProject.expireddate,
            workingType: currentProject.workingtype,
            budget: currentProject.budget,
            description: currentProject.description,
            skills: skillsArray
        };

        return updateProject(projectId, updateData);
    };

    return {
        updateSkills,
        isLoading,
        error
    };
};

export {
    useUpdateProjectName,
    useUpdateExpiredDate,
    useUpdateWorkingType,
    useUpdateBudget,
    useUpdateDescription,
    useUpdateSkills
}; 