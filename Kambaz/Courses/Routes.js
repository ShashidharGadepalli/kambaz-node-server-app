import * as dao from "./dao.js";
import * as modulesDao from "../Modules/dao.js";

export default function CourseRoutes(app) {
    // GET all courses
    app.get("/api/courses", (req, res) => {
        const courses = dao.findAllCourses();
        res.send(courses);
    });

    // GET enrolled courses for current user
    app.get("/api/users/current/courses", (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.status(401).json({ message: "Not logged in" });
            return;
        }
        const enrolledCourses = dao.findCoursesForEnrolledUser(currentUser._id);
        res.json(enrolledCourses);
    });

    // CREATE new course
    app.post("/api/courses", (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser || currentUser.role !== "FACULTY") {
            res.status(403).json({ message: "Only faculty can create courses" });
            return;
        }
        const newCourse = dao.createCourse(req.body);
        res.json(newCourse);
    });

    // UPDATE course
    app.put("/api/courses/:courseId", (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser || currentUser.role !== "FACULTY") {
            res.status(403).json({ message: "Only faculty can update courses" });
            return;
        }
        const { courseId } = req.params;
        const updatedCourse = dao.updateCourse(courseId, req.body);
        if (updatedCourse) {
            res.json(updatedCourse);
        } else {
            res.status(404).json({ message: "Course not found" });
        }
    });

    // DELETE course
    app.delete("/api/courses/:courseId", (req, res) => {
        const currentUser = req.session["currentUser"];


        const { courseId } = req.params;
        const result = dao.deleteCourse(courseId);

        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(404).json(result);
        }
    });


    // GET course by ID
    app.get("/api/courses/:courseId", (req, res) => {
        const { courseId } = req.params;
        const course = dao.findCourseById(courseId);
        if (course) {
            res.json(course);
        } else {
            res.status(404).json({ message: "Course not found" });
        }
    });

    app.get("/api/courses/:courseId/modules", (req, res) => {
        const { courseId } = req.params;
        const modules = modulesDao.findModulesForCourse(courseId);
        res.json(modules);
    });

    app.post("/api/courses/:courseId/modules", (req, res) => {
        const { courseId } = req.params;
        const module = {
            ...req.body,
            course: courseId,
        };
        const newModule = modulesDao.createModule(module);
        res.send(newModule);
    });


}