import React, { Component } from 'react';
import Promise from 'bluebird';
import classNames from 'classnames';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import pureRender from 'pure-render-decorator';

import BucketItem from './BucketItem';

@pureRender
export default class Bucket extends Component {
    static propTypes = {
        bucket: React.PropTypes.shape({ get: React.PropTypes.func }),
        onToggleCollapse: React.PropTypes.func,
        onShowBubble: React.PropTypes.func
    };

    getBucketClasses(props) {
        return classNames(
            'adi-bucket',
            {
                'bucket-with-warn-message': props.displayStackWarn,
                's-bucket-empty': !!props.isEmpty,
                's-bucket-not-empty': !props.isEmpty,
                'has-rounded-corners': props.hasReplaceableSlot
            },
            this.nameClass()
        );
    }

    getHeaderClasses(props) {
        return classNames(
            'bucket-title',
            's-bucket-title',
            'bucket-title-' + this.keyName() + '-' + props.visualizationType,
            this.nameClass() + '-title'
        );
    }

    keyName() {
        return this.props.bucket.get('keyName');
    }

    nameClass() {
        return 's-bucket-' + this.keyName();
    }

    renderHeader(props) {
        return (
            <div className={this.getHeaderClasses(props)}>
                <div className="bucket-title-icon"></div>
                <h3>
                    <FormattedMessage
                        id={'dashboard.bucket.' + this.keyName() + '_title.' + props.visualizationType}
                    />
                </h3>
            </div>
        );
    }

    renderError(props) {
        return (props.errorMessage ? <div className="gd-bucket-error">{props.errorMessage}</div> : false);
    }

    renderContents(props) {
        let items = props.bucket.get('items');
        return (
            <div className="bucket-contents">
                {items.size ?
                    <ul>
                        {items.map((item, idx) => (
                            <BucketItem
                                key={idx}
                                bucketItem={item}
                                attributesLoader={() => Promise.resolve({ attributes: [] })}
                                {...props}
                            />
                        )).toJS()}
                    </ul> :
                    <div className="empty"></div>
                }
                <div className={{ invisible: items.get('hasSlotsLeft') }}>
                    <hr className="adi-bucket-invitation-separator" />
                    <div
                        className="bubbleTitle mouseoverTrigger adi-bucket-invitation-outer s-bucket-dropzone"
                        data-bubbletitlealignpoints="cr cl"
                        title={props.dropZoneTitle}
                    >
                        <div className="adi-bucket-invitation">
                            <div className="adi-bucket-invitation-inner">
                                {props.acceptsDraggedObject ?
                                    <FormattedMessage id="dashboard.bucket.drop" /> :
                                    <FormattedHTMLMessage id={'dashboard.bucket.' + props.bucket.get('keyName') + '_add_placeholder'} />
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    renderWarning(props) {
        let warn = props.displayStackWarn;
        return (warn ? <div className="adi-stack-warn s-stack-warn">{props.stackWarnMsg}</div> : false);
    }

    render() {
        let props = this.props;
        return (
            <div className={this.getBucketClasses(props)}>
                {this.renderHeader(props)}
                {this.renderError(props)}
                {this.renderContents(props)}
                {this.renderWarning(props)}
            </div>
        );
    }
}
