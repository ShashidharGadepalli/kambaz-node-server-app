import Database from "../Database/index.js";
export function findModulesForCourse(courseId) {
    const { Modules } = Database;
    // Modules is an array of objects, where each object has course IDs as keys
    for (const moduleGroup of Modules) {
        if (moduleGroup[courseId]) {
            return moduleGroup[courseId];
        }
    }
    return [];
}
export function createModule(module) {
    const newModule = { ...module, _id: uuidv4() };
    Database.Modules = [...Database.Modules, newModule];
    return newModule;
}

export function deleteModule(moduleId) {
    const { Modules } = Database;
    Database.Modules = Modules.filter((module) => module._id !== moduleId);
}


