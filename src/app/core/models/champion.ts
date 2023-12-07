import { Ownership } from './ownership';
import { Skin } from './skin';

export interface Champion {
  ownership: Ownership;
  skins: Skin[];
  name: string;
  baseLoadScreenPath: string;
  baseLoadScreen: string;
  title: string;
}
