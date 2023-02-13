let express = require('express');
let router = express.Router();

let expensesControllers = require('../controllers/expensesControllers');

let middleware = require('../middleware/auth');

router.post('/addExpenses',middleware.authenticate, expensesControllers.AddExpenses);

router.get('/getExpenses' ,middleware.authenticate, expensesControllers.GetExpense);

router.delete('/deleteExpense/:expenseid',middleware.authenticate,  expensesControllers.DeleteExpense)

module.exports = router;