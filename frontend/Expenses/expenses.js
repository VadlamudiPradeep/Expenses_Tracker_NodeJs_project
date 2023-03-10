var token = localStorage.getItem('token');
async function saveToDB(e) {
    try{
        e.preventDefault();
        console.log(e.target.description.value);

        const addExpense = {
            expenses: e.target.amount.value,
            description: e.target.description.value,
            category: e.target.category.value
        }
        console.log(addExpense);

    
        await axios.post('http://localhost:3000/expenses/addExpenses', addExpense , {headers:{'Authorization': token}} ).then(response => {
                alert(response.data.message)
                addNewExpensetoUI(response.data.expense);
              
        })
        
    } catch(err) {
        document.body.innerHTML += `<div style="color:red;">${err} </div>`
    }
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}



// // // DOMContentLoaded
window.addEventListener('DOMContentLoaded',  () => {
    // const token  = localStorage.getItem('token')
    const decodeToken = parseJwt(token)
    console.log(decodeToken)
    const ispremiumuser = decodeToken.ispremiumuser
    if(ispremiumuser){
        showPremiumuserMessage()
        showLeaderboard();
    }

    axios.get('http://localhost:3000/expenses/getExpenses',{headers:{'Authorization': token}}).then(response => {
    
   response.data.expenses.forEach(expense=>{
   addNewExpensetoUI(expense);
   displayList();
   changePages();
   });
   })
   .catch(err=>{
    showError(err);
  } );

})

// // Show Expense to DOM / UI
function addNewExpensetoUI(expense) {
    try{
    // After submit clear input field
    document.getElementById("amount").value = '';
    document.getElementById("description").value = '';
    document.getElementById("category").value = '';

    // const parentElement = document.getElementById('expenseTracker');
    const parentElement = document.getElementById('list');
    const expenseElemId = `expense-${expense.id}`;
    parentElement.innerHTML += `
        <li id=${expenseElemId}>
            ${expense.expenses} - ${expense.category} - ${expense.description}
            <button onclick='deleteExpense(event, ${expense.id})'>
                Delete Expense
            </button>
        </li>`
    } catch(err){
        // console.log(err)
        showError(err);
    }
}

