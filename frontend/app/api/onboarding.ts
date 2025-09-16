export const getInitialData = async (userId: string) => {
  // In a real app, this would fetch existing user data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '',
        location: '',
        profilePhoto: '',
        servicePreferences: []
      });
    }, 500);
  });
};

export const completeOnboarding = async (data: any) => {
  // In a real app, this would send data to your backend
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Onboarding completed:', data);
      resolve({ success: true });
    }, 1000);
  });
};