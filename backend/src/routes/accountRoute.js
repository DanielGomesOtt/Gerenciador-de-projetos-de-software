const express = require('express');
const route = express.Router();
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const AccountController = require('../controllers/AccountController');
const accessTokenMiddleware = require('../middlewares/accessTokenMiddleware');

function deleteAvatar(filePath, cb) {
  const directory = path.dirname(filePath);
  const baseName = path.basename(filePath, path.extname(filePath));

  fs.readdir(directory, (err, files) => {
      if (err) {
          cb(err);
          return;
      }

      files.forEach((file) => {
          const name = path.basename(file, path.extname(file));
          if (name === baseName && file !== path.basename(filePath)) {
              fs.unlink(path.join(directory, file), (err) => {
                  if (err) {
                      console.error(err);
                  }
              });
          }
      });

      cb(null);
  });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const fileName = 'avatar_user_' + req.body.id;
    const filePath = path.join('uploads', fileName);

    deleteAvatar(filePath, (err) => {
        if (err) {
            cb(err);
        } else {
            cb(null, fileName + '.' + file.mimetype.split('/')[1]);
        }
    });
    req.body.avatar_directory = filePath + '.' + file.mimetype.split('/')[1];
  }
});

const upload = multer({ storage: storage });

route.get('/account', accessTokenMiddleware.verifyToken, AccountController.getUserData);

route.patch('/account', accessTokenMiddleware.verifyToken, AccountController.updateUserData);

route.patch('/account/disable_account', accessTokenMiddleware.verifyToken, AccountController.disableAccount);

route.post('/account/upload_avatar', upload.single('avatar_path'), AccountController.setAvatarPath);

route.get('/account/upload_avatar', AccountController.getAvatarPath);

module.exports =  route;