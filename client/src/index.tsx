import { h, render } from 'preact';
import 'preact/devtools';
import App from './App.js';

import { ClientContext, ChannelErrors } from '@logux/client/preact'
import client from './store';
import Page404 from './Page404';
import Page403 from './Page403';


render(
 <ClientContext.Provider value={client}>
   {/* @ts-ignore missing types thang */}
   <ChannelErrors NotFound={Page404} AccessDenied={Page403}>
     <App />
   </ChannelErrors>
 </ClientContext.Provider>,
 document.getElementById('root')!
)