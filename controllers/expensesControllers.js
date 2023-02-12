let Expenses = require('../models/expenses');


function isstringValid(string){
    if(string == undefined || string.length === 0){
        return true;
    }else{
        return false;
    }
};

let AddExpenses = async(req ,res)=>{
    try{
      let {expenses , description , category} = req.body ;
    if(isstringValid(expenses) || isstringValid(description) || isstringValid(category)){
        throw new Error();
    }
     await Expenses.create({expenses, description , category}).then((expense)=>{
        res.status(200).json({expense , success:true, message:'Expenses is add to data base successfully'});
     })
    }
    catch(err){
        res.status(500).json({message:err , success:false});
    }
};

let GetExpense = async(req , res)=>{
    try{
        Expenses.findAll().then(expenses => {
            return res.status(200).json({expenses, success:true})
        });
    }catch(err){
        res.status(500).json({error:err , success:false , message:'Failed to fetch data from the database'})
    }
};

const DeleteExpense = (req, res) => {
    const ExpId = req.params.expenseid;
    if(isstringValid(ExpId)){
        return res.status(400).json({success: false, })
    }
    Expenses.destroy({where: { id: ExpId }}).then((response) => {
    
        return res.status(200).json({response, success: true, message: "Deleted Successfuly"})
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ success: true, message: "Failed"})
    })
}


module.exports = {
    AddExpenses,
    GetExpense,
    DeleteExpense,
}