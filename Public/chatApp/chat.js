function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}


const messageDiv=document.querySelector('#messages')


const logout=document.querySelector('#logout')
logout.addEventListener('click',()=>{
    window.location.href='../Login/login.html'
})

const groupName=document.querySelector('#groupName')


const home=document.querySelector('#home')
home.addEventListener('click',()=>{
    window.location.href='../chatApp/index.html'
})


function uploadFile(e){
    e.preventDefault()
    const token=localStorage.getItem('token')
    const groupId=localStorage.getItem('selectedGroupId')
    const fileInput=document.querySelector('#fileInput')
    const uploadedFile=fileInput.files[0]

    if (!uploadedFile) {
        alert('No file selected')
        return
    }

    const formData = new FormData()
    formData.append('groupId', groupId)
    formData.append('file', uploadedFile)

    axios.post('http://localhost:3000/chat/add-file', formData, {headers: {
            'Authorization': token,
            'Content-Type': 'multipart/form-data'
        }
    }).then((res) => {
        const message=res.data.message
        const userName=res.data.userName
        displayMessages(userName,message)
    })
}


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
        // socket.emit('user-message', message) 
        displayMessages(userName,message)


    }).catch(error=>{
        alert(error.response.data.error)

    })

})

window.addEventListener('DOMContentLoaded',()=>{
    getAllGroupMessages()
    getAllGroups()
    
    })


    // socket.on('message', (message) => {
    //     displayMessages('name', message)
    // })

    const creatGroupBtn=document.querySelector('#createGroup')
    creatGroupBtn.addEventListener('click',(e)=>{
        e.preventDefault()
        const groupName=prompt('Enter your group name');
        createGroup(groupName)
    })
    
    function createGroup(groupName){
        const token=localStorage.getItem('token')
        // console.log(token)
        const data={
            groupName:groupName
        }
        axios.post('http://localhost:3000/group/createGroup',data,{headers:{'Authorization':token}}).then((res)=>{
            alert(res.data.message)
            getAllGroups()
        })
    
    }
    
    function getAllGroups(){
        const token=localStorage.getItem('token')
        axios.get('http://localhost:3000/group/all-groups',{headers:{'Authorization':token}}).then((res)=>{
            // console.log(res.data.user_Groups)
              const groupLists=res.data.user_Groups
                showGroupsOnScreen(groupLists)        
        })
    }
    
    function showGroupsOnScreen(groupLists){
    
        const groupListDiv=document.querySelector('#groupList')
        groupListDiv.innerHTML=''
    
        for(let group of groupLists){
            const div=document.createElement('div')
            const GroupBtn=document.createElement('button')
            GroupBtn.textContent=`${group.groupName}`
            GroupBtn.addEventListener('click',()=>{
                localStorage.setItem('selectedGroupId', group.id)
                localStorage.setItem('selectedGroupName',group.groupName)
                getAllGroupMessages()
    
            })
            div.appendChild(GroupBtn)
            groupListDiv.appendChild(div)
            
        }        
    }

function  getAllGroupMessages(){

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


}



function displayMessages(name,message){
    const token=localStorage.getItem('token')

    const decodedname = parseJwt(token).userName
    // console.log(dname)
    const p=document.createElement('p')
    const isImage = message.startsWith('https://expensetrackingapp98.s3.amazonaws.com/')

    if (isImage) {
        if (name === decodedname) {
            p.innerHTML = `You: <img src="${message}" alt="${name}'s Image" style="width:20vw;height:auto">`
        } else {
            p.innerHTML = `${name}: <img src="${message}" alt="${name}'s Image" style="width:20vw;height:auto">`
        }
    } else {
        if (name === decodedname) {
            p.innerHTML = `You: ${message}`
        } else {
            p.innerHTML = `${name}: ${message}`
        }
    }

    messageDiv.appendChild(p);

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



// make change button
const  showParticipants=document.querySelector('#showParticipants')

showParticipants.addEventListener('click',()=>{
    window.location.href='../Participants/showParticipants.html'

})


// add participants btn
const addParticipantsBtn=document.querySelector('#addParticipantBtn')

  addParticipantsBtn.addEventListener('click',async()=>{
   
    const groupId=localStorage.getItem('selectedGroupId')
  const isAdmin =await isUserAdmin(groupId);
     if (isAdmin) {
        window.location.href='../Participants/addParticipants.html'
      } else {
    alert('Only admin can add users.')
     }
   })


// leave group button
 const leavebutton=document.querySelector('#leaveGroupBtn')

 leavebutton.addEventListener('click',()=>{
    const groupId=localStorage.getItem('selectedGroupId')
    const token=localStorage.getItem("token")
    axios.delete(`http://localhost:3000/group/leaveGroup/${groupId}`,{headers:{'Authorization':token}}).then((res)=>{
        alert(res.data.message)
        window.location.href='../chatApp/chat.html'
       
    })

})










