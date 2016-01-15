import { Map } from 'immutable';

export function indexBy(iterable, searchKey) {
    return iterable.reduce((memo, item) => memo.set(item.get(searchKey), item), Map());
}
