import { state } from "../../state";

export class Chat extends HTMLElement{
  connectedCallback(){
    this.render()
    this.loadMessages();
    this.addEventListeners();
  }
  loadMessages() {
    state.arriveMessages().then(() => {
      this.updateMessages(); // Actualizás el DOM con los mensajes
    });
  }
  addEventListeners() {
    const form = this.querySelector('form')!;
    const input = this.querySelector('#chat') as HTMLInputElement;

    form.addEventListener('submit', (event) => {
      event.preventDefault(); 
      const newMessage = { from: "Usuario", message: input.value };
      state.sendMessages(newMessage).then(() => {
        input.value = '';
        this.updateMessages(); 
      });
    });
  }
  updateMessages() {
    const messagesDiv = this.querySelector('#messages')!;
    const messages = state.getState().messages;

    messagesDiv.innerHTML = messages.map((msg: { from: string; message: string })  => `
      <div>
        <strong>${msg.from}:</strong> ${msg.message}
      </div>
    `).join(''); 
  }
  render() {
    this.innerHTML = `
      <h1>Sala de chat</h1>
      <form>
        <input type="text" id="chat" placeholder="Escribe tu mensaje...">
        <button>Enviar</button>
      </form>
      <div id="messages"></div>
    `;
    
  }
}
customElements.define('chat-room', Chat);

