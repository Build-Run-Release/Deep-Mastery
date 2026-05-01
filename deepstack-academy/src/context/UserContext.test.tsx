import { test, describe } from 'node:test';
import assert from 'node:assert';
import { renderHook } from '@testing-library/react';
import { useUser } from './UserContext.tsx';

import { JSDOM } from 'jsdom';
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.window = dom.window as any;
global.document = dom.window.document;

describe('useUser hook', () => {
  test('throws an error when used outside of UserProvider', () => {
    // We suppress console.error for this test to avoid noisy expected errors
    const originalError = console.error;
    console.error = () => {};

    try {
      assert.throws(
        () => {
          renderHook(() => useUser());
        },
        /useUser must be used within UserProvider/
      );
    } finally {
      console.error = originalError;
    }
  });
});
