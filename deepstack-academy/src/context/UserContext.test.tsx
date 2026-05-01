import 'global-jsdom/register';
import React from 'react';
import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

import { UserProvider, useUser } from './UserContext';

function TestComponent() {
  const { isAuthenticated, level, xp, login, logout, addXp } = useUser();
  return (
    <div>
        <div data-testid="auth">{isAuthenticated.toString()}</div>
        <div data-testid="level">{level.toString()}</div>
        <div data-testid="xp">{xp.toString()}</div>
        <button onClick={login}>Login</button>
        <button onClick={logout}>Logout</button>
        <button onClick={() => addXp(50)}>Add XP</button>
    </div>
  );
}

describe('UserProvider', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        cleanup();
    });

    test('UserProvider defaults', () => {
        render(<UserProvider><TestComponent /></UserProvider>);
        assert.strictEqual(screen.getByTestId('auth').textContent, 'false');
        assert.strictEqual(screen.getByTestId('level').textContent, '1');
        assert.strictEqual(screen.getByTestId('xp').textContent, '0');
    });

    test('UserProvider loads from localStorage', () => {
        localStorage.setItem('auth', 'true');
        localStorage.setItem('xp', '150');
        render(<UserProvider><TestComponent /></UserProvider>);
        assert.strictEqual(screen.getByTestId('auth').textContent, 'true');
        assert.strictEqual(screen.getByTestId('level').textContent, '2');
        assert.strictEqual(screen.getByTestId('xp').textContent, '150');
    });

    test('UserProvider login', () => {
        render(<UserProvider><TestComponent /></UserProvider>);
        fireEvent.click(screen.getByText('Login'));
        assert.strictEqual(screen.getByTestId('auth').textContent, 'true');
        assert.strictEqual(localStorage.getItem('auth'), 'true');
    });

    test('UserProvider logout', () => {
        localStorage.setItem('auth', 'true');
        render(<UserProvider><TestComponent /></UserProvider>);
        fireEvent.click(screen.getByText('Logout'));
        assert.strictEqual(screen.getByTestId('auth').textContent, 'false');
        assert.strictEqual(localStorage.getItem('auth'), null);
    });

    test('UserProvider addXp', () => {
        render(<UserProvider><TestComponent /></UserProvider>);
        fireEvent.click(screen.getByText('Add XP'));
        assert.strictEqual(screen.getByTestId('xp').textContent, '50');
        assert.strictEqual(screen.getByTestId('level').textContent, '1');
        assert.strictEqual(localStorage.getItem('xp'), '50');

        fireEvent.click(screen.getByText('Add XP'));
        assert.strictEqual(screen.getByTestId('xp').textContent, '100');
        assert.strictEqual(screen.getByTestId('level').textContent, '2');
        assert.strictEqual(localStorage.getItem('xp'), '100');
    });
});

test('useUser throws error if not inside UserProvider', () => {
    let error: Error | undefined;
    const OriginalConsoleError = console.error;
    console.error = () => {};
    try {
        render(<TestComponent />);
    } catch (e) {
        error = e as Error;
    }
    console.error = OriginalConsoleError;
    assert.strictEqual(error?.message, 'useUser must be used within UserProvider');
});
