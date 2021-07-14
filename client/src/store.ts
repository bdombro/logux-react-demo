import { CrossTabClient, badge, badgeEn, log, IndexedStore } from "@logux/client"
// import {badgeStyles} from '@logux/client/badge/styles'

const client = new CrossTabClient({
  subprotocol: '1.0.0',
  // @ts-ignore: Snowpack env
  server: import.meta.env.NODE_ENV === 'production'
    ? 'wss://logux.example.com'
    : 'ws://localhost:31337',
    
	// userId: localStorage.getItem('userId') ?? 'paul',
  // token: localStorage.getItem('token') ?? '',
  userId: 'paul',
  token: localStorage.getItem('token') ?? '',
  // credentials: '',
  store: new IndexedStore(),
})

// badge(client, { messages: badgeEn, styles: badgeStyles })
log(client);

client.start()

export default client
