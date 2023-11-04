const chatForm=document.querySelector('#chatform')

chatForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    const token=localStorage.getItem('token')
    const messageInput=document.querySelector('#messageInput')
    

    const data={
        messageContent:messageInput.value  
    }
    
    axios.post('http://localhost:3000/chat/message',data,{headers:{'Authorization':token}}).then((res)=>{
        const message=res.data.message
        const userName=res.data.userName
        displayMessages(userName,message)


    }).catch(error=>{
        alert(error.response.data.error)

    })

})

window.addEventListener('DOMContentLoaded',()=>{
    getAllMessages()
    
    })

function  getAllMessages(){
    axios.get('http://localhost:3000/chat/all-messages').then((res)=>{
        console.log(res.data.messages)
        for(let chat of res.data.messages){
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