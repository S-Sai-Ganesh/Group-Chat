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
        const groupmem = await Groupmembers.create({userId:id, groupId:nGId, isAdmin:true});
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
    const groupmem = await Groupmembers.create({userId:uId, groupId:gId,isAdmin:false});
    res.status(200).json({groupmem,success:true});
}

exports.getAddUser = async (req,res,next) => {
    try{
        const by = req.query.by;
        const value = req.query.value;
        const gId = req.query.gId;
        const {id} = req.user;
        const isAdm = await Groupmembers.findOne({where:{userId:id},attributes:['isAdmin']});
        if(!isAdm.dataValues.isAdmin){
            return res.status(401).json({success:false,error:'Is not admin'});
        } 
        console.log(by,value);
        let userDetails = null;
        if(by=='name'){
            userDetails = await User.findOne({where:{name:value},attributes:['id']});
        } else if(by=='number'){
            userDetails = await User.findOne({where:{number:value},attributes:['id']});
        } else if(by=='email'){
            userDetails = await User.findOne({where:{email:value},attributes:['id']});
        }

        const uId = userDetails.dataValues.id;
        const groupmem = await Groupmembers.create({userId:uId, groupId:gId,isAdmin:false});
        res.status(201).json({groupmem,success:true});
    }catch(error){
        console.error(error);
        res.status(500).json({error:error,success:false});
    }
}

exports.getAllU = async (req,res,next)=> {
    try{
        const gId = req.query.gId;
        const allUsers = await Groupmembers.findAll({
            include: [{
                model: User,
                attributes: ['name']
            }],
            where: {groupId:gId},
            attributes: ['userId','isAdmin']
        });
        res.status(200).json({allUsers,success:true});
    }catch(error){
        console.log(error);
        res.status(500).json({success:false,error});
    }
}

exports.getRemU = async(req,res,next)=>{
    try{
        const uId = req.query.id;
        const gId = req.query.gId;

        const remU = await Groupmembers.destroy({
            where:{groupId:gId,userId:uId}
        });
        res.status(200).json({removed:remU,success:true});
    }catch(error){
        console.log(error);
        res.status(500).json({error,success:false});
    }
}

exports.getMakeA = async(req,res,next)=>{
    try{
        const uId = req.query.id;
        const gId = req.query.gId;

        const isAdmi = await Groupmembers.update({isAdmin:true},{
            where:{groupId:gId,userId:uId}
        })
        res.status(200).json({admin:isAdmi,success:true});
    }catch(error){
        console.log(error);
        res.status(500).json({error,success:false});
    }
}