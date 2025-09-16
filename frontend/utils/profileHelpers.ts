    export const getVerificationLevelText = (level: number): string => {
  switch (level) {
    case 0: return 'Unverified';
    case 1: return 'Basic Verification';
    case 2: return 'Identity Verified';
    case 3: return 'Fully Verified';
    default: return 'Unknown';
  }
};

export const formatJoinDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
  }).format(date);
};

export const calculateProfileCompleteness = (user: any, profile: any): number => {
  let completeness = 0;
  const totalFields = user.role === 'worker' ? 12 : 8;

  // Basic fields
  if (user.name) completeness++;
  if (user.email) completeness++;
  if (user.phone) completeness++;
  if (user.is_verified) completeness++;

  if (user.role === 'worker') {
    // Worker specific fields
    if (profile?.businessName) completeness++;
    if (profile?.description) completeness++;
    if (profile?.services?.length > 0) completeness++;
    if (profile?.skills?.length > 0) completeness++;
    if (profile?.experience) completeness++;
    if (profile?.hourlyRate) completeness++;
    if (profile?.serviceArea) completeness++;
    if (profile?.workingHours) completeness++;
  } else {
    // Client specific fields
    if (profile?.bio) completeness++;
    if (profile?.categories?.length > 0) completeness++;
    if (profile?.budgetRange) completeness++;
    if (profile?.notifications) completeness++;
  }

  return Math.round((completeness / totalFields) * 100);
};
