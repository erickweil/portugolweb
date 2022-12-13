import {jest,describe,expect,test} from '@jest/globals';

const sum = (a,b) => a + b;

describe('sum module', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
  });
});