const express = require("express");
const router = express.Router();
const employee = require('../../controllers/employeeController');
router
    .get("/",employee.getAllEmployees)
    .get("/:employeeId",employee.getEmployeeById)
    .post("/",employee.createEmployee)
    .patch("/",employee.updateEmployee)
    .delete("/:employeeId",employee.deleteEmployee);

module.exports = router;