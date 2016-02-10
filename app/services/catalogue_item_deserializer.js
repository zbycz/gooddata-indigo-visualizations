import { first, pick } from 'lodash';

const BASIC_PROPS = ['title', 'summary', 'identifier', 'uri'];

function pickBasicProps(item) {
    return pick(item.meta, BASIC_PROPS);
}

function deserializeFact(fact) {
    return pickBasicProps(fact);
}

function deserializeMetric(metric) {
    let basicProps = pickBasicProps(metric);
    let metricProps = pick(metric.content, ['expression', 'format']);

    return Object.assign({}, basicProps, metricProps);
}

function deserializeAttribute(attribute) {
    let basicProps = pickBasicProps(attribute);
    let displayForm = first(attribute.content.displayForms);
    let attributeProps = {
        dimensionUri: attribute.content.dimension,
        granularity: attribute.meta.identifier,
        elementsUri: displayForm.links.elements,
        dfIdentifier: displayForm.meta.identifier,
        dfUri: displayForm.meta.uri,
        dateType: attribute.content.type
    };

    return Object.assign({}, basicProps, attributeProps);
}

function deserializeDimension(dimension) {
    let basicProps = pickBasicProps(dimension);
    let dimensionProps = {
        attributes: dimension.content.attributes.map(deserializeAttribute)
    };

    return Object.assign({}, basicProps, dimensionProps);
}

const DESERIALIZERS = {
    fact: deserializeFact,
    metric: deserializeMetric,
    attribute: deserializeAttribute,
    dimension: deserializeDimension
};

function deserializeItem(item) {
    let type = first(Object.keys(item));
    let props = DESERIALIZERS[type](item[type]);

    return Object.assign({}, props, {
        type,
        id: props.identifier,
        isAvailable: true
    });
}

export default function deserializeItems(items) {
    return items.map(deserializeItem);
}
