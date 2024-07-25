import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { lastValueFrom } from "rxjs";

import { TokenModel } from "openvidu-angular";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  template: '<ov-videoconference [tokens]="tokens"></ov-videoconference>',
  styles: ['']
})
export class AppComponent {

  APPLICATION_SERVER_URL = environment.applicationServerUrl;

  sessionId = 'openvidu-custom-ui';
  tokens!: TokenModel;

  constructor(private httpClient: HttpClient) { }

  async ngOnInit() {
    this.tokens = {
      webcam: await this.getToken(),
      screen: await this.getToken(),
    };
  }

  /**
   * --------------------------------------------
   * GETTING A TOKEN FROM YOUR APPLICATION SERVER
   * --------------------------------------------
   * The methods below request the creation of a Session and a Token to
   * your application server. This keeps your OpenVidu deployment secure.
   *
   * In this sample code, there is no user control at all. Anybody could
   * access your application server endpoints! In a real production
   * environment, your application server must identify the user to allow
   * access to the endpoints.
   *
   * Visit https://docs.openvidu.io/en/stable/application-server to learn
   * more about the integration of OpenVidu in your application server.
   */

  async getToken(): Promise<string> {
    const sessionId = await this.createSession(this.sessionId);
    return await this.createToken(sessionId);
  }

  createSession(sessionId: string): Promise<string> {
    return lastValueFrom(this.httpClient.post(
      this.APPLICATION_SERVER_URL + 'api/sessions',
      { customSessionId: sessionId },
      { headers: { 'Content-Type': 'application/json' }, responseType: 'text' }
    ));
  }

  createToken(sessionId: string): Promise<string> {
    return lastValueFrom(this.httpClient.post(
      this.APPLICATION_SERVER_URL + 'api/sessions/' + sessionId + '/connections',
      {},
      { headers: { 'Content-Type': 'application/json' }, responseType: 'text' }
    ));
  }
}