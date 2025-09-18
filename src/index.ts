import { state } from "./state";
import { Chat } from "./pages/chatroom";
(function main(){
  const root = document.querySelector('.root')
  if (!root) throw new Error("No se encontro el div root")

    state.init()

    const chat = new Chat()
    root.appendChild(chat)

    state.subscribe(() =>{
      chat.updateMessages()
    })
})()