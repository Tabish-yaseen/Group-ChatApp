const userListDiv=document.querySelector('#userList')

const showParticipantsDiv=document.querySelector('#showParticipantsDiv')

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

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


window.addEventListener('DOMContentLoaded',async()=>{
    const groupId=localStorage.getItem('selectedGroupId')
    const isAdmin=await isUserAdmin(groupId)
    if(isAdmin){
        displayUserListOfGroup(groupId)

    } else{
        showParticipants()
        
    }

})


function showParticipants(){
    const token=localStorage.getItem('token')
        const decodedUserId= parseJwt(token).userId
    
        showParticipantsDiv.innerHTML=''
    
         const groupId=localStorage.getItem('selectedGroupId')
    
        axios.get(`http://localhost:3000/user/usersList/${groupId}`).then((res)=>{
            const userList=res.data.List
           for(let user of userList){
            if(user.isAdmin){
                if(decodedUserId===user.userId){
                   showParticipantsDiv.innerHTML+=`<div> <span class="user-name">You</span> - <span class="admin-indicator"> Admin </span> </div>`
                } else{
                    showParticipantsDiv.innerHTML+=`<div> <span class="user-name"> ${user.name}</span> - <span class="admin-indicator"> Admin </span></div>`
                }
               
    
            }
            else{
                showParticipantsDiv.innerHTML+=`<div> <span class="user-name"> ${user.name}</span> </div>`
            }
           }
        })

}


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
                userListDiv.innerHTML+='<div> You are admin</div>'
            } else{
                userListDiv.innerHTML+=`<div>
                <span class="user-name"> ${user.name}</span> -<span class="admin-indicator"> Admin </span> <button onClick="removeAdmin(${user.userId},${groupId})">Remove from Admin</button>
                <button onClick="removeUser(${user.userId},${groupId})">Remove from Group</button>
                </div>`
            }           

        }
        else{
            userListDiv.innerHTML+=`<div>
            <span class="user-name"> ${user.name}</span>   <button onClick="makeAdmin(${user.userId},${groupId})">Make Admin</button>
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