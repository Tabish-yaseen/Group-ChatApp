const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// require('dotenv').config()

const sequelize=require('./utils/database')

// routes imported
const userRoute=require('./Routes/user')




const app = express();

app.use(bodyParser.json());

app.use(cors({
    origin:'*'
}));

app.use('/user',userRoute)


sequelize.sync({ force:false}).then(() => {
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
});
