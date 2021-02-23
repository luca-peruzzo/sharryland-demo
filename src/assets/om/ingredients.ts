import { Hops } from './hops';
import { Malt } from './malt';

export interface Ingredients {
    malt: Malt[];
    hops: Hops[];
    yeast: string;

}
