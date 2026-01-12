/**
 * Mock Service Worker (MSW) browser setup.
 *
 * Responsibilities:
 * - Initializes MSW worker for browser environment.
 * - Registers all request handlers used for API mocking.
 *
 * Note:
 * This file is used only in development mode when API mocking
 * is explicitly enabled via environment configuration.
 */
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

/**
 * MSW worker instance.
 *
 * Note:
 * setupWorker creates a Service Worker that intercepts
 * network requests at the browser level.
 *
 * All mocked API behavior is defined in `handlers`,
 * keeping this file focused purely on initialization.
 */
export const worker = setupWorker(...handlers);