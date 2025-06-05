import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from '@/pages/provider/Dashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('Dashboard', () => {
  it('renders dashboard stats', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Dashboard />
      </QueryClientProvider>
    );

    // Wait for stats to load
    await waitFor(() => {
      expect(screen.getByText('Total Jobs')).toBeInTheDocument();
      expect(screen.getByText('156')).toBeInTheDocument();
      expect(screen.getByText('Active Jobs')).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();
      expect(screen.getByText('Completed Jobs')).toBeInTheDocument();
      expect(screen.getByText('148')).toBeInTheDocument();
      expect(screen.getByText('Total Earnings')).toBeInTheDocument();
      expect(screen.getByText('₦1,250,000')).toBeInTheDocument();
      expect(screen.getByText('Average Rating')).toBeInTheDocument();
      expect(screen.getByText('4.8')).toBeInTheDocument();
    });
  });

  it('renders recent jobs', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Dashboard />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Recent Jobs')).toBeInTheDocument();
      expect(screen.getByText('Plumbing Service')).toBeInTheDocument();
      expect(screen.getByText('₦15,000')).toBeInTheDocument();
    });
  });

  it('renders upcoming jobs', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Dashboard />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Upcoming Jobs')).toBeInTheDocument();
      expect(screen.getByText('Electrical Repair')).toBeInTheDocument();
      expect(screen.getByText('₦20,000')).toBeInTheDocument();
    });
  });
}); 