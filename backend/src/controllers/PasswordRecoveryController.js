const User = require('../models/User');
const resetCode = require('../utils/resetCode');
const ResetCode = require('../models/ResetCode');
const Email = require('../utils/email');
const Password = require('../utils/hashPassword');
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
          
      }else{
        res.status(404).json({message: 'User not found.'});
      }

  }catch(error){
      res.status(500).json({message: 'An error occurred while trying to send a reset code'});
  }
}

async function verifyResetCode(req, res){
  try{
    const code = await ResetCode.findOne({
      where: {
        'code': req.body.reset_code,
        'status': 1,
      }
    })
    if(code && code.dataValues){
        const disableCode = await ResetCode.update({'status': 0}, {
          where: {
            'code': req.body.reset_code
          }
        })
        if(disableCode){
          res.status(200).json({ data: code.dataValues });
        }
    }else{
      res.status(404).json({ message: 'A code was not found; it may be incorrect or expired' });
    } 
  }catch(error){
    res.status(500).json({ message: 'An error occurred while verifying the reset code' });
  }
}

async function updateUserPassword(req, res){
  try{
    let email = req.body.email;
    let password = Password.hashPassword(req.body.password);
    const user = await User.update({'password': password}, {
      where: {
        'email': email
      }
    });
    if(user){
      res.status(200).json({message: 'success'});
    }
  }catch(error){
    res.status(500).json({message: 'An error occurred while trying to update the password.'});
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



module.exports = { sendResetCode, verifyResetCode, updateUserPassword };