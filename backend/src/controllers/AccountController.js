const User = require('../models/User');


async function getUserData(req, res){
    try{
        let user = JSON.parse(req.headers.user);
        const userData = await User.findOne({
            attributes: ['name', 'email'],
            where: {
                'id': user.id
            }
        });
        if(userData){
            res.status(200).send(userData);
        }
    }catch(error){
        res.status(500).json({message: error})
    }
}

module.exports = { getUserData };