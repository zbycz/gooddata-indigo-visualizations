import {
    calculateFluidLegend,
    calculateStaticLegend,
    ITEM_HEIGHT,
    RESPONSIVE_ITEM_MIN_WIDTH,
    LEGEND_PADDING
} from '../helpers';

describe('helpers', () => {
    describe('calculateFluidLegend', () => {
        context('2 columns layout', () => {
            const containerWidth = 500;

            it('should show 4 items with paging for 10 series', () => {
                const {
                    hasPaging,
                    visibleItemsCount
                } = calculateFluidLegend(10, containerWidth);
                expect(hasPaging).to.eql(true);
                expect(visibleItemsCount).to.eql(4);
            });

            it('should show 4 items without paging for 4 series', () => {
                const {
                    hasPaging,
                    visibleItemsCount
                } = calculateFluidLegend(4, containerWidth);
                expect(hasPaging).to.eql(false);
                expect(visibleItemsCount).to.eql(4);
            });
        });

        context('3 columns layout', () => {
            const containerWidth = 700;

            it('should show 6 items with paging for 10 series', () => {
                const {
                    hasPaging,
                    visibleItemsCount
                } = calculateFluidLegend(10, containerWidth);
                expect(hasPaging).to.eql(true);
                expect(visibleItemsCount).to.eql(6);
            });

            it('should show 6 items without paging for 6 series', () => {
                const {
                    hasPaging,
                    visibleItemsCount
                } = calculateFluidLegend(6, containerWidth);
                expect(hasPaging).to.eql(false);
                expect(visibleItemsCount).to.eql(6);
            });
        });

        context('overlapping columns', () => {
            const containerWidth =
                (3 * RESPONSIVE_ITEM_MIN_WIDTH) + 1
                + (2 * LEGEND_PADDING);

            it('should not show paging for 5 items', () => {
                const {
                    hasPaging,
                    visibleItemsCount
                } = calculateFluidLegend(6, containerWidth);
                expect(hasPaging).to.eql(false);
                expect(visibleItemsCount).to.eql(6);
            });

            it('should show paging for 7 items', () => {
                const {
                    hasPaging,
                    visibleItemsCount
                } = calculateFluidLegend(7, containerWidth);
                expect(hasPaging).to.eql(true);
                expect(visibleItemsCount).to.eql(4);
            });
        });
    });

    describe('calculateStaticLegend', () => {
        it('should show paging if needed', () => {
            const itemsCount = 10;
            const containerHeight = itemsCount * ITEM_HEIGHT;
            let legendObj = calculateStaticLegend(itemsCount, containerHeight);

            expect(legendObj.hasPaging).to.eql(false);
            expect(legendObj.visibleItemsCount).to.eql(10);

            legendObj = calculateStaticLegend(itemsCount, containerHeight - ITEM_HEIGHT);

            expect(legendObj.hasPaging).to.eql(true);
            expect(legendObj.visibleItemsCount).to.eql(6);
        });
    });
});
