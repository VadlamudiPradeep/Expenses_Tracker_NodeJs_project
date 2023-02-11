
async function signup(e){
    try{
        e.preventDefault();

        let name = document.getElementById('name');
        let email = document.getElementById('email');
        let phone = document.getElementById('phone');
        let password = document.getElementById('password');
    
        if(name.length<3 || !isNaN(name) || name==" "){
            alert('Enter valid name');
            return;
        }
        else if(email.length<5 ) {
            alert('Enter valid email');
            return;
        }else if(phone.length <10 || phone == ''){
            alert('Enter valid phone number');
            return;
        }else if(password.length < 4){
            alert('Enter valid password');
            return;
           
        }
    
        let signupDetails ={
            name:e.target.name.value,
            email:e.target.email.value,
            phone:e.target.phone.value,
            password:e.target.password.value
        };
        
     let response  = await axios.post('http://localhost:3000/user/signup', signupDetails)
       if(response.data[1] === false){
        alert('This email address in use please login....')
       }else if(response.status === 201){
        window.location.href = '../Login/login.html';
       }else{
        throw new ErrorEvent('Failed to login')
       }
        
    }
catch(err){
       document.body.innerHTML += `<h3 style="color:black">${err}</h3>`
}

}