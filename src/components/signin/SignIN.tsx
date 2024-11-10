import { useEffect } from "react";
import { useNavigate } from "react-router-dom"

function SignIN() {

    const navigate = useNavigate();
    useEffect(() => {
        navigate("/doctor")
    }, [])

  return (
   <>
   
   </>
  )
}

export default SignIN