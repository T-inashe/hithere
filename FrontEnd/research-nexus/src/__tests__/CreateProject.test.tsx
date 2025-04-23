/* import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateProject from '../components/CreateProject';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Wrap component in router context
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('CreateProject', () => {
  beforeEach(() => {
    mockedAxios.post.mockClear();
  });

  test('renders the create project form', () => {
    renderWithRouter(<CreateProject />);
    expect(screen.getByText(/Create New Research Project/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Project Title/i)).toBeInTheDocument();
  });

  test('shows validation errors on empty submission', async () => {
    renderWithRouter(<CreateProject />);
    const submitBtn = screen.getByRole('button', { name: /create project/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getAllByText(/Please provide/i).length).toBeGreaterThan(0);
    });
  });

  test('allows user to fill inputs and checks checkbox behavior', () => {
    renderWithRouter(<CreateProject />);
    fireEvent.change(screen.getByLabelText(/Project Title/i), { target: { value: 'AI Project' } });
    fireEvent.click(screen.getByLabelText(/Funding Available/i));
    fireEvent.click(screen.getByLabelText(/Seeking Collaborators/i));

    expect(screen.getByDisplayValue('AI Project')).toBeInTheDocument();
    expect(screen.getByLabelText(/Funding Amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Collaborator Roles Needed/i)).toBeInTheDocument();
  });

  test('submits form and navigates on success', async () => {
    mockedAxios.post.mockResolvedValue({ data: { success: true } });

    renderWithRouter(<CreateProject />);
    fireEvent.change(screen.getByLabelText(/Project Title/i), { target: { value: 'AI Project' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Research on AI' } });
    fireEvent.change(screen.getByLabelText(/Research Goals/i), { target: { value: 'Advance AI' } });
    fireEvent.change(screen.getByLabelText(/Research Area/i), { target: { value: 'Artificial Intelligence' } });
    fireEvent.change(screen.getByLabelText(/Start Date/i), { target: { value: '2025-05-01' } });
    fireEvent.change(screen.getByLabelText(/End Date/i), { target: { value: '2025-06-01' } });

    const submitBtn = screen.getByRole('button', { name: /create project/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:8081/api/projects/create',
        expect.objectContaining({ title: 'AI Project' }),
        { withCredentials: true }
      );
    });
  });
});
*/