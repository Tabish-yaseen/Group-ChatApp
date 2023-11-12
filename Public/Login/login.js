const loginForm=document.querySelector('#loginform')

loginForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    const email=document.querySelector('#email')
    const password=document.querySelector("#password")

    const details={
        email:email.value,
        password:password.value
    }
    axios.post('http://localhost:3000/user/login',details).then((res)=>{
        const token=res.data.token
        localStorage.setItem('token',token)
        if(res.status===200){
            alert(res.data.message)
            window.location.href='../chatApp/chat.html'
        }

    }).catch((error)=>{
        if ( error.response.status === 400) {
            alert(error.response.data.error);
        } else {
            console.error(error);
            alert("An error occurred. Please try again later.");
        }
    })

})