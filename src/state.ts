import { getAllMessages } from "./api";
import { postMessage } from "./api";
import { rtdb } from "./rtdb";

type Message={
  from:string
  message:string
}




const state = {
  data: {
    nombre:"",
    messages: [] as Message[]
  },
  listeners: [] as Array<(data: { nombre: string; messages: Message[] }) => void>,

  init(){
    const messageRef = rtdb.ref(`chatrooms/general/messages`)
    messageRef.on("value", (snapshot) =>{
      const messagesObj = snapshot.val()
      const messagesArray = Object.keys(messagesObj).map(key => ({
      id: key,
      ...messagesObj[key]
    }));
      const currentState = this.getState() 
      currentState.messages = messagesArray 
      this.setState(currentState)
    })
  },
  arriveMessages(){
    return getAllMessages().then((message)=>{
      const currentState = this.getState()
      const updatedMessages = [...currentState.messages, message];
      this.setState({ ...currentState, messages: updatedMessages });
    }).catch(error => {
    console.error("Error al obtener los mensajes:", error);
  });
  },
sendMessages(newMessage: Message){
  return postMessage(newMessage).then((savedMessage)=>{
    const currentState = this.getState();
    currentState.messages.push(savedMessage);
    this.setState(currentState);
  }).catch(error => {
    console.error("Error al enviar los mensajes:", error);
  });
},
    getState(): any {
    return this.data;
  },
  setState(newState: { nombre: string; messages: Message[] }){
    this.data = newState
    this.listeners.forEach(callback => callback(this.data))
  },
  subscribe(callback: (data: { nombre: string; messages: Message[] }) => void) {
    this.listeners.push(callback);
  },
  notify() {
    this.listeners.forEach(callback => callback(this.data));
  }

}

export {state}