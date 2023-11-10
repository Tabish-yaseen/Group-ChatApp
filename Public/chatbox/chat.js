function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

const messageDiv=document.querySelector('#messages')

const participantForm=document.querySelector('#particpantsForm')

const userListDiv=document.querySelector('#userList')

const showParticipantsDiv=document.querySelector('#showParticipantsDiv')
const groupName=document.querySelector('#groupName')


const home=document.querySelector('#home')
home.addEventListener('click',()=>{
    window.location.href='../chatApp/index.html'
})


const chatForm=document.querySelector('#chatform')

chatForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    const groupId=localStorage.getItem('selectedGroupId')
    const token=localStorage.getItem('token')
    const messageInput=document.querySelector('#messageInput')

    if(!messageInput.value){
        return
    }
    
    const data={
        messageContent:messageInput.value, 
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

window.addEventListener('DOMContentLoaded',()=>{
    const groupId=localStorage.getItem('selectedGroupId')
    
    groupName.innerHTML=`${localStorage.getItem('selectedGroupName')}`
    

    const messages=JSON.parse(localStorage.getItem(`localchat${groupId}`)) || []
   
    const lastMessage=messages[messages.length-1]
   
    const lastMessageId=lastMessage?lastMessage.id:0
    
    axios.get(`http://localhost:3000/chat/all-messages?groupId=${groupId}&lastMessageId=${lastMessageId}`).then((res)=>{
        const newMessages=res.data.messages
        messageDiv.innerHTML=' '
       
        const oldMessages=JSON.parse(localStorage.getItem(`localchat${groupId}`))||[]
        
        const mergedMessages=[...oldMessages,...newMessages]
        const maxMessages = 20

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
    
    })



function displayMessages(name,message){
    const token=localStorage.getItem('token')

    const decodedname = parseJwt(token).userName
    // console.log(dname)
    const p=document.createElement('p')
    if(name===decodedname){
        p.innerHTML=`You: ${message}`
    }
   else{
    p.innerHTML=`${name}: ${message}`

   }
   messageDiv.appendChild(p)
    

}

// function to check wheather user is the admin or not
function isUserAdmin(groupId) {
    return new Promise((resolve, reject) => {
        const token = localStorage.getItem('token')
        axios.get(`http://localhost:3000/group/isAdmin/${groupId}`,{headers:{'Authorization':token}})
            .then((res) => {
                resolve(res.data.isAdmin)
            })
            .catch((error) => {
                reject(fasle)
            })
    })
    
}

// show participants button
const showParticipantsbtn=document.querySelector('#showParticipantsbtn')

   showParticipantsbtn.addEventListener('click',()=>{

    const token=localStorage.getItem('token')
    const decodedUserId= parseJwt(token).userId

    showParticipantsDiv.innerHTML=''

     const groupId=localStorage.getItem('selectedGroupId')

    axios.get(`http://localhost:3000/user/usersList/${groupId}`).then((res)=>{
        const userList=res.data.List
       for(let user of userList){
        if(user.isAdmin){
            if(decodedUserId===user.userId){
               showParticipantsDiv.innerHTML+=`<div> You - Admin</>`
            } else{
                showParticipantsDiv.innerHTML+=`<div>${user.name} - Admin</div>`
            }
           

        }
        else{
            showParticipantsDiv.innerHTML+=`<div>${user.name}</div>`
        }
       }
    })

})

// make change button
const  makeChangesBtn=document.querySelector('#makeChangesbtn')

makeChangesBtn.addEventListener('click',async()=>{
    const groupId=localStorage.getItem('selectedGroupId')
    const isAdmin=await isUserAdmin(groupId)
        if(isAdmin){
            displayUserListOfGroup(groupId)

        } else{
            alert('only Admin can make changes')
        }

})

// function used to display user list to make changes
function displayUserListOfGroup(groupId){
    const token=localStorage.getItem('token')
    const decodedUserId= parseJwt(token).userId
    
    userListDiv.innerHTML=''
    axios.get(`http://localhost:3000/user/usersList/${groupId}`).then((res)=>{
        const userList=res.data.List
       for(let user of userList){
        // console.log(user)
        if(user.isAdmin){
            if(decodedUserId===user.userId){
                userListDiv.innerHTML+='<div> You are admin</>'
            } else{
                userListDiv.innerHTML+=`<div>
                ${user.name} Admin <button onClick="removeAdmin(${user.userId},${groupId})">Remove from Admin</button>
                <button onClick="removeUser(${user.userId},${groupId})">Remove from Group</button>
                </div>`
            }
           

        }
        else{
            userListDiv.innerHTML+=`<div>
            ${user.name}  <button onClick="makeAdmin(${user.userId},${groupId})">Make Admin</button>
            <button onClick="removeUser(${user.userId},${groupId})">Remove from Group</button>
            </div>`
        }
       }
    })

}
// function used to remove user from the group
function removeUser(userId,groupId){
    axios.delete(`http://localhost:3000/group/removeUser?userId=${userId}&groupId=${groupId}`).then((res)=>{
        alert(res.data.message)
        displayUserListOfGroup(groupId)
    })

}
// function used to make a users admin
function  makeAdmin(userId,groupId){
    axios.post(`http://localhost:3000/group/makeAdmin?userId=${userId}&groupId=${groupId}`).then((res)=>{
        alert(res.data.message)
        displayUserListOfGroup(groupId)
    })

}
// function used to remove the user from the admin
function removeAdmin(userId,groupId){
    axios.post(`http://localhost:3000/group/removeAdmin?userId=${userId}&groupId=${groupId}`).then((res)=>{
        alert(res.data.message)
        displayUserListOfGroup(groupId)
    })

}

// add participants btn
const addParticipantsBtn=document.querySelector('#addParticipantBtn')

  addParticipantsBtn.addEventListener('click',async()=>{
    const groupId=localStorage.getItem('selectedGroupId')
  const isAdmin =await isUserAdmin(groupId);
     if (isAdmin) {
      getParticipants(groupId);
      } else {
    alert('Only admin can add users.');
     }
   })

// function used to get participants 
   function getParticipants(groupId){
    participantForm.innerHTML=''
    axios.get(`http://localhost:3000/user/participants/${groupId}`).then((res)=>{
        const users=res.data.users
        if(users.length===0){
           return  alert('All the users are added in your Group,there is no more users')
        }
        for(let user of users){
            participantForm.innerHTML+=`
           <div><input type='checkbox' class="user" name="user" value="${user.id}">${user.name}</div>
            `
        }
        
        participantForm.innerHTML += `<button type="submit">Add</button>`;

    })

}
// function used to add the participants
function addParticipants(e){
    e.preventDefault()
    const groupId=localStorage.getItem('selectedGroupId')
            const selectedUserId = []
            const users = document.querySelectorAll('.user')

            for (let user of users) {
                if (user.checked) {
                    selectedUserId.push(user.value)
                }
            }

            const data = {
                usersId: selectedUserId,
                groupId: groupId
            };

            axios.post('http://localhost:3000/user/add-Participants', data).then((res) => {
                participantForm.innerHTML = ''
                alert(res.data.message)
                
            });
}

// leave group button
 const leavebutton=document.querySelector('#leaveGroupBtn')

 leavebutton.addEventListener('click',()=>{
    const groupId=localStorage.getItem('selectedGroupId')
    const token=localStorage.getItem("token")
    axios.delete(`http://localhost:3000/group/leaveGroup/${groupId}`,{headers:{'Authorization':token}}).then((res)=>{
        alert(res.data.message)
        window.location.href='../chatApp/index.html'
       
    })

})










