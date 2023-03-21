const Chat = require('../models/chat');
const User = require('../models/user');
const Group = require('../models/group');
const Groupmembers = require('../models/gmember');
const jwt = require('jsonwebtoken');

exports.getMessage = async (req,res,next)=>{
    try{
    const {id} = req.user;
    const lastId = +req.query.lastId || 0;
    const gId = +req.query.gId;
    // console.log(gId);
    let mesg = await Chat.findAll({offset: lastId,include: [
        {
          model: User,
          attributes: ['id', 'name']
        }
    ], where: {
       groupId: gId
    }});
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
    const gId = req.query.gId;
console.log('postmsg',gId);
    const mesg = await Chat.create( {message, userId:id, groupId:gId});
    res.status(200).json({mesg, name});
    } catch(error) {
        console.log(error);
        res.status(500).json({error,success: false});
    }
}

exports.postGroup = async (req,res,next)=>{
    try{
        const { gName } = req.body;
        const { id } = req.user;

        const newGroup = await Group.create({gName,userId:id});
        const nGId =  newGroup.dataValues.id;
        const groupmem = await Groupmembers.create({userId:id, groupId:nGId});
        res.status(200).json({newGroup,groupmem,success:true});
    }catch(error){
        console.log(error);
        res.status(500).json({error,success:false});
    }
}

exports.getAllG = async(req,res,next) => {
    try {
        const reqId = req.user.id;
        let allGroup = await Groupmembers.findAll({
            include: [{
                model: Group,
                attributes: ['gName']
            }]
            ,where: {
                userId: reqId
            }
        });
        res.status(200).json({allGroup});
    } catch (error) {
        console.log(error);
        res.status(500).json({error,success:false});
    }
}

function generateAccessToken(id){
    return jwt.sign({id},process.env.TOKEN_SECRET);
}

exports.getInvite = async(req,res,next) => {
    const gId = req.query.gId;
    console.log(gId);
    res.status(200).json({
        secretToken: generateAccessToken(gId)
    });
}

exports.getJoinGroup = async(req,res,next) => {
    const gId = req.query.gId;
    //Complete Code Here
    const uId = req.user.id;
    const groupmem = await Groupmembers.create({userId:uId, groupId:gId});
    res.status(200).json({groupmem,success:true});
}