import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export function findModulesForCourse(courseId) {
    if (!Database.Modules) {
        Database.Modules = [];
        return [];
    }

    let allModules = [];

    Database.Modules.forEach(moduleGroup => {
        if (moduleGroup[courseId]) {
            const originalModules = moduleGroup[courseId].map((module, index) => ({
                ...module,
                _id: module._id || `${courseId}-module-${index}`,
                course: courseId
            }));
            allModules.push(...originalModules);
        }
    });

    const newFormatModules = Database.Modules.filter(module =>
        module.course === courseId && module._id && !module[courseId]
    );
    allModules.push(...newFormatModules);

    return allModules;
}

export function createModule(module) {
    if (!Database.Modules) {
        Database.Modules = [];
    }

    const newModule = {
        ...module,
        _id: uuidv4(),
        course: module.course
    };

    Database.Modules.push(newModule);
    return newModule;
}

export function deleteModule(moduleId) {

    if (!Database.Modules) {
        Database.Modules = [];
        return { success: false, message: "No modules found" };
    }

    let deleted = false;

    Database.Modules.forEach(moduleGroup => {
        Object.keys(moduleGroup).forEach(courseId => {
            if (Array.isArray(moduleGroup[courseId])) {
                const originalLength = moduleGroup[courseId].length;

                moduleGroup[courseId] = moduleGroup[courseId].filter((module, index) => {
                    const moduleIdToCheck = module._id || `${courseId}-module-${index}`;
                    return moduleIdToCheck !== moduleId;
                });

                if (moduleGroup[courseId].length < originalLength) {
                    deleted = true;
                }
            }
        });
    });

    const initialLength = Database.Modules.length;
    Database.Modules = Database.Modules.filter((module) => {
        if (typeof module === 'object' && !module._id && !module.course) {
            return true;
        }
        return module._id !== moduleId;
    });

    if (Database.Modules.length < initialLength) {
        deleted = true;
    }

    if (deleted) {
        return { success: true, message: "Module deleted successfully" };
    } else {
        return { success: false, message: "Module not found" };
    }
}


export function updateModule(moduleId, updatedData) {
    if (!Database.Modules) {
        Database.Modules = [];
        return { success: false, message: "No modules found" };
    }

    let updated = false;

    Database.Modules.forEach(moduleGroup => {
        Object.keys(moduleGroup).forEach(courseId => {
            if (Array.isArray(moduleGroup[courseId])) {
                moduleGroup[courseId] = moduleGroup[courseId].map((module, index) => {
                    const moduleIdToCheck = module._id || `${courseId}-module-${index}`;
                    if (moduleIdToCheck === moduleId) {
                        updated = true;
                        return { ...module, ...updatedData, _id: moduleIdToCheck };
                    }
                    return module;
                });
            }
        });
    });

    Database.Modules = Database.Modules.map(module => {
        if (module._id === moduleId) {
            updated = true;
            return { ...module, ...updatedData };
        }
        return module;
    });

    if (updated) {
        return { success: true, message: "Module updated successfully" };
    } else {
        return { success: false, message: "Module not found" };
    }
}