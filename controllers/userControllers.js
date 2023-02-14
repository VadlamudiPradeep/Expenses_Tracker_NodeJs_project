let User = require('../models/user');
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
//let md5 = require('md5');


function isstringValid(string){
    if(string == undefined || string.length === 0){
        return true;
    }else{
        return false;
    }
}

function GenerateAccessToken(id, name ,ispremiumuser){
    return jwt.sign({userId : id , name:name ,ispremiumuser:ispremiumuser}, 'secretkey')
}
let signup =async (req ,res)=>{
    try{

    let {name , email , phone , password} = req.body ;
       console.log('name:' + name , 'email :' +email , 'phone :' +phone , 'password :' +password);
    if(isstringValid(name) || isstringValid(email) || isstringValid(phone) || isstringValid(password)){
        
        res.status(400).json({err : 'something is missing' , success: false})
    }
    var salt = await bcrypt.genSalt(10); 

bcrypt.hash(password , salt ,async(err,hash)=>{
         User.create({name , email , phone , password:hash })
    
        res.status(201).json({success : true ,message:'successfully create new User'});

    })

}
catch(err){
        res.status(500).json({error: err, success: false})
    }
};

let signIn = async(req ,res)=>{
    try{
        const { email, password } = req.body;
        if(isstringValid(email) || isstringValid(password)){
            return res.status(400).json({message: 'EMail id or password is missing ', success: false})
        }
        console.log(password);
        const user  = await User.findAll({ where : { email }})
      
            if(user.length > 0){
               bcrypt.compare(password, user[0].password, (err, result) => {
               if(err){
                throw new Error('Something went wrong')
               }
                if(result === true){
                    return res.status(200).json({success: true, message: "User logged in successfully",token :GenerateAccessToken(user[0].id, user[0].name,user[0].ispremiumuser)})
                }
                else{
                return res.status(401).json({success: false, message: 'Password is incorrect'})
               }
            })
            } else {
                return res.status(404).json({success: false, message: 'User Does not exist'})
            }
        }catch(err){
            res.status(500).json({message: err, success: false})
        }
}



module.exports = {
    signup,
    signIn,
    GenerateAccessToken,
}