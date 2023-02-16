let Expenses = require('../models/expenses');
let User  = require('../models/user');
const { BlobServiceClient } = require('@azure/storage-blob');
const { v1: uuidv1} = require('uuid');



const fs = require('fs');
const sequelize = require('../util/database');
function isstringValid(string){
    if(string == undefined || string.length === 0){
        return true;
    }else{
        return false;
    }
};

let AddExpenses = async(req ,res)=>{
    var t = await sequelize.transaction();
    try{
      let {expenses , description , category} = req.body ;
    if(isstringValid(expenses) || isstringValid(description) || isstringValid(category)){
        throw new Error();
    }
    let expense =  await Expenses.create({expenses, description , category , userId:req.user.id , transaction:t})
        let totalExpenses = Number(req.user.totalExpenses)+Number(expenses);
        await User.update({totalExpenses:totalExpenses},{where:{id:req.user.id}, transaction:t})
            await t.commit();
        res.status(200).json({expense:expense , success:true, message:'Expenses is add to data base successfully'});
    }
    catch(err){
        await t.rollback();
        res.status(500).json({message:err , success:false});
    }
};

let GetExpense = async(req , res)=>{
    try{
        Expenses.findAll({where:{userId:req.user.id}}).then(expenses => {
            return res.status(200).json({expenses, success:true})
        });
    }catch(err){
        res.status(500).json({error:err , success:false , message:'Failed to fetch data from the database'})
    }
};

const DeleteExpense = async (req, res) => {
    
    try{
        const ExpId = req.params.expenseid;
        if(isstringValid(ExpId)){
            return res.status(400).json({success: false, })
        }
       let response = Expenses.destroy({where: { id: ExpId , userId:req.user.id }})
   
        return res.status(200).json({response, success: true, message: "Deleted Successfully"})
    
     
 
    
     
    }catch(err){

        res.status(500).json({error:err , success:false , message:'Failed to delete data from the database'})
    }
};

const downloadExpenses =  async (req, res) => {
   try{
    Expenses.findAll({where: {userId:req.user.id}}).then(expenses=>{
        fs.writeFile("expenses.txt", JSON.stringify(expenses), (err) => {
            if (err)
              console.log(err);
            else {
              console.log("File written successfully\n");
              console.log("The written has the following contents:");
              console.log(fs.readFileSync("expenses.txt", "utf8"));
            }
        });
        const file=`${__dirname}/expenses.txt`
        res.status(200).send(JSON.stringify(expenses))
    }).catch(err=>console.log(err))
}catch(err){
    res.status(500).json({error:err , message:err , success:false})
}
};


module.exports = {
    AddExpenses,
    GetExpense,
    DeleteExpense,
    downloadExpenses,
}