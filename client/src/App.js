import './App.css';
import io from 'socket.io-client'
import { useState, useEffect } from 'react';

const socket = io('http://localhost:4000'); // The URL where the socket server is runnning

function App() {

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([])
  useEffect(() => {

    const recieveMessage = (message) => {
      setMessages([message, ...messages])
    };
    socket.on('message', recieveMessage);

    return () => {
      socket.off('message', recieveMessage); //Desuscribe when done
    };

  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault()
    socket.emit('message', message);
    const newMessage = {body: message, from: "Me"}
    setMessages([newMessage, ...messages])
    setMessage('');
  }


  return (
    <div className="h-screen bg-zinc-800 text-white flex items-center justify-center">
      <form
       onSubmit={handleSubmit}
       className='bg-zinc-800 p-10'
       >
        <input value={message} type="text" onChange={e => setMessage(e.target.value)}></input>
        <button type='submit'>Send</button>
      {messages.map((message, index)=>{
        return(
          <div key={index}>
            <p>{message.from}: {message.body}</p>
          </div>
        )
      })}
      </form>
    </div>
  );
}

export default App;
