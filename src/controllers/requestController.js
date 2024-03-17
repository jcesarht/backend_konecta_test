const requestService = require("../services/requestService");

const getAllRequests = async (req,res) => {
    requestService.initialize();
    const {params} = req;
    const result = await requestService.getAllRequests(params.employeeId);
    res.status(200);
    res.send(result);
};
const getRequestById = async (req,res) => {
    const {params} = req;
    requestService.initialize();
    const result = await requestService.getRequest(params.requestId);
    res.status(200);
    if(result.error){
        result.message = 'Can not by found request on not exist';
        res.status(400);
    }
    res.send(result);
};
const createRequest = async (req,res) => {
    let result = {
        error: true,
        message: '',
    };
    try{
        let validate = validateFields(req.body);
        if(validate.error){
            throw Error (validate.message);
        }
        
        const newRequest = {
            code: req.body.code,
            description: req.body.description,
            resume: req.body.resume,
            employee_id: req.body.employee_id
        };
        requestService.initialize();
        let create = {error: true};
        try{
            create = await requestService.createRequest(newRequest);
        }catch(error_database){
            create.error = true;
        }
        if(create.error){
            console.log(create);
            throw new Error("Request not created. Please contact support");
        }
        result = {
            error: false,
            message: 'Request is creted successfully',
            data: create.data
        };
        res.status(201);
    }catch(error){
        res.status(400);
        result.message = error.message;
    }
    res.send(result);
};
const updateRequest = async (req,res) => {
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

        const editRequest = {
            id: body.id,
            code: body.code,
            description: body.description,
            resume: body.resume,
        };
        if(body.employee_id){
            editRequest.employee_id = body.employee_id
        }
        requestService.initialize();
        let update = {error: true};
        try{
            update = await requestService.updateRequest(editRequest);
        }catch(error_database){
            update.error = true;
        }
        if(update.error){
            throw new Error("Request could not by updated. Please contact support");
        }
        let message = '';
      
        if(update.affectedRows == 0){
            message =  'Any record was updated to request ' + editRequest.id ;
        }else{
            message = 'Request ' + editRequest.id + ' was updated';
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

const deleteRequest = async (req,res) => {
    const {params} = req;
    let response = {
        error: true,
        message: ''
    };
    try{
        if(!params.requestId){
            throw new Error("Id is empty or not exist, please fill out");
        }
        requestService.initialize();
        const result = await requestService.deleteRequest(params.requestId);
        console.log(result);
        if(result.error){
            throw new Error('Can not by found request on not exist');
        }
        if (result.affectedRows > 0){
            response.message = 'Request '+ params.requestId + ' was deleted';
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
        let id = Number(body.id);
        if (Object.entries(body).length === 0 )
        throw new Error('Body is empty. you must complete the body');
        else if(process == 'update' && !body.id || !Number.isInteger(id))
            throw new Error('Request id is empty. please fill out');
        else if(!body.code) 
        throw new Error('Field code is empty. Please fill out.');
        else if(!body.description) 
            throw new Error( 'Field description is empty. Please fill out.');
        else if(!body.resume) 
        throw new Error( 'Field resume is empty. Please fill out.');
    
        if(body.employee_id){
            let employeeId = Number(body.employee_id);
            if(!Number.isInteger(employeeId)) 
                throw new Error( 'Field employee_id is not integer. Please fill out.');
        }
    
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
    getAllRequests,
    getRequestById,
    createRequest,
    updateRequest,
    deleteRequest
};