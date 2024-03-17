const mysql = require("mysql");
let conn = {}; 

const initialize = ()=>{
    conn = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "konecta_prueba"
    });
};

const getConexion = () =>{
    return conn;
}
const getAllRequests = async (employeeId)=>{
    let response = new Promise((resolve,reject)=>{
        const conexion = getConexion();
        const sql = `
        SELECT * 
        FROM solicitudes
        WHERE id_empleado = '${employeeId}'`;
        conexion.query(sql, function (err, result, fields) {
            if (err) reject(err);
            else
            resolve(JSON.parse(JSON.stringify(result)));
        });
        conexion.end();
    });
    return response;
}

const getRequest = async (requestId = 0) => {
    let response ={
        error:true,
        message:''
    }
    try{
        if(requestId==0){
            throw Error("Id can not by empty");
        }
        let res = await new Promise((resolve,reject)=>{
            const conexion = getConexion();
            const sql = 
            `SELECT * 
            FROM solicitudes 
            WHERE  id = '${requestId}'`;
            conexion.query(sql, function (err, result, fields) {
                if (err) reject({
                    error:true,
                    message: err
                });
                else
                resolve(JSON.parse(JSON.stringify(result)));
            });
            conexion.end();
        });
        response.error = false;
        response = {...response, data: res };
    }catch(error){
        response.message = error.message;
    } 
    return response;
};

const createRequest = async (newRequestData) => {
    const newRequest = {...newRequestData};
    let response = new Promise((resolve, reject) => {
            const conexion = getConexion();
            const sql = 
            `INSERT INTO solicitudes (
                codigo,
                descripcion,
                resumen,
                id_empleado
                )
            VALUES (
                '${newRequest.code}',
                '${newRequest.description}',
                '${newRequest.resume}',
                '${newRequest.employee_id}'
            )`;
            conexion.query(sql,async function (err, result) {
            if (err) reject({
                error: true,
                message: err
            });
            else {
                let dataRequest = {id: result.insertId,...newRequest};
                resolve({
                    error: false,
                    data: dataRequest
                })
            }
        });
        conexion.end();
    });
    return response;
};

const updateRequest = async (request)=>{
    let response = {
        error : true,
        message : ''
    };
    try{
         
        if (Object.entries(request).length === 0 )
            throw new Error('Data request is empty');
        let res = await new Promise((resolve,reject)=>{
            const conexion = getConexion();
            let add_field = '';
            if(request.employee_id){
                add_field = `, id_empleado = '${request.employee_id}'`;
            }
            const sql = 
            `UPDATE
                solicitudes
            SET
                codigo = '${request.code}',
                descripcion = '${request.description}',
                resumen = '${request.resume}'
                ${add_field}
            WHERE id = '${request.id}' `;
            conexion.query(sql,async function (err, result) {
                if (err) reject({
                    error: true,
                    message: err
                });
                else {
                    resolve({
                        error: false,
                        affectedRows: result.affectedRows
                    })
                }
            });
            conexion.end();
        });
        
        if(res.error)
            throw new Error(res.message);
        if(res.affectedRows == 0){
            response.message = 'Any record was updated to request ' + request.id;
        }
        response.error = false;
        response = {...response,affectedRows: res.affectedRows};
    }catch(error){
        response.message = error.message + 
        ", could not by updated record";
    }
    return response;
};

const deleteRequest = async (requestId = 0)=>{
    let response = {
        error : true,
        message : ''
    };
    try{
        let res = await new Promise((resolve,reject)=>{
            const conexion = getConexion();
            const sql = 
            `DELETE FROM solicitudes WHERE id = '${requestId}'`;
            conexion.query(sql,async function (err, result) {
                if (err) reject({
                    error: true,
                    message: err
                });
                else {
                    resolve({
                        error: false,
                        affectedRows: result.affectedRows
                    })
                }
            });
            conexion.end();
        });
        if (!res.error && res.affectedRows == 0){
            response.message = `Any request was affected`;
        }else{
            response.message = `Request ${requestId} was deleted successfully`;
        }
        response.error= false;
        response = {...response,affectedRows: res.affectedRows};
    }catch(err){
        response.message = err.message + 
        ", could not by deleted";
    }
    return response;
}

module.exports={
    initialize,
    getAllRequests,
    getRequest,
    createRequest,
    updateRequest,
    deleteRequest
};