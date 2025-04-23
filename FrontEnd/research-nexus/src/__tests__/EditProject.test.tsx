/*import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import EditProject from '../components/EditProject';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import React from 'react';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockProject = {
  success: true,
  project: {
    title: 'AI in Healthcare',
    description: 'Researching AI applications in diagnostics.',
    research_goals: 'Improve diagnostic accuracy using ML.',
    research_area: 'Artificial Intelligence',
    start_date: '2025-05-01',
    end_date: '2025-12-31',
    funding_available: true,
    funding_amount: '5000',
    collaborators_needed: true,
    collaborator_roles: 'ML Engineer, Data Scientist',
    institution: 'MIT',
    contact_email: 'ai@mit.edu'
  }
};

const renderWithRouter = () => {
  window.history.pushState({}, 'Edit project', '/projects/123/edit');
  return render(
    <BrowserRouter>
      <EditProject />
    </BrowserRouter>
  );
};

describe('EditProject Component', () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({ data: mockProject });
  });

  it('renders loading spinner initially', async () => {
    renderWithRouter();
    expect(screen.getByText(/loading project data/i)).toBeInTheDocument();
  });

  it('renders form with loaded project data', async () => {
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByDisplayValue(/AI in Healthcare/)).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/Project Title/i)).toHaveValue('AI in Healthcare');
    expect(screen.getByLabelText(/Funding Available/i)).toBeChecked();
    expect(screen.getByDisplayValue('5000')).toBeInTheDocument();
  });

  it('shows funding amount input when fundingAvailable is checked', async () => {
    renderWithRouter();
    await waitFor(() => screen.getByLabelText(/Funding Amount/i));
    expect(screen.getByDisplayValue('5000')).toBeInTheDocument();
  });

  it('submits updated form data', async () => {
    mockedAxios.put.mockResolvedValue({ data: { success: true } });
    
    renderWithRouter();
    await waitFor(() => screen.getByLabelText(/Project Title/i));
    
    fireEvent.change(screen.getByLabelText(/Project Title/i), { target: { value: 'Updated Title' } });
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(mockedAxios.put).toHaveBeenCalledWith(
        'http://localhost:8081/api/projects/123/update',
        expect.objectContaining({ title: 'Updated Title' }),
        expect.any(Object)
      );
    });
  });

  it('displays error if fetch fails', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));
    renderWithRouter();
    await waitFor(() => screen.getByText(/server error/i));
  });
});
*/