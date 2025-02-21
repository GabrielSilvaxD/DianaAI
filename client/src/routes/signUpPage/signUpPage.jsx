import { SignUp } from "@clerk/clerk-react";
import './signUpPage.css'


const SignUpPage = () => {
  return (
    <div className='SignUpPage'> 
    <SignUp path="/Sign-up" />
    </div>
   
  )
}

export default SignUpPage
