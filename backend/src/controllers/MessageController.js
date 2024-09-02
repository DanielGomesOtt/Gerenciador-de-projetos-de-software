const Message = require('../models/Message');
const { Op } = require('sequelize');


async function getConversationMessages(req, res){
    try{
        let id_sender = req.headers.id_sender;
        let id_recipient = req.headers.id_recipient;
        const messages = await Message.findAll({
            where: {
                [Op.and]: [
                    {
                        [Op.or]: [
                            { id_sender: id_sender },
                            { id_sender: id_recipient }
                        ]
                    },
                    {
                        [Op.or]: [
                            { id_recipient: id_recipient },
                            { id_recipient: id_sender }
                        ]
                    },
                    {status: 1}
                ]
            }
        });
        
        if(messages){
            res.send(messages);
        }else{
            res.send([]);
        }
    }catch(error){
        console.log(error);
        res.status(500).json({ message: error });
    }
}

async function getNumberOfUnreadMessages(req, res){
    try{
        const unread_messages = await Message.count({
            where: {
                message_read: false,
                id_recipient: req.headers.id_user,
                status: 1
            }
        });

        if(unread_messages){
            res.send([unread_messages]);
        }
    }catch(error){
        res.status(500).json({message: error});
    }
}

module.exports = { getConversationMessages, getNumberOfUnreadMessages };