
require('dotenv').config();
const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Forgotpassword = require('../models/forgotPassword');

const dotenv = require('dotenv');

// get config 
dotenv.config();
const forgotpassword = async (req, res) => {
    try {
        const { email } =  req.body;
        const user = await User.findOne({where : { email }});
        if(user){
            const id = uuid.v4();
            user.createForgotpassword({ id , active: true })
                .catch(err => {
                    throw new Error(err)
                })
                API_KEY_A=process.env.SENGRID_API_KEY

            sgMail.setApiKey(API_KEY_A)

            const msg = {
                to: 'vadlamuidpradeep2000@example.com', // Change to your recipient
                from: 'vanadlamudipradeepchoudhary@example.com', // Change to your verified sender
                subject: 'Sending with SendGrid is Fun',
                text: 'and easy to do anywhere, even with Node.js',
                html: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
              }
              sgMail
                .send(msg)
                .then((response) => {
                    res.status(200).json({message:response , success:true ,message:'mail sent successfully'})
                  console.log('Email sent')
                })
                .catch((error) => {
                  console.log(error)
                })
        }else {
            console.log('eror')
            throw new Error('User does not exist')
        }
    } catch(err){
        console.error(err)
        return res.json({ message: err, success: false });
    }

}

const resetpassword = async(req, res) => {
    try{

    
    const id =  req.params.id;
    Forgotpassword.findOne({ where : { id }}).then(forgotpasswordrequest => {
        if(forgotpasswordrequest){
            forgotpasswordrequest.update({ active: false});
            if(forgotpasswordrequest){
                res.status(200).send('/views/reset.html',{root:__dirname})
            }else{
                res.send(`<h1>"Invalid Link"</h1>`)
            }
        

        }
    })
}catch(err){
    res.status(500).json({error:err});
}
}

const updatepassword = async(req, res, next)=>{
    try{
    var uuid=(req.params.uuid)
    Forgotpassword.findOne({where: {id:uuid, isActive:true}}).then(entry=>{
        if (entry){
            entry.isActive=false
            entry.save()
            User.findOne({where:{email:entry.email}}).then(user=>{
                bcrypt.hash(req.body.password, saltRounds).then((hash)=>{
                    user.password=hash
                    user.save()
                    console.log('Password Updated!')
                }).catch(err=>console.log(err))
            }).catch(err=>console.log(err))
        }else{
            console.log(entry)
        }
    }).catch(err=>console.log(err))
}catch(err){
res.status(500).json({error:err});
}
}


module.exports = {
    forgotpassword,
    updatepassword,
    resetpassword
}