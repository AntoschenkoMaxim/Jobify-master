import express from 'express'
const router = express.Router()

import {
	createCourse,
	deleteCourse,
	getAllCourses,
	updateCourse,
	showStats,
	getAllCoursesWithoutUser
} from "../controllers/coursesController.js";

router.route('/').post(createCourse).get(getAllCourses)
router.route('/courses').get(getAllCoursesWithoutUser)
//remember about :id
router.route('/stats').get(showStats)
router.route('/:id').delete(deleteCourse).patch(updateCourse)


export default router