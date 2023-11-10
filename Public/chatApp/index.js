window.addEventListener('DOMContentLoaded',()=>{
    getAllGroups()
    
    })
// home button
const home=document.querySelector('#home')
home.addEventListener('click',()=>{
    window.location.href='../chatApp/index.html'
})

//logout button
const logout=document.querySelector('#logout')
logout.addEventListener('click',()=>{
    window.location.href='../Login/login.html'
})

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
            window.location.href = '../chatbox/chat.html'

        })
        div.appendChild(GroupBtn)
        groupListDiv.appendChild(div)
        
    }        
}