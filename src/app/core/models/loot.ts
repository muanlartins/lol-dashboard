import { DisplayCategories } from '../enums/displayCategories';
import { ItemStatus } from '../enums/itemStatus';

export interface Loot {
  displayCategories: DisplayCategories;
  storeItemId: number;
  parentItemStatus: ItemStatus;
  itemDesc: string;
}
