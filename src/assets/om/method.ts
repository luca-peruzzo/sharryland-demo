import { Domain } from './domain';
import { MashTemp } from './mashTemp';

export interface Method {
    mash_temp: MashTemp[];
    fermentation: {
        temp: Domain;
    };
    twist: string;

}
