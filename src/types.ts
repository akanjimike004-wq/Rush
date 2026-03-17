export interface Task {
  id: string;
  platform: 'Instagram' | 'Twitter' | 'YouTube' | 'TikTok' | 'Facebook';
  type: 'Like' | 'Follow' | 'Comment' | 'Subscribe' | 'Share';
  reward: number;
  description: string;
  url: string;
  status: 'available' | 'completed' | 'pending';
  proofUrl?: string;
  proofUsername?: string;
  submittedAt?: string;
}

export interface Withdrawal {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  fee: number;
  netAmount: number;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  completedTasks: number;
  isPaid: boolean;
  role: 'user' | 'admin';
  status: 'active' | 'pending' | 'suspended';
  subscriptionExpiry?: string;
  bankDetails?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    lastUpdated: string;
  };
  recentActivity: {
    id: string;
    type: string;
    amount: number;
    timestamp: string;
  }[];
}
