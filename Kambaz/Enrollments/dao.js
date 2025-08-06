import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export function enrollUserInCourse(userId, courseId) {


    if (!Database.Enrollments) {
        Database.Enrollments = [];
    }

    const existingEnrollment = Database.Enrollments.find(
        enrollment => enrollment.user === userId && enrollment.course === courseId
    );

    if (!existingEnrollment) {
        Database.Enrollments.push({
            _id: uuidv4(),
            user: userId,
            course: courseId
        });
    }
}

export function unenrollUserFromCourse(userId, courseId) {
    if (!Database.Enrollments) {
        Database.Enrollments = [];
        return;
    }

    Database.Enrollments = Database.Enrollments.filter(
        enrollment => !(enrollment.user === userId && enrollment.course === courseId)
    );
}

export function findCoursesForEnrolledUser(userId) {

    if (!Database.Enrollments) {
        return [];
    }

    const userEnrollments = Database.Enrollments.filter(
        enrollment => enrollment.user === userId
    );
    const courseIds = userEnrollments.map(enrollment => enrollment.course);
    return courseIds;
}

export function findEnrolledUsersForCourse(courseId) {
    if (!Database.Enrollments) {
        return [];
    }

    const courseEnrollments = Database.Enrollments.filter(
        enrollment => enrollment.course === courseId
    );

    return courseEnrollments.map(enrollment => enrollment.user);
}