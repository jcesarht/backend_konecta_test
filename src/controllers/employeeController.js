const employeeService = require("../services/employeeService");

const getAllEmployees = async (req,res) => {
    employeeService.initialize();
    const result = await employeeService.getAllEmployees();
    res.status(200);
    res.send(result);
};
const getEmployeeById = async (req,res) => {
    const {params} = req;
    employeeService.initialize();
    const result = await employeeService.getEmployee(params.employeeId);
    res.status(200);
    if(result.error){
        result.message = 'Can not by found employee on not exist';
        res.status(400);
    }
    res.send(result);
};
const createEmployee = async (req,res) => {
    let result = {
        error: true,
        message: '',
    };
    try{
        let validate = validateFields(req.body);
        if(validate.error){
            throw Error (validate.message);
        }
        
        const newEmployee = {
            name: req.body.name,
            salary: parseInt(req.body.salary)
        };
        employeeService.initialize();
        let create = {error: true};
        try{
            create = await employeeService.createEmployee(newEmployee);
        }catch(error_database){
            create.error = true;
        }
        if(create.error){
            throw new Error("Employee not created. Please contact support");
        }
        result = {
            error: false,
            message: 'Employee is creted successfully',
            data: create.data
        };
        res.status(201);
    }catch(error){
        res.status(400);
        result.message = error.message;
    }
    res.send(result);
};
const updateEmployee = async (req,res) => {
    let result = {
        error: true,
        message: '',
    };
    try{
        const {body} = req;
        let validate = validateFields(body,'update');
        if(validate.error){
            throw Error (validate.message);
        }

        const editEmployee = {
            id: body.id,
            name: body.name,
            salary: parseInt(body.salary)
        };

        employeeService.initialize();
        let update = {error: true};
        try{
            update = await employeeService.updateEmployee(editEmployee);
        }catch(error_database){
            update.error = true;
        }
        if(update.error){
            throw new Error("Employee could not by updated. Please contact support");
        }
        let message = '';
      
        if(update.affectedRows == 0){
            message =  'Any record was updated to employee ' + editEmployee.id ;
        }else{
            message = 'Employee ' + editEmployee.id + ' was updated';
        }
        result = {
            error: false,
            message: message,
        };

        res.status(201);

    }catch(err){
        res.status(400);
        result.message = err.message;
    }
    res.send(result);
};

const deleteEmployee = async (req,res) => {
    const {params} = req;
    let response = {
        error: true,
        message: ''
    };
    try{
        if(!params.employeeId){
            throw new Error("Id is empty or not exist, please fill out");
        }
        employeeService.initialize();
        const result = await employeeService.deleteEmployee(params.employeeId);
        console.log(result);
        if(result.error){
            throw new Error('Can not by found employee on not exist');
        }
        if (result.affectedRows > 0){
            response.message = 'Employee '+ params.employeeId + ' was deleted';
        }else{
            response.message = result.message;
        }
        response.error = false;
        res.status(200);
    }catch(err){
        res.status(400);
        response.message = err.message;
    }
    res.send(response);
};

const validateFields = (body, process = '') => {
    let message = ''; 
    let result = {
        error: true,
        message:message
    };
    try{
        let salary = Number(body.salary);

        if(process == 'update' && !body.id)
            throw new Error('Id is empty. pleas fill out');
        if (Object.entries(body).length === 0 )
            throw new Error('Body is empty.');
        else if(!body.name) 
            throw new Error('Field name is empty. Please fill out.');
        else if(!Number.isInteger(salary)) 
            throw new Error( 'Field salary is empty or it is not integer.');
    
        result.message = message;
        result.error = false;
    }catch(err){
        let error_message='';
        error_message = err.message;
        result.message = error_message;
    }
    return result;
}

module.exports = {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee
};