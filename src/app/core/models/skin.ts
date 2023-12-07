import { Ownership } from './ownership';

export interface Skin {
  ownership: Ownership;
  isBase: boolean;
  name: string;
  tile: string;
  tilePath: string;
  splashPath: string;
  splash: string;
  uncenteredSplashPath: string;
  uncenteredSplash: string;
  loadScreenPath: string;
  loadScreen: string;
}
