import express from 'express'
const router = express.Router()

import {
	createCandidate,
	deleteCandidate,
	getAllCandidates,
	updateCandidate,
	showStats,
	getAllCandidatesWithoutUser
} from "../controllers/candidatesController.js";

router.route('/').post(createCandidate).get(getAllCandidates)
router.route('/candidates').get(getAllCandidatesWithoutUser)
//remember about :id
router.route('/stats').get(showStats)
router.route('/:id').delete(deleteCandidate).patch(updateCandidate)


export default router