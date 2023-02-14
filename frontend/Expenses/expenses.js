
let token = localStorage.getItem('token');
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
let response = await axios.post('http://localhost:3000/expenses/addExpenses', expensesDetails ,{headers:{Authorization:token}})
          alert(response.data.message);
         showUserOnScreen(response.data.expense)
    }
    catch(err){
        console.log(err)
    showError();
    }
}

//decode  jwt token in frontend
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

// function to get expenses from database

window.addEventListener('DOMContentLoaded', async () => {
    try{
       
        let decodedToken = parseJwt(token);
        console.log(decodedToken);

        let ispremiumuser = decodedToken.ispremiumuser ;
        if(ispremiumuser){
            showPremiumMessage();
              //leaderboard();
        }

        
      
       let response = await axios.get('http://localhost:3000/expenses/getExpenses',{headers:{Authorization:token}} )
            response.data.expenses.forEach(expense => {
                showUserOnScreen(expense);
            })
    
    } catch(err){
        showError(err);
    }
})

function showPremiumMessage(){
    document.getElementById('premium').style.visibility = "hidden"
    document.getElementById('message').innerHTML = "You are a premium user ";
    document.getElementById('message').style.color = 'red'
}

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
    

    axios.delete(`http://localhost:3000/expenses/deleteExpense/${expenseid}` ,{headers:{Authorization:token}}).then((response) => {
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

// buy premium by razor pay 

document.getElementById('premium').onclick = async function (e) {
    const token = localStorage.getItem('token')
    const response  = await axios.get('http://localhost:3000/purchase/premiumMembership', { headers: {"Authorization" : token} });
    console.log(response);
    var options =
    {
     "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
     "order_id": response.data.order.id,// For one time payment
     // This handler function will handle the success payment
     "handler": async function (response) {
        const res = await axios.post('http://localhost:3000/purchase/updatetransactionstatus',{
             order_id: options.order_id,
             payment_id: response.razorpay_payment_id,
         }, { headers: {"Authorization" : token} })
        
        console.log(res)
         alert('You are a Premium User Now')
         showPremiumMessage();
         localStorage.setItem('token', res.data.token);
         localStorage.setItem('ispremiumuser',true)
         leaderboard();
        },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on('payment.failed', function (response){
    console.log(response)
    alert('Something went wrong')
 });
}


async function leaderboard(){
    let inputElement = document.createElement('input');
    inputElement.type = 'button';
    inputElement.value = 'show leaderboard';
    inputElement.onclick = async()=>{
        let userLeaderBoard = await axios.get('http://localhost:3000/premium/leaderboard',
        {headers:{'Authorization':token}});
        let leaderboard = document.getElementById('Leaderboard');
        leaderboard.innerHTML += '<h1>Leader Board</h1>';
        userLeaderBoard.data.forEach((userDetails)=>{
            leaderboard.innerHTML += `<li>Name-${userDetails.id}-${userDetails.name} Total cost-${userDetails.total_cost || 0}</li>`
        });
    }
    document.getElementById('message').appendChild(inputElement)
}


function showError(err){
    document.body.innerHTML += `<h1 style='color:black'>${err}</h1>`
};

