import * as modulesDao from "./dao.js";
import Database from "../Database/index.js";
export default function ModuleRoutes(app) {


    app.get("/api/debug/modules", (req, res) => {
        res.json({
            modulesData: Database.Modules,
            type: typeof Database.Modules,
            isArray: Array.isArray(Database.Modules),
            length: Database.Modules?.length
        });
    });

    app.get("/api/courses/:courseId/modules", async (req, res) => {
        try {
            const { courseId } = req.params;
            const modules = await modulesDao.findModulesForCourse(courseId);
            res.json(modules);
        } catch (error) {
            console.error("Error fetching modules:", error);
            res.status(500).json({ error: "Failed to fetch modules" });
        }
    });

    app.post("/api/courses/:courseId/modules", async (req, res) => {
        try {
            const { courseId } = req.params;
            const moduleData = { ...req.body, course: courseId };
            const newModule = await modulesDao.createModule(moduleData);
            res.json(newModule);
        } catch (error) {
            console.error("Error creating module:", error);
            res.status(500).json({ error: "Failed to create module" });
        }
    });

    app.delete("/api/modules/:moduleId", (req, res) => {

        const { moduleId } = req.params;

        if (!moduleId) {
            return res.status(400).json({
                success: false,
                message: "Module ID is required"
            });
        }

        const result = modulesDao.deleteModule(moduleId);

        if (result.success) {
            res.json(result);
        } else {
            res.status(404).json(result);
        }
    });


    app.put("/api/modules/:moduleId", (req, res) => {

        const { moduleId } = req.params;

        if (!moduleId) {
            return res.status(400).json({
                success: false,
                message: "Module ID is required"
            });
        }

        const result = modulesDao.updateModule(moduleId, req.body);

        if (result.success) {
            res.json(result);
        } else {
            res.status(404).json(result);
        }
    });
}