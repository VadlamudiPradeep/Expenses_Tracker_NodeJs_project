let express = require('express');
let app = express();

let bodyParser = require('body-parser');

let cors = require('cors');
app.use(cors());

// app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

//routes
let userRoutes = require('./routes/userRoutes');



app.use('/user', userRoutes);

let sequelize = require('./util/database');

sequelize.sync()
.then(response =>{
    app.listen(3000,()=>{
        console.log('Port is  running on 3000')
    });
})
.catch(err=>{
    console.log(err);
})