// Delete Expense
function deleteExpense(e, expenseid) {
    try{
    axios.delete(`http://localhost:3000/expenses/deleteExpense/${expenseid}`,{headers:{'Authorization': token}}).then((response) => {
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

document.getElementById('premium1').onclick = async function (e) {

    const response  = await axios.get('http://localhost:3000/purchase/premiumMembership', { headers: {"Authorization" : token} });
    console.log(response);
    var options =
    {
     "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
     "order_id": response.data.order.id,// For one time payment
     // This handler function will handle the success payment
     "prefill": {
        "name": "pradeep naidu",
        "email": "vadlamudipradeep2000@gmail.com",
        "contact": "0000000"
      },
     "theme":{
        "color":"#3399c",
     },
     
     "handler": async function (response) {
        const res = await axios.post('http://localhost:3000/purchase/updatetransactionstatus',{
             order_id: options.order_id,
             payment_id: response.razorpay_payment_id,
             
         }, { headers: {"Authorization" : token} })
        
        console.log(res)
         alert('You are a Premium User Now')
         document.getElementById('premium1').style.visibility = "hidden"
         document.getElementById('message').innerHTML = "You are a premium user "
         localStorage.setItem('token', res.data.token)
         showLeaderboard();
         download();
     },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on('payment.failed', function (response){
    console.log(response)
    alert(response.error.code);
  alert(response.error.description);
  alert(response.error.source);
  alert(response.error.step);
  alert(response.error.reason);
  alert(response.error.metadata.order_id);
  alert(response.error.metadata.payment_id);
 });
}
// Show Error
function showError(err){
    document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
};  
//Show prime user
function showPremiumuserMessage() {
    document.getElementById('premium1').style.visibility = "hidden"
    document.getElementById('message').innerHTML = "You are a premium user "
}


///leaderBoard 

function showLeaderboard(){
    const inputElement = document.createElement("input")
    inputElement.type = "button"
    inputElement.value = 'Show Leaderboard';



    inputElement.onclick = async() => {
     
        const userLeaderBoardArray = await axios.get('http://localhost:3000/premium/showLeaderBoard', { headers: {"Authorization" : token} })
        console.log(userLeaderBoardArray)
    

        var leaderboardElem = document.getElementById('leaderboard')
        leaderboardElem.innerHTML += '<h1> Leader Board </<h1>'
        let table = document.createElement('table');
        let tr = document.createElement('tr');
      
        let Description = document.createElement('th');
       
      
        Description.innerHTML = 'Description';
        Description.style.color = 'red';
        Description.style.fontStyle =  'italic'   ;
        Description.style.padding = "0.1rem";
        Description.style.margin = "0.1rem";
        Description.style.width = "10%";

        let Category = document.createElement('th');
        Category.innerHTML = 'Category';
        Category.style.color = 'red'
        Category.style.fontStyle =  'italic'   ;
        Category.style.padding = "0.1rem";
        Category.style.margin = "0.1rem";
        

        let Expenses = document.createElement('th');
        Expenses.innerHTML ='Expenses';
        Expenses.style.color = 'red';
        Expenses.style.fontStyle =  'italic'   ;
        Expenses.style.padding = "0.1rem";
        Expenses.style.margin = "0.1rem"

        
       
        tr.appendChild(Description);
      
        tr.appendChild(Category)
        
        tr.appendChild(Expenses);
    
        table.appendChild(tr);
        
        leaderboardElem.appendChild(table)
        
        userLeaderBoardArray.data.forEach((userDetails) => {
            
            leaderboardElem.innerHTML += `<li>Name - ${userDetails.id} -  ${userDetails.name} Total Expense - ${userDetails.total_cost || 0} </li>`;
            
        })
    }
    document.getElementById("message").appendChild(inputElement);
   

};
function download(){
     let token = localStorage.getItem('token');
    axios.get('http://localhost:3000/expenses/download',{headers:{'Authorization':token}}).then(response=>{
        const href = URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', 'expense.txt'); //or any other extension
        document.body.appendChild(link);
        link.click();
        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
        console.log(response)
    }).catch(err=>console.log(err))
};



// window.addEventListener('DOMContentLoaded', ()=>{
//     displayList()
// })

// Dynamic Pagination
function displayList(e) {
    let pageNo;
    try{
        pageNo=e.target.id
    }
    catch(err){
        pageNo=1
    }
    let listGroup=document.getElementById('list')
    listGroup.innerHTML=""
    let getRequest=async()=>await axios({
        method: 'get',
        url: `http://localhost:3000/expenses/Pagination/${pageNo}`,
        headers: {"Authorization" : token }
    }).then(res=>{
        console.log(res)
        if (res.data.response==0 || !res.data.response){
            // document.querySelector('h3').style.visibility="hidden"
            return
        }
        else{
            res.data.response.map((expenseDetails)=>{
            let listItem=document.createElement('li')
            let span=document.createElement('span')
            let amountItem=document.createTextNode(`???${(expenseDetails.expenses)}`)
            let descItem=document.createTextNode(`${expenseDetails.description}`)
            let catgItem=document.createTextNode(`${expenseDetails.category}`)
            let delBtn=document.createElement('button')
            delBtn.className="delete-btn"
            delBtn.onclick=`deleteExpense(event, ${expenseDetails.id})`
            listItem.append(delBtn)
            listItem.append(amountItem)
            span.appendChild(descItem)
            listItem.append(span)
            listItem.append(catgItem)
            listGroup.appendChild(listItem)
        })
        var buttonList=document.querySelector('.pages-container')
        buttonList.innerHTML=""
        
        if(res.data.lastPage===2){
            if(res.data.hasPreviousPage){
                let button=document.createElement('button')
                button.innerHTML=res.data.previousPage
                button.id=res.data.previousPage
                buttonList.appendChild(button)
            }
            let button=document.createElement('button')
            button.innerHTML=res.data.currentPage
            button.id=res.data.currentPage
            buttonList.appendChild(button)
            if(res.data.hasNextPage){
                let button=document.createElement('button')
                button.innerHTML=res.data.nextPage
                button.id=res.data.nextPage
                buttonList.appendChild(button)
            }
        }
        else if(res.data.lastPage>2){
            if(res.data.hasPreviousPage){
                let button=document.createElement('button')
                button.innerHTML=res.data.previousPage
                button.id=res.data.previousPage
                buttonList.appendChild(button)
            }
            let button=document.createElement('button')
            button.innerHTML=res.data.currentPage
            button.id=res.data.currentPage
            buttonList.appendChild(button)
            if(res.data.hasNextPage){
                let button=document.createElement('button')
                button.innerHTML=res.data.nextPage
                button.id=res.data.nextPage
                buttonList.appendChild(button)
            }
            if(res.data.currentPage!=res.data.lastPage && res.data.nextPage!=res.data.lastPage){
                let button=document.createElement('button')
                button.innerHTML=res.data.lastPage
                button.id=res.data.lastPage
                buttonList.appendChild(button)
            }
        }
        buttonList.addEventListener('click', displayList)
        }
    }).catch(err=>console.log(err))
    getRequest()
}

// Records per page
function changePages(){
    let rows = document.getElementById('rows')
    const val=parseInt(rows.value)
    axios.get(`http://localhost:3000/expenses/pages/${val}`,{headers:{'Authorization':token}} ).then(response=>{
        displayList()
    }).catch(err=>console.log(err))
}
