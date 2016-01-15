import AppContextReducer from './app_context_reducers';
import DataReducer from './data_reducer';
import BucketsReducer from './buckets_reducer';

import { compose } from '../utils/reducers';

export default compose([AppContextReducer, DataReducer, BucketsReducer]);
