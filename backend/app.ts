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
import { get_lab_member } from "./functions/get_lab_member";

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
// project
app.post("/api/project/create", projectCreate);
app.post("/api/project/milestone", updateProjectMilestone);
app.post("/api/project/register", projectRegister);
app.get("/api/lab/:labid/projects", get_labproject);
app.get("/api/project/:projectid", get_project);
app.put("/api/project/:projectid", update_project);
// error handler
app.use(notFound);
app.use(errorHandler);

app.listen("5000", () => console.log(`Listen API Server PORT 5000`));
