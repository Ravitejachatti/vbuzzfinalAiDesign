import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import AllRoutes from './Routes/AllRoutes';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from "./components/Resuable/Errorboundary.jsx";


function App() {
  const [apiBaseUrl, setApiBaseUrl] = useState(import.meta.env.VITE_API_BASE_URL); // Access environment variable

  useEffect(() => {
    console.log("API Base URL:", apiBaseUrl); // Log the API Base URL to the console
  }, [apiBaseUrl]);

  return (
    <ErrorBoundary>
      <Toaster />
      <div className="App ">
        <header className="App-header">
          <AllRoutes />
        </header>
      </div>
      </ErrorBoundary>
  );
}

export default App;
