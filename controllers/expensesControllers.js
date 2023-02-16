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


// Pagination
var ItemsPerPage = 2;

// Records per page
const updatePages=(req,res,next)=>{
    console.log(req.params.pages)
    ItemsPerPage=parseInt(req.params.pages)
    res.status(200).send({updated:true})
}

const pagination = async(req,res)=>{
    let totalExpenses ; 
    let pos = 0;
    let neg = 0;
    let page = +req.params.pageNo || 1;
    let pageSize = +req.params.PageSize|| 1;
    let Items = Expenses.findAll({where:{userId:req.user.id}})
    .then(response=>{
        totalExpenses = response.length ;
        response.map(i =>{
            (i.amount > 0 )?pos += i.amount:neg+=i.amount;

        })
    })
    .catch(err=>{
        console.log(err);
    });
    Expenses.findAll({where:{userId:req.user.id},
    offset:(page - 1) * ItemsPerPage , // offset : cluasees specifec rows the numbers of rows of the result table  to skip before any rows are retrived
    limit:ItemsPerPage , // limit allows to limit the number of rows returned form query
    })
    .then(response =>{
        res.status(200).send({
            response : response,
            currentPage : page ,// current page the page which page is we are on now
            hasNextPage:ItemsPerPage * page < totalExpenses,
            hasPreviousPage : page > 1, // if pagination has previous page check the page > 1
            nextPage : page + 1 , // if there is next page just increase the page
            previousPage:page - 1 ,// if there is previous page just decrease the pge
            lastPage : Math.ceil(totalExpenses / ItemsPerPage),
            Items:totalExpenses,
        })
    })
}

module.exports = {
    AddExpenses,
    GetExpense,
    DeleteExpense,
    downloadExpenses,
    pagination,
    updatePages
}