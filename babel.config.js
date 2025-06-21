module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    '@legendapp/state/babel',
    'transform-inline-environment-variables',
    ['babel-plugin-react-docgen-typescript', { exclude: 'node_modules' }],
    'react-native-reanimated/plugin',
  ],
};
