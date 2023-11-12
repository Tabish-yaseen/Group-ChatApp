const participantForm=document.querySelector('#particpantsForm')

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
  const isAdmin =await isUserAdmin(groupId);
     if (isAdmin) {
      getParticipants(groupId);
      } else {
    alert('Only admin can add users.');
     }

})

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
                alert(res.data.message)
                window.location.href='../chatApp/chat.html'
                
            });
}