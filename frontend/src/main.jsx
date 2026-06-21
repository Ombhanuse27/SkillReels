import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import App from './App.jsx';
import './index.css'; // Make sure your Tailwind styles are imported here

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Provide the Redux store to the entire application */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);