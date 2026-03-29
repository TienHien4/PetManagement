
import './App.css';
import AppRouter from './routers/AppRouter';
import Chatbot from './components/chatbot/Chatbot';
// import './assets/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <AppRouter></AppRouter>
      <Chatbot />
    </div>
  );
}

export default App;
