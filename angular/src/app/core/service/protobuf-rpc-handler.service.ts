import {Inject, Injectable, InjectionToken} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";


export const PROTOBUF_RPC_ENDPOINT = new InjectionToken<string>('Protobuf RPC Endpoint base URL');


@Injectable()
export class ProtobufRpcHandler {

  constructor(
    private readonly http: HttpClient,
    @Inject(PROTOBUF_RPC_ENDPOINT) private readonly endpoint: string) {
  }

  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array> {

    const url = this.makeUrl(service, method);

    const response$ = this.http.post(url, data.buffer, {
      headers: {
        'Content-Type': 'application/protobuf',
        'Accept': ['application/protobuf', 'application/json']
      },
      responseType: "arraybuffer",
      observe: "response"
    });

    const arrUint$ = response$.pipe(
      map(response => {
        if (response.body == null) {
          throw new Error('Response body is null.');
        }
        return new Uint8Array(response.body);
      })
    );

    return arrUint$.toPromise();
  }

  private makeUrl(service: string, method: string): string {
    let e = this.endpoint;
    if (!e.endsWith('/')) {
      e = e + '/'
    }
    return `${e}${service}/${method}`;
  }


}
