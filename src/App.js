import logo from './logo.svg';
import './App.css';
import PostList from './PostList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1> PostList (Frontend React)</h1>
        <PostList />
      </header>
    </div>
  );
}

export default App;