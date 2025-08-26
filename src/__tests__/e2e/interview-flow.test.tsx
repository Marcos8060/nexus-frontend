import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import interviewReducer from '@/redux/features/interviewSlice';
import DashboardPage from '@/app/dashboard/page';

// Mock the API calls
jest.mock('@/lib/api', () => ({
  interviewApi: {
    getInterviews: jest.fn(() => Promise.resolve([
      {
        id: '1',
        filename: 'test.mp4',
        original_name: 'Test Interview',
        file_size: 1000,
        file_path: '/test',
        upload_date: '2024-01-01',
        status: 'completed',
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      }
    ])),
    uploadInterview: jest.fn(),
    getInterview: jest.fn(),
    transcribeInterview: jest.fn(),
    deleteInterview: jest.fn(),
  }
}));

// Create a test store
const createTestStore = () => {
  return configureStore({
    reducer: {
      interview: interviewReducer,
    },
  });
};

describe('Interview Flow E2E', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
  });

  it('should display dashboard with interview data', async () => {
    render(
      <Provider store={store}>
        <DashboardPage />
      </Provider>
    );

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText('Interview Analytics')).toBeInTheDocument();
    });

    // Check if interview data is displayed
    expect(screen.getByText('Test Interview')).toBeInTheDocument();
    expect(screen.getByText('completed')).toBeInTheDocument();
  });

  it('should show loading state initially', () => {
    render(
      <Provider store={store}>
        <DashboardPage />
      </Provider>
    );

    // Initially should show loading or empty state
    expect(screen.getByText('Interview Analytics')).toBeInTheDocument();
  });

  it('should display correct metrics', async () => {
    render(
      <Provider store={store}>
        <DashboardPage />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Total Interviews')).toBeInTheDocument();
    });

    // Check if metrics are calculated correctly
    expect(screen.getByText('1')).toBeInTheDocument(); // Total interviews
  });
});
