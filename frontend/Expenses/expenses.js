

async function saveToDB(e){
    try{ 
        e.preventDefault();

        let expensesDetails = {
            expenses : e.target.amount.value,
            description:e.target.description.value,
            category:e.target.category.value,
        } 
if(expensesDetails.expenses ==='' || expensesDetails.expenses.length < 4){
    alert('Enter a valid number');
    return;
}else if(expensesDetails.description === '' || expensesDetails.category === ''){
    alert('Enter a valid desc or cate');
    return;
}
let response = await axios.post('http://localhost:3000/expenses/addExpenses', expensesDetails)
          alert(response.data.message);
         showUserOnScreen(response.data.expense)
    }
    catch(err){
        console.log(err)
    showError();
    }
}

// function to get expenses from database

window.addEventListener('DOMContentLoaded', async () => {
    try{
       let response = await axios.get('http://localhost:3000/expenses/getExpenses')
            response.data.expenses.forEach(expense => {
                showUserOnScreen(expense);
            })
    
    } catch(err){
        showError(err);
    }
})


//show  user on screen 
async function showUserOnScreen(expense) {
    try{
    
    // const parentElement = document.getElementById('expenseTracker');
    const parentElement = document.getElementById('list');
    const expenseElemId = `expense-${expense.id}`;
    parentElement.innerHTML += `
        <li id=${expenseElemId}>
            ${expense.expenses} - ${expense.category} - ${expense.description}
            <button style='color:red' onclick='deleteExpense(event, ${expense.id})'>
                Delete Expense
            </button>
        </li>`
    } catch(err){
         console.log(err)
        showError(err);
    }
}

// Delete Function
// Delete Expense
function deleteExpense(e, expenseid) {
    try{
        const token = localStorage.getItem('token');
    

    axios.delete(`http://localhost:3000/expenses/deleteExpense/${expenseid}`).then((response) => {
        removeExpensefromUI(expenseid)
        alert(response.data.message)
    })
    } catch(err) {
        // console.log(err)
        showError(err);
    }
}

// Remove from UI
function removeExpensefromUI(expenseid){
    const expenseElemId = `expense-${expenseid}`;
    document.getElementById(expenseElemId).remove();
}

function showError(err){
    document.body.innerHTML += `<h1 style='color:black'>${err}</h1>`
}