const inputSend = document.getElementById('input-send');
const token = localStorage.getItem('token');
const sendMsg = document.getElementById('send-msg');
const messagesUl = document.getElementById('messages-list');
const box11 = document.getElementById('box11');
let totalMsg = null;
let activeGroup = null;
let setIntId = null;
const inviteBtn = document.getElementById('invite-btn');

inputSend.addEventListener('submit',(e)=>{
    e.preventDefault();

    let inputSendObj = { message: sendMsg.value }

    axios.post(`http://localhost:4000/message?gId=${activeGroup}`,inputSendObj, { headers: {'Authorization': token}} )
    .then((response) => {
        sendMsg.value = '';
    }).catch((err) => {
        console.log(err);
    });

});

function addNewLineElement(data,nameParam,idParam) {
    const li = document.createElement('h4');
    const loginId = localStorage.getItem('userId');
    if(idParam==loginId){
        li.className = 'msg-right';
    } else {
        li.className = 'msg-left';
    }

    li.appendChild(
        document.createTextNode( nameParam + ': ' + data.message + ' ')
    );
    messagesUl.appendChild(li);
}

async function getAllMsg(){
    try{
        const allM = await axios.get(`http://localhost:4000/message?lastId=${totalMsg}&gId=${activeGroup}`, { headers: {'Authorization': token}} );
        const arr = allM.data.mesg;
        if(arr.length>0){
            totalMsg = totalMsg + arr.length;
            arr.forEach(element => {
                addNewLineElement(element, element.user.name, element.userId);
            });
        }
    }catch(err){
        console.log(err);
    }
}

window.addEventListener('DOMContentLoaded', async()=>{
    try{
        const allG = await axios.get('http://localhost:4000/message/allGroup', { headers: {'Authorization': token}} );
        const arrG = allG.data.allGroup;
        const allGDiv = document.getElementById('all-groups');
        arrG.forEach(ele=>{
            console.log(ele);
            const li = document.createElement('input');
            li.type = 'button';
            li.value = `${ele.group.gName}`;
            li.addEventListener('click',async()=>{
                activeGroup = ele.id;
                box11.removeAttribute('hidden');
                inviteBtn.removeAttribute('hidden');
                messagesUl.innerHTML='';
                clearInterval(setIntId);
                const allM = await axios.get(`http://localhost:4000/message?gId=${ele.id}`, { headers: {'Authorization': token}} );
                const arr = allM.data.mesg;
                totalMsg = arr.length;
                arr.forEach(element => {
                    addNewLineElement(element, element.user.name, element.userId);
                });
                setIntId = setInterval(getAllMsg, 2000);
            })
            allGDiv.appendChild(li);
        })

        // const allM = await axios.get(`http://localhost:4000/message`, { headers: {'Authorization': token}} );
        // const arr = allM.data.mesg;
        // totalMsg = arr.length;
        // arr.forEach(element => {
        //     addNewLineElement(element, element.user.name, element.userId);
        // });
        // setInterval(getAllMsg, 2000);
    }catch(err){
        console.log(err);
    }
});

const cGroupBtn = document.getElementById('create-group-btn');
const cGroupForm = document.getElementById('create-Group-Form');
const cGroupDiv = document.getElementById('create-Group-Div');
cGroupBtn.onclick = function(){
    cGroupDiv.removeAttribute('hidden');

}

cGroupForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const gName = document.getElementById('new-Group-Name');
    console.log(typeof gName);
    let gNameObj = { gName:gName.value };

    axios.post('http://localhost:4000/message/createGroup', gNameObj, { headers: {'Authorization': token}})
    .then((response) => {
        console.log(response);
        window.location.reload();
    }).catch((err) => {
        console.error(err);
    });
});

inviteBtn.addEventListener('click', async()=>{
    const inputInvite = document.getElementById('invite-link')
    inputInvite.removeAttribute('hidden');
    const inviteLink = await axios.get(`http://localhost:4000/message/getInvite?gId=${activeGroup}`, { headers: {'Authorization': token}});
    const secretToken = inviteLink.data.secretToken;
    inputInvite.value = `${secretToken}`;
});

const joinGroupBtn = document.getElementById('join-group-btn');
joinGroupBtn.addEventListener('click',()=>{
    const joinGroupDiv = document.getElementById('join-group-div');
    joinGroupDiv.removeAttribute('hidden');
});

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

const joinGroupFrom = document.getElementById('join-group-form');
joinGroupFrom.addEventListener('submit',async(e)=>{
    e.preventDefault();
    const tokenInput = document.getElementById('join-group-input');
    const decodeToken = parseJwt(tokenInput.value);
    const id = +decodeToken.id;
    console.log('joinGroupForm',id);
    const joinRes = await axios.get(`http:localhost:4000/message/joinGroup?gId=${id}`, { headers: {'Authorization': token}});
    console.log(joinRes);
});