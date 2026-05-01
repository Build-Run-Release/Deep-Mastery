import 'global-jsdom/register';
import React from 'react';
import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';

import { UserProvider, useUser } from './UserContext';

function TestComponent() {
  const { isAuthenticated, user, level, xp, login, logout, addXp } = useUser();
  return (
    <div>
        <div data-testid="auth">{isAuthenticated.toString()}</div>
        <div data-testid="level">{level.toString()}</div>
        <div data-testid="xp">{xp.toString()}</div>
        <button onClick={() => login({ id: '1', name: 'Test', email: 'test@example.com', xp: 150, level: 2, isPremium: false })}>Login</button>
        <button onClick={logout}>Logout</button>
        <button onClick={() => addXp(50)}>Add XP</button>
    </div>
  );
}

describe('UserProvider', () => {
    beforeEach(() => {
        globalThis.fetch = async (url: string) => {
            if (url === '/api/auth/me') {
                return { json: async () => ({ authenticated: false, user: null }) } as Response;
            }
            if (url === '/api/auth/logout') {
                return { ok: true } as Response;
            }
            if (url === '/api/progress/xp') {
                return { ok: true } as Response;
            }
            return { ok: true } as Response;
        };
    });

    afterEach(() => {
        cleanup();
        globalThis.fetch = undefined as any;
    });

    test('UserProvider defaults', async () => {
        render(<UserProvider><TestComponent /></UserProvider>);
        await waitFor(() => {
             assert.strictEqual(screen.getByTestId('auth').textContent, 'false');
        });
        assert.strictEqual(screen.getByTestId('level').textContent, '1');
        assert.strictEqual(screen.getByTestId('xp').textContent, '0');
    });

    test('UserProvider loads from server', async () => {
        globalThis.fetch = async (url: string) => {
             if (url === '/api/auth/me') {
                 return { json: async () => ({ authenticated: true, user: { id: '1', name: 'Test', email: 'test@example.com', xp: 150, level: 2, isPremium: false } }) } as Response;
             }
             return { ok: true } as Response;
        };
        render(<UserProvider><TestComponent /></UserProvider>);
        await waitFor(() => {
            assert.strictEqual(screen.getByTestId('auth').textContent, 'true');
        });
        assert.strictEqual(screen.getByTestId('level').textContent, '2');
        assert.strictEqual(screen.getByTestId('xp').textContent, '150');
    });

    test('UserProvider login', async () => {
        render(<UserProvider><TestComponent /></UserProvider>);
        fireEvent.click(screen.getByText('Login'));
        await waitFor(() => {
             assert.strictEqual(screen.getByTestId('auth').textContent, 'true');
             assert.strictEqual(screen.getByTestId('level').textContent, '2');
             assert.strictEqual(screen.getByTestId('xp').textContent, '150');
        });
    });

    test('UserProvider logout', async () => {
        globalThis.fetch = async (url: string) => {
             if (url === '/api/auth/me') {
                 return { json: async () => ({ authenticated: true, user: { id: '1', name: 'Test', email: 'test@example.com', xp: 150, level: 2, isPremium: false } }) } as Response;
             }
             if (url === '/api/auth/logout') {
                 return { ok: true } as Response;
             }
             return { ok: true } as Response;
        };
        render(<UserProvider><TestComponent /></UserProvider>);
        await waitFor(() => {
             assert.strictEqual(screen.getByTestId('auth').textContent, 'true');
        });
        fireEvent.click(screen.getByText('Logout'));
        await waitFor(() => {
             assert.strictEqual(screen.getByTestId('auth').textContent, 'false');
        });
    });

    test('UserProvider addXp', async () => {
        globalThis.fetch = async (url: string) => {
             if (url === '/api/auth/me') {
                 return { json: async () => ({ authenticated: true, user: { id: '1', name: 'Test', email: 'test@example.com', xp: 150, level: 2, isPremium: false } }) } as Response;
             }
             if (url === '/api/progress/xp') {
                 return { ok: true } as Response;
             }
             return { ok: true } as Response;
        };
        render(<UserProvider><TestComponent /></UserProvider>);
        await waitFor(() => {
             assert.strictEqual(screen.getByTestId('xp').textContent, '150');
        });

        fireEvent.click(screen.getByText('Add XP'));
        await waitFor(() => {
             assert.strictEqual(screen.getByTestId('xp').textContent, '200');
        });
        assert.strictEqual(screen.getByTestId('level').textContent, '3');
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
