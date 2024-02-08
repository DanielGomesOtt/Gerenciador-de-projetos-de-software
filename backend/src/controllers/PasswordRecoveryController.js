const User = require('../models/User');
const resetCode = require('../utils/resetCode');
const ResetCode = require('../models/ResetCode');

async function sendResetCode(req, res){
    try{
        let email = req.headers.email
        const user = User.findOne({
            where: {
                'email': email,
                'status': 1,
            }
        })

        if(user){
            let code = resetCode.getResetCode();
        }

    }catch(error){
        res.status(500).json({message: 'An error occurred while trying to send a reset code'});
    }
}


async function updateStatusResetCode() {
  try {
    const codes = await ResetCode.findAll({
      where: {
        status: 1
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