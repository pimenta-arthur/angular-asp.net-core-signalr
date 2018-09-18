import { Component } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from "@aspnet/signalr";
import { environment } from '../environments/environment';

export interface Message {
  name: string,
  text: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-app';
  _hubConnection: HubConnection;
  _environment = environment
  messages: Message[] = []; 

  ngOnInit(): void {
    this._hubConnection = new HubConnectionBuilder()
      .withUrl(this._environment.serverUri + "/chathub")
      .build();

    this._hubConnection.on("ReceiveMessage", (name: string, text: string) => {
      let msg: Message = {name: name, text: text};
      
      this.messages.push(msg)
    });

    this._hubConnection
      .start()
      .then(() => {
        console.log("Connection started!");
      })
      .catch(err => console.log("Error while establishing connection :("));
  }

  sendMessage(name: string, msg: string)
  {
    this._hubConnection.invoke('SendMessage', name, msg)
      .catch(err => console.log(err));
  }
}
