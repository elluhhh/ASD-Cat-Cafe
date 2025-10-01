module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(test).js'],
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'test-results/jest',
      outputName: 'junit.xml'
    }]
  ],
};