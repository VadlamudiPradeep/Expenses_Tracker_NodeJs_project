let User = require('../models/user');

function isstringValid(string){
    if(string == undefined || string.length === 0){
        return true;
    }else{
        return false;
    }
}

let signup =async (req ,res)=>{
    try{
    let {name , email , phone , password} = req.body ;
       console.log('name:' + name , 'email :' +email , 'phone :' +phone , 'password :' +password);
    if(isstringValid(name) || isstringValid(email) || isstringValid(phone) || isstringValid(password)){
        return res.status(400).json({err : 'something is missing' , success: false})
    }
    User.create({name , email , phone , password})
    .then((response)=>{
        res.status(201).json({success : true ,message:'successfully create new User'});
    })
}
catch(err){
        res.status(500).json({error: err, success: false})
    }
};

let signIn = async(req ,res)=>{
    try{
    let {email , password} = req.body;
    console.log('email' + email , 'password :' +password)
   if(isstringValid(email) || isstringValid(password)){
    return res.status(400).json({message:'Email or Password is wrong or missing' , success:false});
   }
   let userResponse = await User.findAll({where : {email , password}})
      if(userResponse.length > 0){
        if(userResponse[0].password === password){
            res.status(200).json({success: true , message:'user sing In is successfully'});
        }else{
            return res.status(401).json({success  : false , message:'Password is  incorrect'});
        }
      }else{
        return res.status(404).json({success : false , message:'User not exists '})
      }
}catch(err){
    res.status(500).json({success:false , message:err})
}
}

module.exports = {
    signup,
    signIn,
}