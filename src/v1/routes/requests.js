const express = require("express");
const router = express.Router();
const employee = require('../../controllers/requestController');
router
    .get("/:employeeId",employee.getAllRequests)
    .get("/:requestId",employee.getRequestById)
    .post("/",employee.createRequest)
    .patch("/",employee.updateRequest)
    .delete("/:requestId",employee.deleteRequest);

module.exports = router;