// Copyright (C) 2007-2015, GoodData(R) Corporation. All rights reserved.

'use strict';

import Immutable from 'immutable';
import { getCatalogueItemClassName } from '../CatalogueItem.jsx';

describe('getCatalogueItemClassName', function() {
    it('should return correct class for date', function() {
        var item = Immutable.fromJS({ type: 'date', identifier: 'foobar' });
        expect(getCatalogueItemClassName(item)).to.eql('s-date');
    });

    it('should return correct class for other item types', function() {
        var item = Immutable.fromJS({ identifier: 'foobar' });
        expect(getCatalogueItemClassName(item)).to.eql('s-id-foobar');
    });
});
