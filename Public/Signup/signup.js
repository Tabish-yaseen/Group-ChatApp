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
        console.log(res.data.message)
    })
})