import * as assignmentsDao from "./dao.js";
import Database from "../Database/index.js";

export default function AssignmentRoutes(app) {

    app.get("/api/courses/:courseId/assignments", (req, res) => {
        try {
            const { courseId } = req.params;
            const assignments = assignmentsDao.findAssignmentsForCourse(courseId);
            res.json(assignments);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch assignments" });
        }
    });

    app.get("/api/assignments/:assignmentId", (req, res) => {
        const { assignmentId } = req.params;
        const assignment = assignmentsDao.findAssignmentById(assignmentId);
        if (assignment) {
            res.json(assignment);
        } else {
            res.status(404).json({ message: "Assignment not found" });
        }
    });

    app.post("/api/courses/:courseId/assignments", (req, res) => {
        try {
            const { courseId } = req.params;
            const assignmentData = { ...req.body, course: courseId };
            const newAssignment = assignmentsDao.createAssignment(assignmentData);
            res.status(201).json(newAssignment);
        } catch (error) {
            res.status(500).json({ error: "Failed to create assignment" });
        }
    });

    app.put("/api/assignments/:assignmentId", (req, res) => {
        const { assignmentId } = req.params;

        if (!assignmentId) {
            return res.status(400).json({
                success: false,
                message: "Assignment ID is required"
            });
        }

        const result = assignmentsDao.updateAssignment(assignmentId, req.body);

        if (result.success) {
            res.json(result);
        } else {
            res.status(404).json(result);
        }
    });

    app.delete("/api/assignments/:assignmentId", (req, res) => {
        const { assignmentId } = req.params;

        if (!assignmentId) {
            return res.status(400).json({
                success: false,
                message: "Assignment ID is required"
            });
        }

        const result = assignmentsDao.deleteAssignment(assignmentId);

        if (result.success) {
            res.json(result);
        } else {
            res.status(404).json(result);
        }
    });

    app.get("/api/debug/assignments", (req, res) => {
        res.json({
            assignmentsData: Database.Assignments,
            type: typeof Database.Assignments,
            isArray: Array.isArray(Database.Assignments),
            length: Database.Assignments?.length
        });
    });
}