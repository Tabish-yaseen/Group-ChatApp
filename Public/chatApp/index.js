const chatForm=document.querySelector('#chatform')

chatForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    const token=localStorage.getItem('token')
    const messageInput=document.querySelector('#messageInput')
    

    const data={
        messageContent:messageInput.value  
    }
    
    axios.post('http://localhost:3000/chat/message',data,{headers:{'Authorization':token}}).then((res)=>{
        chatForm.reset()
        const message=res.data.message
        const userName=res.data.userName
        displayMessages(userName,message)


    }).catch(error=>{
        alert(error.response.data.error)

    })

})

window.addEventListener('DOMContentLoaded',()=>{

    const messages=JSON.parse(localStorage.getItem('messages'))||[]
   
    const lastMessage=messages[messages.length-1]
   
    const lastMessageId=lastMessage?lastMessage.id:0
    
    
    getAllMessages(lastMessageId)
    
    })

function  getAllMessages(lastMessageId){

    axios.get(`http://localhost:3000/chat/all-messages/${lastMessageId}`).then((res)=>{
        const newMessages=res.data.messages
        const oldMessages=JSON.parse(localStorage.getItem('messages'))||[]
        const mergedMessages=[...oldMessages,...newMessages]
        const maxMessages = 20;

       while (mergedMessages.length > maxMessages) {
         mergedMessages.shift() // remove the old messages
        }
        localStorage.setItem('messages',JSON.stringify(mergedMessages))
        
        for(let chat of mergedMessages){
            const userName=chat.userName
            const message=chat.messageContent
        
            displayMessages(userName,message)
        }

       

})
}

function displayMessages(userName,message){
    const messageDiv=document.querySelector('#messages')

    const p=document.createElement('p')
    p.innerHTML=`${userName}: ${message}`

    messageDiv.appendChild(p)

}