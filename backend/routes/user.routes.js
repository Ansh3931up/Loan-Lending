import { Router } from "express";
import {
    register,
    login,
    logout,
    getUser,
    getCurrentQuestionnaire,
    submitQuestionnaire,
    getStatus,
    submitRiskAssessment
} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js"
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Auth routes
router.route("/register").post(upload.single("avatar"), register);
router.route("/login").post(login);
router.route("/logout").post(verifyJWT, logout);
router.route("/getuser").get(verifyJWT, getUser);

// Questionnaire routes
router.route('/questionnaire').get(verifyJWT, getCurrentQuestionnaire);
router.route('/questionnaire/submit').post(verifyJWT, submitQuestionnaire);
router.route('/questionnaire/status').get(verifyJWT, getStatus);
router.route('/questionnaire/submit-risk-assessment').post(verifyJWT, submitRiskAssessment);

export default router;