const API_BASE_URL = "https://deployingrooms.onrender.com";


type Message ={
  from: string;
  message: string;
}

function getAllMessages(){
  return fetch(`${API_BASE_URL}/messages`, {
    headers: { 'Content-Type': 'application/json' }
  })
  .then(res => res.json())
  .then(data => {
  console.log("getAllMessages data:", data);
  return data.messages || data; // si no tiene messages, devolvé data directo
  })
  .catch(console.error);
}

export {getAllMessages}


function postMessage(newMessage: Message){
  return fetch(`${API_BASE_URL}/messages`,{
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newMessage)
  })
  .then(res => {
    if (!res.ok) throw new Error("Error al enviar el mensaje");
    return res.json();
  })
  .then(data => {
  console.log("postMessage data:", data);
  return data.message || data; // similar acá
  })
  .catch(console.error);
}

export {postMessage}