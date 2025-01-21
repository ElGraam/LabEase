import express from "express";
import { signIn } from "./functions/signIn";
import { signUp } from "./functions/signUp";
import { lab_register } from "./functions/lab_register";
import { errorHandler, notFound } from "./middleware/errorHandler";
import { get_all } from "./functions/get_all";
import { get_student_basedId } from "./functions/get_studentid";
import { get_lab } from "./functions/get_lab";
import { updateProjectMilestone } from "./functions/update_project_milestone";
import { projectCreate } from "./functions/project_create";
import { projectRegister } from "./functions/project_register";
import { get_labproject } from "./functions/get_labproject";
import { get_project } from "./functions/get_project";
import { update_project } from "./functions/update_project";
import { delete_project } from "./functions/delete_project";
import { get_lab_member } from "./functions/get_lab_member";
import { updateProfile } from "./functions/update_profile";
import { meeting_create } from "./functions/meeting_create";
import { get_meetings } from "./functions/get_meetings";
import { availableSlots_create } from "./functions/availableslot_create";
import { get_availableslot } from "./functions/get_availableslots";
import { delete_availableslot } from "./functions/delete_availableslot";
import { delete_meeting } from "./functions/delete_meeting";
import { get_lab_availableslot } from "./functions/get_lab_availableslot";
import { delete_projectmember } from "./functions/delete_projectmember";
import { delete_meetingmember } from "./functions/delete_meetingmember";
import { get_meeting } from "./functions/get_meeting";
const app = express();
app.use(express.json());

// auth
app.post("/api/auth/signup", signUp);
app.post("/api/auth/signin", signIn);

// lab
app.post("/api/lab/register", lab_register);
app.get("/api/role/:role", get_all);
app.get("/api/student/:studentId", get_student_basedId);
app.get("/api/lab/:labId", get_lab);
app.get("/api/lab/:labId/members", get_lab_member);
app.put("/api/profile/:userId", updateProfile);

// project
app.post("/api/project/create", projectCreate);
app.post("/api/project/milestone", updateProjectMilestone);
app.post("/api/project/register", projectRegister);
app.get("/api/lab/:labid/projects", get_labproject);
app.get("/api/project/:projectId", get_project);
app.put("/api/project/:projectId", update_project);
app.delete("/api/project/:projectId", delete_project);
app.delete("/api/project/:projectId/member/:userId", delete_projectmember);
// meeting
app.post("/api/meeting/create", meeting_create);
app.get("/api/meeting/user/:userId", get_meetings);
app.post("/api/availableslots/create/:userId", availableSlots_create);
app.delete("/api/meeting/:meetingId", delete_meeting);
app.get("/api/availableslots/:userId", get_availableslot);
app.delete("/api/availableslots/:availableSlotId", delete_availableslot);
app.get("/api/lab/:labId/availableslots", get_lab_availableslot);
app.delete("/api/meeting/:meetingId/member/:userId", delete_meetingmember);
app.get("/api/meeting/:meetingId", get_meeting);
// error handler
app.use(notFound);
app.use(errorHandler);

app.listen("5000", () => console.log(`Listen API Server PORT 5000`));
