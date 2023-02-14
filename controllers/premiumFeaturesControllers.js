let User  = require('../models/user');
let Expense = require('../models/expenses');
const sequelize = require('../util/database');

let GetUserLeaderBoard =  async (req, res) => {
    try{
       
        const expenses = await User.findAll({
            //attributes => ite the data we passing 
            // sequelize.fn => ist is  a sequelize  function finding the sum and  sequelize.col where we find the expenses table and getting all expenses 
            //and adding on by one expenses in the column

            attributes: ['id', 'name',[sequelize.fn('sum', sequelize.col('expenses.expenses')), 'total_cost'] ],
            include: [ // includes => it includes the model has the expenses table  and include is an array
                {
                    model: Expense,
                    attributes: []
                }
            ],
            group:['user.id'], // and iam group with in the expenses table with id and 
            order:[['total_cost', 'DESC']] // sorting the order as total cost with DESC=> descending order

        });
    return res.status(200).json(expenses)
} catch (err){
    console.log(err)
    res.status(500).json(err)
}
}


module.exports = {
    GetUserLeaderBoard
}