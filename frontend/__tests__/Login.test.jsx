import { vi } from 'vitest'; // Import Vitest's mocking library
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axiosInstance from '../src/utils/axiosInstance';
import Login from './../src/pages/Auth/Login';

vi.mock('../src/utils/axiosInstance'); // Mock axiosInstance

describe('Login Component', () => {
    test('renders Login form and handles submission', async () => {
        axiosInstance.post.mockResolvedValue({
            data: { token: 'fake-token', role: 'user' },
        });

        render(
            // <MemoryRouter>
                <Login />
            // </MemoryRouter>
        );

        // Test rendering
        expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();

        // Test form interactions
        fireEvent.change(screen.getByLabelText(/Email Address/i), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByLabelText(/Password/i), {
            target: { value: 'password123' },
        });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        // Wait for the mock response (if async behavior is involved)
        expect(axiosInstance.post).toHaveBeenCalledWith('/auth/login', {
            email: 'test@example.com',
            password: 'password123',
        });
    });
});