describe('CI scenario test', () => {
  it('should pass the CI scenario', () => {
    expect('Hello World').toBe('Hello World');
  });

  it('should fail only for the failure demonstration', () => {
    if (process.env.CI_SCENARIO === 'failure') {
      expect('Hello World').toBe('Intentional CI failure');
    }
  });
});