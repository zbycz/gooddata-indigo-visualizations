import {
    getLineChartConfiguration
} from '../src/highChartsCreators';

describe('chartCreators', () => {
    describe('Line chart configuration', () => {
        describe('zoomable chart', () => {
            it('should not be zoomable by default', () => {
                const chartOptions = {};

                const configuration = getLineChartConfiguration(chartOptions);
                expect(configuration.chart.zoomType).not.to.be.ok();
            });

            it('should turn on zoomable chart when requested', () => {
                const chartOptions = {
                    zoomable: true
                };

                const configuration = getLineChartConfiguration(chartOptions);
                expect(configuration.chart.zoomType).to.equal('x');
            });
        });
    });
});
