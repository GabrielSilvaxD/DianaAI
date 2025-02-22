import { SignIn } from "@clerk/clerk-react";
import './signInPage.css';


const SignInPage = () => {
  return (
    <div className='SignInPage'> 
    <SignIn path="/Sign-in" signInUrl="Sign-in" />
    </div>

  )
}

export default SignInPage;
