
import * as enrollmentDao from "./dao.js";
import Database from "../Database/index.js";

export default function EnrollmentRoutes(app) {

    app.post("/api/users/:userId/courses/:courseId", (req, res) => {
        const { userId, courseId } = req.params;
        enrollmentDao.enrollUserInCourse(userId, courseId);
        res.json({ success: true, message: "Enrolled successfully" });
    });

    app.delete("/api/users/:userId/courses/:courseId", (req, res) => {
        const { userId, courseId } = req.params;
        enrollmentDao.unenrollUserFromCourse(userId, courseId);
        res.json({ success: true, message: "Unenrolled successfully" });
    });

    app.get("/api/users/:userId/courses", (req, res) => {
        const { userId } = req.params;
        const courseIds = enrollmentDao.findCoursesForEnrolledUser(userId);
        res.json(courseIds);
    });

    app.get("/api/debug/enrollments", (req, res) => {
        res.json({
            enrollmentsData: Database.Enrollments,
            type: typeof Database.Enrollments,
            isArray: Array.isArray(Database.Enrollments),
            length: Database.Enrollments?.length
        });
    });

    app.get("/api/enrollments", (req, res) => {
        res.json(Database.Enrollments);
    });

    app.post("/api/users/:userId/courses/:courseId", (req, res) => {
        console.log("🔥 ENROLLMENT ROUTE CALLED!");
        const { userId, courseId } = req.params;
        enrollmentDao.enrollUserInCourse(userId, courseId);
        res.json({ success: true, message: "Enrolled successfully" });
    });

    app.delete("/api/users/:userId/courses/:courseId", (req, res) => {
        console.log("🔥 UNENROLLMENT ROUTE CALLED!");
        const { userId, courseId } = req.params;
        enrollmentDao.unenrollUserFromCourse(userId, courseId);
        res.json({ success: true, message: "Unenrolled successfully" });
    });
}