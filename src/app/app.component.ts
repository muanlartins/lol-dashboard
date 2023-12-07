import { Component } from '@angular/core';
import { LcuService } from './core/services/lcu.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public auth: boolean = false;

  constructor(public lcuService: LcuService) {}

  public fileChanged(event: any) {
    const lockfile = new FileReader();

    lockfile.onload = (e: any) => {
      const result = lockfile.result as string;

      const port = result.split(':')[2];
      const password = result.split(':')[3];

      const baseAddress = `https://127.0.0.1:${port}`;
      const header = `Basic ${btoa(`riot:${password}`)}`;

      this.lcuService
        .sendAuth(baseAddress, header)
        .subscribe((ok: boolean) => (this.auth = true));
    };

    lockfile.readAsText(event.target.files[0]);
  }
}
