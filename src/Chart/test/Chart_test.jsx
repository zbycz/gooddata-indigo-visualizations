import Highcharts from 'highcharts';
import React from 'react';

import { mount } from 'enzyme';

import Chart from '../Chart';

describe('Chart', () => {
    function createComponent(props = {}) {
        return mount(<Chart config={{}} {...props} />);
    }

    it('should render highcharts', () => {
        const spy = sinon.spy(Highcharts, 'Chart');
        const wrapper = createComponent();
        const component = wrapper.component.getInstance();
        expect(component.chart).to.be.ok();
        expect(spy).to.be.calledOnce();
    });

    it('should rerender highcharts on props change', () => {
        const createChart = sinon.spy(Chart.prototype, 'createChart');
        const wrapper = createComponent();
        expect(createChart).to.be.calledOnce();
        wrapper.setProps({ config: { foo: 'bar' } });
        expect(createChart).to.be.calledTwice();
        Chart.prototype.createChart.restore();
    });

    it('should call callback on componentDidMount', () => {
        const callback = sinon.spy();
        createComponent({ callback });
        expect(callback).to.be.calledOnce();
    });

    it('should call destroy callback on componentWillUnmount', () => {
        const wrapper = createComponent();
        const component = wrapper.component.getInstance();
        component.chart.destroy = sinon.spy();

        component.componentWillUnmount();
        expect(component.chart.destroy).to.be.calledOnce();
    });
});
