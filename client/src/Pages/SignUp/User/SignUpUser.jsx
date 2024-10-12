import { UserSignupFormComponent } from './user-signup-form'

export default function SignUpUser() {
  return (
    <div className="login">
        <div className="loginLeft hidden sm:block">
            <img src="" alt="" />
        </div>

        <div className="loginRight pt-5 mb-5">
            <h3 style={{fontWeight:"semi-bold",fontSize:"2em",marginBottom:"25px"}}>User - Sign Up</h3>

            <UserSignupFormComponent />

            <div className='mb-5'>

            </div>
            
        </div>
    </div>

  )
}
