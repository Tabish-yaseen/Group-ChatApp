const signUpForm=document.querySelector('#signupform')

signUpForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    const name=document.querySelector('#name')
    const email=document.querySelector('#email')
    const password=document.querySelector('#password')
    const phoneno=document.querySelector('#phoneno')
    const details={
        name:name.value,
        email:email.value,
        password:password.value,
        phoneno:phoneno.value
    }
    axios.post('http://localhost:3000/user/signup',details).then((res)=>{
            alert(res.data.message)
            window.location.href='../Login/login.html'
        
       
    }).catch((error)=>{
        if ( error.response.status === 400) {
            alert(error.response.data.error);
        } else {
            console.error(error);
            alert("An error occurred. Please try again later.");
        }
    })
})