const User = require('../models/User');
const jwt = require('../middlewares/accessTokenMiddleware');

async function setUser(req, res) {
    try {
        const [user, created] = await User.findOrCreate({
            where: { email: req.body.email },
            defaults: req.body
        });

        if (created) {
            const token = jwt.sign({'id': user.dataValues.id});
            if(token !== 401 && token !== 500){
                delete user.dataValues.password;
                res.status(201).json({ 'user': user, 'token': token});
            }
        } else {
            res.status(200).json({ message: 'User already exists' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = {setUser};