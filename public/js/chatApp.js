const inputSend = document.getElementById('input-send');
const token = localStorage.getItem('token');
const sendMsg = document.getElementById('send-msg');
const messagesUl = document.getElementById('messages-list');

inputSend.addEventListener('submit',(e)=>{
    e.preventDefault();

    let inputSendObj = { message: sendMsg.value }

    axios.post('http://localhost:4000/message',inputSendObj, { headers: {'Authorization': token}} )
    .then((response) => {
        sendMsg.value = '';
        addNewLineElement( response.data.mesg, response.data.name );
    }).catch((err) => {
        console.log(err);
    });

});

function addNewLineElement(data,nameParam) {
    const li = document.createElement('h4');
    
    li.appendChild(
        document.createTextNode( nameParam + ': ' + data.message + ' ')
    );
    
    messagesUl.appendChild(li);
}

let totalMsg = null;
async function getAllMsg(){
    try{
        const allM = await axios.get('http://localhost:4000/message', { headers: {'Authorization': token}} );
        const arr = allM.data.mesg;
        if(totalMsg!==arr.length){
            messagesUl.innerHTML = '';
            arr.forEach(element => {
                addNewLineElement(element, element.user.name);
            });
            totalMsg = arr.length;
        }
    }catch(err){
        console.log(err);
    }
}

window.addEventListener('DOMContentLoaded', async()=>{
    try{
        const allM = await axios.get('http://localhost:4000/message', { headers: {'Authorization': token}} );
        const arr = allM.data.mesg;
        totalMsg = arr.length;
        arr.forEach(element => {
            addNewLineElement(element, element.user.name);
        });
        setInterval(getAllMsg, 2000);
    }catch(err){
        console.log(err);
    }
});