import { Authenticator } from '@aws-amplify/ui-react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }: { children: JSX.Element }) {
    return (
      <div style={{height:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
        <Authenticator>
        {({ user }) => {
          return user ? children : <Navigate to="/" />;
        }}
      </Authenticator>
      </div>
    );
  }
  

export default ProtectedRoute