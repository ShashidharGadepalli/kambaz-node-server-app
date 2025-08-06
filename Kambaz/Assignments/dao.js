import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export function findAssignmentsForCourse(courseId) {
    if (!Database.Assignments) {
        Database.Assignments = [];
        return [];
    }

    let allAssignments = [];
    Database.Assignments.forEach(assignmentGroup => {
        if (assignmentGroup[courseId]) {
            const originalAssignments = assignmentGroup[courseId].map((assignment, index) => ({
                ...assignment,
                _id: assignment._id || `${courseId}-assignment-${index}`,
                course: courseId
            }));
            allAssignments.push(...originalAssignments);
        }
    });

    const newFormatAssignments = Database.Assignments.filter(assignment =>
        assignment.course === courseId && assignment._id && !assignment[courseId]
    );
    allAssignments.push(...newFormatAssignments);

    return allAssignments;
}

export function createAssignment(assignment) {
    if (!Database.Assignments) {
        Database.Assignments = [];
    }

    const newAssignment = {
        ...assignment,
        _id: uuidv4(),
        course: assignment.course
    };

    Database.Assignments.push(newAssignment);
    return newAssignment;
}

export function updateAssignment(assignmentId, updatedData) {
    if (!Database.Assignments) {
        Database.Assignments = [];
        return { success: false, message: "No assignments found" };
    }

    let updated = false;

    Database.Assignments.forEach(assignmentGroup => {
        Object.keys(assignmentGroup).forEach(courseId => {
            if (Array.isArray(assignmentGroup[courseId])) {
                assignmentGroup[courseId] = assignmentGroup[courseId].map((assignment, index) => {
                    const assignmentIdToCheck = assignment._id || `${courseId}-assignment-${index}`;
                    if (assignmentIdToCheck === assignmentId) {
                        updated = true;
                        return { ...assignment, ...updatedData, _id: assignmentIdToCheck };
                    }
                    return assignment;
                });
            }
        });
    });

    Database.Assignments = Database.Assignments.map(assignment => {
        if (assignment._id === assignmentId) {
            updated = true;
            return { ...assignment, ...updatedData };
        }
        return assignment;
    });

    if (updated) {
        return { success: true, message: "Assignment updated successfully" };
    } else {
        return { success: false, message: "Assignment not found" };
    }
}

export function deleteAssignment(assignmentId) {
    if (!Database.Assignments) {
        Database.Assignments = [];
        return { success: false, message: "No assignments found" };
    }

    let deleted = false;

    Database.Assignments.forEach(assignmentGroup => {
        Object.keys(assignmentGroup).forEach(courseId => {
            if (Array.isArray(assignmentGroup[courseId])) {
                const originalLength = assignmentGroup[courseId].length;

                assignmentGroup[courseId] = assignmentGroup[courseId].filter((assignment, index) => {
                    const assignmentIdToCheck = assignment._id || `${courseId}-assignment-${index}`;
                    return assignmentIdToCheck !== assignmentId;
                });

                if (assignmentGroup[courseId].length < originalLength) {
                    deleted = true;
                }
            }
        });
    });

    const initialLength = Database.Assignments.length;
    Database.Assignments = Database.Assignments.filter((assignment) => {
        if (typeof assignment === 'object' && !assignment._id && !assignment.course) {
            return true;
        }
        return assignment._id !== assignmentId;
    });

    if (Database.Assignments.length < initialLength) {
        deleted = true;
    }

    if (deleted) {
        return { success: true, message: "Assignment deleted successfully" };
    } else {
        return { success: false, message: "Assignment not found" };
    }
}

export function findAssignmentById(assignmentId) {
    if (!Database.Assignments) {
        return null;
    }

    for (const assignmentGroup of Database.Assignments) {
        for (const courseId of Object.keys(assignmentGroup)) {
            if (Array.isArray(assignmentGroup[courseId])) {
                const found = assignmentGroup[courseId].find((assignment, index) => {
                    const assignmentIdToCheck = assignment._id || `${courseId}-assignment-${index}`;
                    return assignmentIdToCheck === assignmentId;
                });
                if (found) {
                    return { ...found, _id: found._id || `${courseId}-assignment-${assignmentGroup[courseId].indexOf(found)}`, course: courseId };
                }
            }
        }
    }

    const found = Database.Assignments.find(assignment => assignment._id === assignmentId);
    return found || null;
}