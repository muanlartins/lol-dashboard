import { Champion } from './champion';
import { Mastery } from './masteries';

export interface Tracker {
  [championId: string]: {
    owned: boolean;
    skinCount: number;
    unlockable: string[];
    champion: Champion;
    mastery?: Mastery;
  };
}
