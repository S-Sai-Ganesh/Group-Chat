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

function addNewLineElement(data,name) {
    const li = document.createElement('h4');

    li.appendChild(
        document.createTextNode( name  + ' :' + data.message + ' ')
    );
    
    messagesUl.appendChild(li);
}

window.addEventListener('DOMContentLoaded', async()=>{
    try{
        const allM = await axios.get('http://localhost:4000/message', { headers: {'Authorization': token}} );
        const name = allM.data.name;
        const arr = allM.data.mesg;
        arr.forEach(element => {
            addNewLineElement(element,name);
        });
    }catch(err){
        console.log(err);
    }
});