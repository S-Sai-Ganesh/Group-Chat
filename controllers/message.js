const Chat = require('../models/chat');
const User = require('../models/user');

exports.getMessage = async (req,res,next)=>{
    try{
    const {id} = req.user;
    const lastId = +req.query.lastId || 0;
    console.log(lastId);
    let mesg = await Chat.findAll({offset: lastId,include: [
        {
          model: User,
          attributes: ['id', 'name']
        }
    ]});
    res.status(200).json({mesg});
    } catch(error) {
        console.log(error);
        res.status(500).json({error,success: false});
    }
}

exports.postMessage = async (req,res,next)=>{
    try{
    const {id,name} = req.user;
    const {message} = req.body;

    const mesg = await Chat.create( {message, userId:id});
    res.status(200).json({mesg, name});
    } catch(error) {
        console.log(error);
        res.status(500).json({error,success: false});
    }
}