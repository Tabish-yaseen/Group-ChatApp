const loginForm=document.querySelector('#loginform')

loginForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    const email=document.querySelector('#email')
    const password=document.querySelector("#password")

    const details={
        email:email.value,
        password:password.value
    }
    console.log(details)
    axios.post('http://localhost:3000/user/login',details).then((res)=>{
        if(res.status===200){
            alert(res.data.message)
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