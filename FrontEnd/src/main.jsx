import ReactDOM from 'react-dom/client'
import App from './components/App'
import './index.css'

import { AxiosInterceptor } from './interceptors'

AxiosInterceptor();

ReactDOM.createRoot(document.getElementById('root')).render(

    <App />
    
);
