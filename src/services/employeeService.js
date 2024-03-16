const { response } = require("express");
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
const getAllEmployees = async ()=>{
    let response = new Promise((resolve,reject)=>{
        const conexion = getConexion();
        const sql = "SELECT * FROM empleados";
        conexion.query(sql, function (err, result, fields) {
            if (err) reject(err);
            else
            resolve(JSON.parse(JSON.stringify(result)));
        });
        conexion.end();
    });
    return response;
}

const getEmployee = async (employeeId = 0) => {
    let response ={
        error:true,
        message:''
    }
    try{
        if(employeeId==0){
            throw Error("Id can not by empty");
        }
        let res = await new Promise((resolve,reject)=>{
            const conexion = getConexion();
            const sql = 
            `SELECT * 
            FROM empleados 
            WHERE  id = '${employeeId}'`;
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

const createEmployee = async (newEmployeeData) => {
    const newEmployee = {...newEmployeeData};
    let response = new Promise((resolve, reject) => {
            const conexion = getConexion();
            const sql = 
            `INSERT INTO empleados (
                nombre,
                salario
                )
            VALUES (
                '${newEmployee.name}',
                '${newEmployee.salary}'
            )`;
            conexion.query(sql,async function (err, result) {
            if (err) reject({
                error: true,
                message: err
            });
            else {
                let dataEmployee = {id: result.insertId,...newEmployee};
                resolve({
                    error: false,
                    data: dataEmployee
                })
            }
        });
        conexion.end();
    });
    return response;
};

const updateEmployee = async (employee)=>{
    let response = {
        error : true,
        message : ''
    };
    try{
         
        if (Object.entries(employee).length === 0 )
            throw new Error('Data employee is empty');
        let res = await new Promise((resolve,reject)=>{
            const conexion = getConexion();
            const sql = 
            `UPDATE
                empleados
            SET
                nombre = '${employee.name}',
                salario = '${employee.salary}'
            WHERE id = '${employee.id}' `;
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
            response.message = 'Any record was updated to employee ' + employee.id;
        }
        response.error = false;
        response = {...response,affectedRows: res.affectedRows};
    }catch(error){
        response.message = error.message + 
        ", could not by updated record";
    }
    return response;
};

const deleteEmployee = async (employeeId = 0)=>{
    let response = {
        error : true,
        message : ''
    };
    try{
        let res = await new Promise((resolve,reject)=>{
            const conexion = getConexion();
            const sql = 
            `DELETE FROM empleados WHERE  id = '${employeeId}'`;
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
            response.message = `Any employee was affected`;
        }else{
            response.message = `Employee ${employeeId} was deleted successfully`;
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
    getAllEmployees,
    getEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee
};