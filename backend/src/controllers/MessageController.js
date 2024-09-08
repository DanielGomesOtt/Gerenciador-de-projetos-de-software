const Message = require('../models/Message');
const { Op } = require('sequelize');


async function getConversationMessages(req, res){
    try{
        let id_sender = req.headers.id_sender;
        let id_recipient = req.headers.id_recipient;
        let id_user = req.headers.id_user;
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
                    {
                        status: 1
                    },
                    {
                        [Op.and]: [
                            {
                                [Op.or]: [
                                    { sender_delete: { [Op.ne]: id_user } },
                                    { sender_delete: null }
                                ]
                            },
                            {
                                [Op.or]: [
                                    { recipient_delete: { [Op.ne]: id_user } },
                                    { recipient_delete: null }
                                ]
                            }
                        ]
                    }
                ]
            },
            order: [
                ['id', 'ASC']
            ]
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
        const unread_messages = await Message.findAll({
            where: {
                message_read: 0,
                id_recipient: req.headers.id_user,
                status: 1,
                [Op.or]: [
                    { sender_delete: { [Op.ne]: req.headers.id_user } },
                    { sender_delete: null }
                ],
                [Op.or]: [
                    { recipient_delete: { [Op.ne]: req.headers.id_user } },
                    { recipient_delete: null }
                ]  
            }
        });

        if(unread_messages){
            res.send(unread_messages);
        }
    }catch(error){
        res.status(500).json({message: error});
    }
}

async function updateMessageToRead(req, res){
    try{
        req.body.status = 1;
        await Message.update({ message_read: 1 }, {
            where: req.body
        });
        res.status(200).json({ message: 'Success in updating the messages' });
    }catch(error){
        res.status(500).json({ message: error});
    }
}

async function deleteMessage(req, res){
    try{

        if(req.body.type_delete == 'sender'){
            await Message.update({sender_delete: req.body.id_user}, {
                where: {
                    'id': req.body.id_message
                }
            });
        }else{
            await Message.update({recipient_delete: req.body.id_user}, {
                where: {
                    'id': req.body.id_message
                }
            });
        }
        res.status(200).json()
    }catch(error){
        res.status(500).json({ message: error });
    }
}

module.exports = { getConversationMessages, getNumberOfUnreadMessages, updateMessageToRead, deleteMessage };