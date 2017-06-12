import { parseKinds } from '../storybook_utils';

describe('parseKinds', () => {
    it('should parse kinds with stories', () => {
        const kinds = parseKinds(`
            import { storiesOf } from '@storybook/react';

            storiesOf('Test kind')
                .add('storyOne', () => {})
                .add('storyTwo', () => {})

            storiesOf('Test kind 2')
                .add('storyThree')
                .add('storyFour')
        `);
        expect(kinds).toEqual(
            [
                {
                    kind: 'Test kind',
                    stories: [
                        'storyOne',
                        'storyTwo'
                    ]
                }, {
                    kind: 'Test kind 2',
                    stories: [
                        'storyThree',
                        'storyFour'
                    ]
                }
            ]
        );
    });

    it('should return empty for data without stories', () => {
        const kinds = parseKinds(`
            import { storiesOf } from '@storybook/react';
        `);
        expect(kinds).toEqual([]);
    });
});
