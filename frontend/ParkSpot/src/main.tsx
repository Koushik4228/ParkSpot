// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './index.css'
import 'aos/dist/aos.css';
import { BrowserRouter } from 'react-router-dom'
import {store,persistor} from './Components/Accounts/Store/mystore';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
// import AOS from 'aos';
 

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
<Provider store = {store}>
<PersistGate loading={null} persistor = {persistor}>
    <App />
</PersistGate>
</Provider>
  </BrowserRouter>
)