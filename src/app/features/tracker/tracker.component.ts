import { Component, Output } from '@angular/core';
import { DisplayCategories } from 'src/app/core/enums/displayCategories';
import { ItemStatus } from 'src/app/core/enums/itemStatus';
import { Champion } from 'src/app/core/models/champion';
import { Champions } from 'src/app/core/models/champions';
import { Loot } from 'src/app/core/models/loot';
import { Skin } from 'src/app/core/models/skin';
import { Tracker } from 'src/app/core/models/tracker';
import { Summoner } from 'src/app/core/models/summoner';
import { LcuService } from 'src/app/core/services/lcu.service';
import { Filter } from './models/filter';
import { FilterType } from './enums/filterType';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalService } from 'src/app/core/services/modal.service';
import { Mastery } from 'src/app/core/models/masteries';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.scss'],
})
export class TrackerComponent {
  public summoner: Summoner;

  public champions: Champions;

  public championIds: string[];

  public filteredChampionIds: string[];

  public filter: Filter = {
    name: '',
    unlockable: false,
    noSkins: false,
    noMastery: false,
  } as Filter;

  public filterType: typeof FilterType = FilterType;

  public form: FormGroup;

  public tracker: Tracker = {};

  public loading: boolean = true;

  constructor(
    private lcuService: LcuService,
    private modalService: ModalService,
  ) {
    this.getSummoner();
    this.getChampions();
    this.initForm();
    this.subscribeToFormChanges();
  }

  public getSummoner() {
    this.lcuService.getSummoner().subscribe((summoner: Summoner) => {
      this.summoner = summoner;
    });
  }

  public getChampions() {
    this.lcuService.getChampions().subscribe((champions: Champions) => {
      this.champions = champions;
      this.championIds = Object.keys(champions);
      this.filteredChampionIds = this.championIds;
      this.getTracker();
    });
  }

  public getTracker(): void {
    this.championIds.forEach((championId: string) => {
      this.tracker[championId] = {
        owned: false,
        skinCount: 0,
        unlockable: [] as string[],
        champion: {} as Champion,
        mastery: {} as Mastery,
      };
    });

    this.championIds.forEach((championId: string) => {
      this.getChampion(this.summoner.summonerId, championId).subscribe(
        (champion: Champion) => {
          this.tracker[championId].champion = champion;
          this.tracker[championId].owned = champion.ownership.owned;

          if (this.tracker[championId].owned) {
            champion.skins.forEach((skin: Skin) => {
              if (skin.ownership.owned && !skin.isBase)
                this.tracker[championId].skinCount += 1;
            });
          }

          this.championIds.sort((IdA: string, IdB: string) =>
            this.tracker[IdA].champion.name < this.tracker[IdB].champion.name
              ? -1
              : 1,
          );
        },
      );
    });

    this.getLoots();
  }

  public getChampion(summonerId: number, championId: string) {
    return this.lcuService.getChampion(summonerId, championId);
  }

  public getLoots() {
    return this.lcuService.getLoots().subscribe((loots: Loot[]) => {
      loots.forEach((loot: Loot) => {
        if (loot.displayCategories == DisplayCategories.skin) {
          const championId = loot.storeItemId
            .toString()
            .substring(0, loot.storeItemId.toString().length - 3);

          if (loot.parentItemStatus == ItemStatus.owned)
            this.tracker[championId].unlockable.push(loot.itemDesc);
        }
      });

      this.getMasteries(this.summoner.summonerId);
    });
  }

  public getChampionUnlockedSkins(championId: string) {
    if (
      this.tracker[championId] &&
      this.tracker[championId].champion &&
      this.tracker[championId].champion.skins
    )
      return this.tracker[championId].champion.skins.filter(
        (skin: Skin) => skin.ownership.owned && !skin.isBase,
      );

    return [];
  }

  public getChampionUnlockableSkins(championId: string) {
    if (
      this.tracker[championId] &&
      this.tracker[championId].champion &&
      this.tracker[championId].champion.skins
    )
      return this.tracker[championId].champion.skins.filter((skin: Skin) =>
        this.tracker[championId].unlockable.some(
          (skinName: string) => skin.name === skinName,
        ),
      );

    return [];
  }

  public changeFilter(filterType: FilterType, value: string | boolean) {
    switch (filterType) {
      case FilterType.name:
        this.filter.name = value as string;
        break;
      case FilterType.unlockable:
        this.filter.unlockable = value as boolean;
        break;
      case FilterType.noSkins:
        this.filter.noSkins = value as boolean;
        break;
      case FilterType.noMastery:
        this.filter.noMastery = value as boolean;
        break;
    }

    this.applyFilter();
  }

  public applyFilter() {
    this.filteredChampionIds = this.championIds
      .filter((championId: string) =>
        this.tracker[championId] &&
        this.tracker[championId].champion &&
        this.tracker[championId].champion.name
          ? this.tracker[championId].champion.name
              .toLowerCase()
              .includes(this.filter.name.toLowerCase())
          : true,
      )
      .filter((championId: string) =>
        this.filter.unlockable
          ? this.tracker[championId].unlockable.length
          : true,
      )
      .filter((championId: string) =>
        this.filter.noSkins ? this.tracker[championId].skinCount === 0 : true,
      )
      .filter((championId: string) =>
        this.filter.noMastery
          ? this.tracker[championId].mastery.championPointsUntilNextLevel !== 0
          : true,
      );
  }

  public initForm() {
    this.form = new FormGroup({
      name: new FormControl(''),
      unlockable: new FormControl(''),
      noSkins: new FormControl(''),
      noMastery: new FormControl(''),
    });
  }

  public subscribeToFormChanges() {
    this.form.controls['name'].valueChanges.subscribe((name: string) => {
      this.changeFilter(FilterType.name, name);
    });

    this.form.controls['unlockable'].valueChanges.subscribe(
      (unlockable: boolean) => {
        this.changeFilter(FilterType.unlockable, unlockable);
      },
    );

    this.form.controls['noSkins'].valueChanges.subscribe((noSkins: boolean) => {
      this.changeFilter(FilterType.noSkins, noSkins);
    });

    this.form.controls['noMastery'].valueChanges.subscribe(
      (noMastery: boolean) => {
        this.changeFilter(FilterType.noMastery, noMastery);
      },
    );
  }

  public openModal(championId: string) {
    this.modalService.openModal({
      tracker: this.tracker,
      championId: championId,
    });
  }

  public getMasteries(summonerId: number) {
    return this.lcuService
      .getMasteries(summonerId)
      .subscribe((masteries: Mastery[]) => {
        masteries.forEach((mastery: Mastery) => {
          this.tracker[mastery.championId].mastery = mastery;
        });

        this.loading = false;
      });
  }
}
