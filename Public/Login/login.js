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

    })

})