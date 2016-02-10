/* eslint no-console: 0 */
'use strict';

import _ from 'lodash';
import invariant from 'invariant';
import { xhr } from 'gooddata';
import Promise from 'bluebird';

import * as Paths from '../constants/StatePaths';
import store from '../store';

let projectId = () => store.getState().getIn(['appState'].concat(Paths.PROJECT_ID));

export default {
    logUri() {
        let pid = projectId();
        invariant(pid, 'Missing project ID.');
        return `/gdc/app/projects/${pid}/log`;
    },

    log(message, params) {
        let messages = [this.serializeMessage(message, params)];

        if (DEBUG && !TESTING) {
            return this.logDebug(messages);
        }

        return this.logProduction(messages);
    },

    logDebug(messages) {
        let log = (message) => console.debug('log:', message);
        messages.forEach(log);

        return Promise.resolve();
    },

    logProduction(messages) {
        let uri = this.logUri();

        return Promise.resolve(xhr.ajax(uri, {
            type: 'POST',
            data: { logMessages: messages }
        }));
    },

    serializeMessage(message, params) {
        return _.keys(_.omit(params, _.isNil)).reduce(function(result, key) {
            var value = params[key],
                logKey = _.snakeCase(key);

            return `${result} ${logKey}=${value}`;
        }, message);
    }
};
