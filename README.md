# gdc-indigo-visualizations

Indigo Visualizations in React

## Development
This repository uses react-storybook, run `yarn run storybook` & see the examples

## Testing
Run `grunt test` in console

## Release

  1. Switch to master branch `git checkout master`
  2. Synchronize from upstream `git tag -l | xargs git tag -d; git fetch upstream; git reset --hard upstream/master`
  3. Create new version `npm version [major|minor|patch] -m "Release v%s"`
  4. Push to upstream `git push --tags upstream master`
  5. Release `npm publish --access=restricted`
