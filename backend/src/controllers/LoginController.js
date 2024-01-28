const User = require('../models/User');
const jwt = require('../middlewares/accessTokenMiddleware');
const bcrypt = require('bcrypt');

async function handleLogin(req, res){
    try{
        const user = await User.findOne({
            where: {
                'email': req.body.email,
                'status': 1,
            },
        });
        if(user === null){
            res.status(404).json({message: 'User not found'});
        }else{
            if(await bcrypt.compare(req.body.password, user.dataValues.password)){
                delete user.dataValues.password;
                const token = jwt.sign({ 'id': user.dataValues.id });
                if(token !== 401 && token !== 500){
                    res.status(200).json({'user':user, 'token': token});
                }else{
                    res.status(token).json({message: 'An error occurred while trying to generate the token'});
                }
            }else{
                res.status(401).json({message: 'Your login credentials are incorrect'});
            }
        }    
    }catch(error){
        res.status(500).json({message: 'An error occurred while trying to log in'});
    }
}

module.exports = {handleLogin};
