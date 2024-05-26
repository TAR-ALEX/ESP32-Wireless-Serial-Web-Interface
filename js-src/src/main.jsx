import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import App from './App';

document.addEventListener("DOMContentLoaded", (event) => {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
        <React.StrictMode>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            <meta name="HandheldFriendly" content="true" />
            <App />
        </React.StrictMode>
    );
}); 