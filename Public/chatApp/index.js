const chatForm=document.querySelector('#chatMessage')

chatForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    const token=localStorage.getItem('token')
    const messageInput=document.querySelector('#message-input')
    

    const data={
        messageContent:messageInput.value  
    }
    
    axios.post('http://localhost:3000/chat/message',data,{headers:{'Authorization':token}}).then((res)=>{
        const name=res.data.UserName
        const message=res.data.message
    })

})