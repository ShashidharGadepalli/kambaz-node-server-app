import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";
export function findAllCourses() {
    return Database.Courses;
}
export function findCoursesForEnrolledUser(userId) {
    const { Courses, Enrollments } = Database;
    const enrolledCourses = Courses.filter((course) =>
        Enrollments.some((enrollment) => enrollment.user === userId && enrollment.course === course._id));
    return enrolledCourses;
}

export function createCourse(course) {
    const newCourse = { ...course, _id: uuidv4() };
    Database.Courses = [...Database.Courses, newCourse];
    return newCourse;
}

export function updateCourse(courseId, courseUpdates) {
    const { Courses } = Database;
    const courseIndex = Courses.findIndex((course) => course._id === courseId);
    if (courseIndex !== -1) {
        // Preserve the original ID and update other fields
        const updatedCourse = { ...Courses[courseIndex], ...courseUpdates, _id: courseId };
        Courses[courseIndex] = updatedCourse;
        return updatedCourse;
    }
    return null;
}

export function deleteCourse(courseId) {
    const { Courses, Enrollments } = Database;
    const courseExists = Courses.find((course) => course._id === courseId);

    if (!courseExists) {
        return { success: false, message: "Course not found" };
    }

    Database.Courses = Courses.filter((course) => course._id !== courseId);
    Database.Enrollments = Enrollments.filter(
        (enrollment) => enrollment.course !== courseId
    );

    return { success: true, message: "Course deleted successfully" };
}


export function findCourseById(courseId) {
    const { Courses } = Database;
    return Courses.find((course) => course._id === courseId);
}

