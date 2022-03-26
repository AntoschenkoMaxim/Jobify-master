import express from 'express'
const router = express.Router()

import { register, login, updateUser } from '../controllers/authController.js'
import { getAllJobsWithoutUser } from '../controllers/jobsController.js'
import { getAllCoursesWithoutUser } from '../controllers/coursesController.js'
import { getAllCandidatesWithoutUser } from '../controllers/candidatesController.js'
import authenticateUser from '../middleware/auth.js'

router.route('/register').post(register)
router.route('/landing/jobs').get(getAllJobsWithoutUser)
router.route('/landing/courses').get(getAllCoursesWithoutUser)
router.route('/landing/candidates').get(getAllCandidatesWithoutUser)
router.route('/login').post(login)
router.route('/updateUser').patch(authenticateUser, updateUser)


export default router