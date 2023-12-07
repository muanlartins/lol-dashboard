import { Component } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { Tracker } from '../../models/tracker';
import { Skin } from '../../models/skin';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  public tracker: Tracker;

  public championId: string;

  public unlocked: Skin[];

  public unlockable: Skin[];

  public open: boolean = false;

  constructor(private modalService: ModalService) {
    this.modalService.open.subscribe((open: boolean) => {
      this.open = open;
      if (open) {
        this.tracker = this.modalService.data.tracker;
        this.championId = this.modalService.data.championId;
        this.getUnlockedSkins();
        this.getUnlockableSkins();
      }
    });
  }

  public closeModal() {
    this.modalService.closeModal();
    this.open = false;
  }

  public getUnlockedSkins() {
    this.unlocked = this.tracker[this.championId].champion.skins.filter(
      (skin: Skin) => skin.ownership.owned,
    );
  }

  public getUnlockableSkins() {
    this.unlockable = this.tracker[this.championId].unlockable.map(
      (skinName: string) =>
        this.tracker[this.championId].champion.skins.find(
          (skin: Skin) => skin.name === skinName,
        ),
    ) as Skin[];
  }
}
