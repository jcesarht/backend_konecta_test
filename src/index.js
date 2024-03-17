const express = require("express");
const v1Employees = require("./v1/routes/employees");
const v1Request = require("./v1/routes/requests");
const e = require("express");
const app = express();
const PORT = process.env.PORT || 3001
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors({
  origin: 'http://localhost:3000' // Replace with your React app's origin
}));


app.use(express.json());
app.use('/api/v1/employee',v1Employees);
app.use('/api/v1/request',v1Request);
app.listen(PORT, ()=>{
    console.log(`Escuchando por el puerto ${PORT}`);
});
