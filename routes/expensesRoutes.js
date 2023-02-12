let express = require('express');
let router = express.Router();

let expensesControllers = require('../controllers/expensesControllers');

router.post('/addExpenses', expensesControllers.AddExpenses);

router.get('/getExpenses' , expensesControllers.GetExpense);

router.delete('/deleteExpense/:expenseid',  expensesControllers.DeleteExpense)

module.exports = router;