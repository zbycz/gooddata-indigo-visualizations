import * as StatePaths from '../constants/StatePaths';

export function isError(appState) {
    return appState.getIn(StatePaths.ERRORS).size > 0;
}
