const express = require("express");
const v1Employees = require("./v1/routes/employees");
const e = require("express");
const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json());
app.use('/api/v1/employee',v1Employees);
app.listen(PORT, ()=>{
    console.log(`Escuchando por el puerto ${PORT}`);
});
