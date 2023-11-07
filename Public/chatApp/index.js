const messageDiv=document.querySelector('#messages')
window.addEventListener('DOMContentLoaded',()=>{
    getAllGroups()
    
    })


const creatGroupBtn=document.querySelector('#createGroup')
creatGroupBtn.addEventListener('click',(e)=>{
    e.preventDefault()
    const groupName=prompt('Enter your group name');
    createGroup(groupName)
})

function createGroup(groupName){
    const token=localStorage.getItem('token')
    console.log(token)
    const data={
        groupName:groupName
    }
    axios.post('http://localhost:3000/chat/createGroup',data,{headers:{'Authorization':token}}).then((res)=>{
        alert(res.data.message)
        getAllGroups()
    })

}

function getAllGroups(){
    const token=localStorage.getItem('token')
    axios.get('http://localhost:3000/chat/all-groups',{headers:{'Authorization':token}}).then((res)=>{
        // console.log(res.data.user_Groups)
          const groupLists=res.data.user_Groups
            showGroupsOnScreen(groupLists)
        
    })
}

function showGroupsOnScreen(groupLists){

    const groupListDiv=document.querySelector('#groupList')


    for(let group of groupLists){
        const div=document.createElement('div')
        div.innerHTML=`<button onClick="getAllGroupMessages(${group.id})">${group.groupName}</button>`
        groupListDiv.appendChild(div)
    }
        
}

function  getAllGroupMessages(groupId){

    localStorage.setItem('groupId',groupId)
    
    const messages=JSON.parse(localStorage.getItem(`localchat${groupId}`)) || []
   
    const lastMessage=messages[messages.length-1]
   
    const lastMessageId=lastMessage?lastMessage.id:0
    
    axios.get(`http://localhost:3000/chat/all-messages?groupId=${groupId}&lastMessageId=${lastMessageId}`).then((res)=>{
        const newMessages=res.data.messages
        messageDiv.innerHTML=' '
       
        const oldMessages=JSON.parse(localStorage.getItem(`localchat${groupId}`))||[]
        
        const mergedMessages=[...oldMessages,...newMessages]
        const maxMessages = 20;

       while (mergedMessages.length > maxMessages) {
         mergedMessages.shift() 
        }

        localStorage.setItem(`localchat${groupId}`,JSON.stringify(mergedMessages))
        
        for(let chat of mergedMessages){
            const userName=chat.userName
            const message=chat.messageContent
        
            displayMessages(userName,message)
        }
})
}

const chatForm=document.querySelector('#chatform')

chatForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    const groupId=localStorage.getItem('groupId')
    const token=localStorage.getItem('token')
    const messageInput=document.querySelector('#messageInput')
    

    const data={
        messageContent:messageInput.value , 
        groupId:groupId
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

function displayMessages(userName,message){

    const p=document.createElement('p')
    p.innerHTML=`${userName}: ${message}`

    messageDiv.appendChild(p)

}