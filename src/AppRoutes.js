import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import UserPage from "./UserPage";
import EditProfile from "./EditProfile";
import Assignments from "./Assignment";
import EditAssignment from "./EditAssignment";
import AddAssignment from "./AddAssignment";
import Lab from "./Lab";
import AddLab from "./AddLab";
import EditLab from "./EditLab";
import Class from "./Class";
import AddClass from "./AddClass";
import EditClass from "./EditClass";
import Ct from "./Ct";
import AddCT from "./AddCT";
import EditCT from "./EditCT";
import UserAll from "./UserAll";
import Classroom from "./Classroom";
import CreateClassroom from "./CreateClassroom";
import CreateClassroomAssignment from "./CreateClassroomAssignment";
import CreateClassroomLab from "./CreateClassroomLab";
import CreateClassroomCT from "./CreateClassroomCT";
import CreateClassroomClass from "./CreateClassroomClass";
import CreateClassroomNotice from "./CreateClassroomNotice";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/user/:id" element={<UserPage />} />
        <Route path="/user/:id/edit-profile" element={<EditProfile />} />

        <Route path="/user/:id/assignment" element={<Assignments />} />
        <Route path="/user/:userId/assignment/:assignmentId" element={<EditAssignment />} />
        <Route path="/user/:id/add-assignment" element={<AddAssignment />} /> 

        <Route path="/user/:userId/all" element={<UserAll />} />

        <Route path="/user/:id/labs" element={<Lab />} />
        <Route path="/user/:userId/lab" element={<AddLab />} />
        <Route path="/user/:userId/lab/:labId" element={<EditLab />} />

        <Route path="/user/:id/class" element={<Class />} />
        <Route path="/user/:id/add-class" element={<AddClass />} />
        <Route path="/user/:userId/class/:classId" element={<EditClass />} />

        <Route path="/user/:id/cts" element={<Ct />} />
        <Route path="/user/:userId/add-ct" element={<AddCT/>} />
        <Route path="/user/:userId/ct/:ctId" element={<EditCT />} />


        <Route path="/user/:userId/classroom/:classroomId" element={<Classroom />} />
        <Route path="/user/:userId/create-classroom" element={<CreateClassroom />} />
        <Route path="/user/:userId/classroom/:classroomId/create-assignment" element={<CreateClassroomAssignment />} />
        <Route path="/user/:userId/classroom/:classroomId/create-lab" element={<CreateClassroomLab />} />
        <Route path="/user/:userId/classroom/:classroomId/create-ct" element={<CreateClassroomCT />} />
        <Route path="/user/:userId/classroom/:classroomId/create-class" element={<CreateClassroomClass />} />
        <Route path="/user/:userId/classroom/:classroomId/create-notice" element={<CreateClassroomNotice />} />



      </Routes>
    </Router>
  );
};

export default AppRoutes;
