
async function signin(e){
  try{
   e.preventDefault();

   let loginDetails = {
      email:e.target.email.value,
      password:e.target.password.value,
   };

let response = await axios.post('http://localhost:3000/user/signin', loginDetails);
        alert(response.data.message);
        localStorage.setItem('token' , response.data.token);
        if(response.status === 200){
            window.location.href = '../Expense/expense.html';
        }else{
            throw new Error('Login is failed')
        }
  }
  catch(err){
    document.body.innerHTML += `<div style="color:black">${err.message}<div>`;
  }
};

function forgotpassword(){
    window.location.href = '../ForgotPassword/forgotPassword.html';
}