import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  public open: Subject<boolean> = new Subject<boolean>();

  public data: any;

  constructor() {}

  public openModal(data: any) {
    this.data = data;
    this.open.next(true);
  }

  public closeModal() {
    this.data = null;
    this.open.next(false);
  }
}
