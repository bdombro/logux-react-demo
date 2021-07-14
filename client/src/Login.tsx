import {h} from 'preact'
import { useAuth } from '@logux/client/preact'

export default function UserPage() {
  let { isAuthenticated, userId } = useAuth()
  if (isAuthenticated) {
    return <div>UserID: {userId}</div>
  } else {
    return <button>Login</button>
  }

	function onClick() {
		
	}
}