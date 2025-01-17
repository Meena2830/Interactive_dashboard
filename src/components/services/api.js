// Mock API service
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mockApiResponse = async (data) => {
  await delay(800); // Simulate network delay

  // 5% chance of error
  if (Math.random() > 0.95) {
    throw new Error("API Error: Failed to fetch data");
  }

  return data;
};

export const api = {
  async login(credentials) {
    // Simulating a database of users (can be expanded as needed)
    const mockUsersDatabase = [
      {
        id: "1",
        name: "John Doe",
        email: "john.doe@example.com",
        token: "mock-jwt-token-johndoe",
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        token: "mock-jwt-token-janesmith",
      },
    ];

    await delay(1000); // Simulate server response time

    // Validate credentials
    const user = mockUsersDatabase.find((u) => u.email === credentials.email);

    if (!user) {
      throw new Error(
        "Invalid credentials. Please check your email and try again."
      );
    }

    return user; // Return the matched user object
  },

  async fetchDashboardData(dateRange) {
    const generateMockData = (days) => {
      return Array.from({ length: days }, (_, i) => ({
        date: new Date(
          Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000
        ).toLocaleDateString(),
        sales: Math.floor(Math.random() * 10000),
        users: Math.floor(Math.random() * 1000),
        pageViews: Math.floor(Math.random() * 50000),
        activeUsers: Math.floor(Math.random() * 500),
        newSignups: Math.floor(Math.random() * 50),
      }));
    };

    const days = dateRange === "week" ? 7 : dateRange === "month" ? 30 : 365;
    const data = generateMockData(days);

    console.log("Generated mock data:", data); // Log generated data
    return mockApiResponse(data);
  },
};
