import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import { renderHook } from '@testing-library/react';
import { useUser } from './UserContext.tsx';

import { JSDOM } from 'jsdom';

let dom: JSDOM;
const previousWindow = globalThis.window;
const previousDocument = globalThis.document;

before(() => {
  dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
  globalThis.window = dom.window as any;
  globalThis.document = dom.window.document;
});

after(() => {
  dom.window.close();

  if (previousWindow === undefined) {
    delete globalThis.window;
  } else {
    globalThis.window = previousWindow;
  }

  if (previousDocument === undefined) {
    delete globalThis.document;
  } else {
    globalThis.document = previousDocument;
  }
});

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
