const User = require('../models/User');
const resetCode = require('../utils/resetCode');
const ResetCode = require('../models/ResetCode');
const Email = require('../utils/email');
const { Op } = require('sequelize');

async function sendResetCode(req, res){
    try{
        let email = req.headers.email
        const user = await User.findOne({
            where: {
                'email': email,
                'status': 1,
            }
        })
        
        if(user && user.dataValues){
            let code = resetCode.getResetCode();
            const codeId = await ResetCode.create({ 'code': code, 'status': 1, 'id_user': user.dataValues.id });
            if(codeId.id){
              Email.sendEmail(email, code);
              res.send(code);
            }else{
              res.status(500).json({message: 'Code cannot be generated, please try again later.'});
            }
            
        }

    }catch(error){
        res.status(500).json({message: 'An error occurred while trying to send a reset code'});
    }
}


async function updateStatusResetCode() {
  try {
    let dateTime = new Date();
    dateTime = dateTime.setMinutes(dateTime.getMinutes() - 10);

    const codes = await ResetCode.findAll({
      where: {
        status: 1,
        createdAt: {
          [Op.lte]: dateTime
        },
      }
    });

    for (const code of codes) {
      await code.update({ status: 0 });
    }
  } catch (error) {
    console.error('Error trying to deactivate reset code:', error);
  }
}


setInterval(updateStatusResetCode, 10 * 60 * 1000);



module.exports = { sendResetCode };