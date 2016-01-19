import * as MessagesUtils from '../messages';

describe('Message utils', () => {
    describe('flattenMessages', () => {
        it('should flatten messages correctly', () => {
            const messages = {
                buttons: {
                    save: {
                        value: 'save',
                        title: 'save title'
                    },
                    load: 'load'
                },
                saving: 'saving'
            };

            const expectedFlattened = {
                'buttons.save.value': 'save',
                'buttons.save.title': 'save title',
                'buttons.load': 'load',
                'saving': 'saving'
            };

            expect(MessagesUtils.flattenMessages(messages)).to.eql(expectedFlattened);
        });
    });
});
