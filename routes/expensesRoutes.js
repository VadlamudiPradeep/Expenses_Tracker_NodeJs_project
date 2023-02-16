let express = require('express');
let router = express.Router();

let expensesControllers = require('../controllers/expensesControllers');

let middleware = require('../middleware/auth');

router.post('/addExpenses',middleware.authenticate, expensesControllers.AddExpenses);

router.get('/getExpenses' ,middleware.authenticate, expensesControllers.GetExpense);

router.delete('/deleteExpense/:expenseid',middleware.authenticate,  expensesControllers.DeleteExpense)

router.get('/download', middleware.authenticate,expensesControllers.downloadExpenses);

router.get('/Pagination/:pageNo', middleware.authenticate,expensesControllers.pagination)

module.exports = router;