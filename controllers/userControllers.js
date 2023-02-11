let User = require('../models/user');

function isstringValid(string){
    if(string == undefined || string.length === 0){
        return true;
    }else{
        return false;
    }
}

let signup = (req ,res)=>{
    let {name , email , phone , password} = req.body ;
       console.log('name:' + name , 'email :' +email , 'phone :' +phone , 'password :' +password);
    if(isstringValid(name) || isstringValid(email) || isstringValid(phone) || isstringValid(password)){
        return res.status(400).json({err : 'something is missing' , success: false})
    }
    User.create({name , email , phone , password})
    .then((response)=>{
        res.status(201).json({success : true ,message:'successfully create new User'});
    })
    .catch(err =>{
        res.status(500).json({error: err, success: false})
    })
};

module.exports = {
    signup,
}