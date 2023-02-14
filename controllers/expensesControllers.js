let Expenses = require('../models/expenses');
let User  = require('../models/user');

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
     await Expenses.create({expenses, description , category , userId:req.user.id}).then((expense)=>{
        let totalExpenses = Number(req.user.totalExpenses)+Number(expenses);
          User.update({totalExpenses:totalExpenses},{where:{id:req.user.id}})
        res.status(200).json({expense:expense , success:true, message:'Expenses is add to data base successfully'});
     })
    }
    catch(err){
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

const DeleteExpense = (req, res) => {
    const ExpId = req.params.expenseid;
    if(isstringValid(ExpId)){
        return res.status(400).json({success: false, })
    }
    Expenses.destroy({where: { id: ExpId , userId:req.user.id }}).then((response) => {
    
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