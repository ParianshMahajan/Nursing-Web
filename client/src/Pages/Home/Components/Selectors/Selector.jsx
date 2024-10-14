import "./Selector.css"
import { useNavigate } from 'react-router-dom'

// eslint-disable-next-line react/prop-types
export default function Selector({details}) {
  const navigate=useNavigate();
  return (
    <div className={`selector ${details}`} onClick={()=>{navigate(`/login/${details}`)}} >
        <p>Log in </p>
        <h4>{`As a ${details}`}</h4>
    </div>
  )
}
