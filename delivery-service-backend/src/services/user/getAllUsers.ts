import User from '../../models/User';

const getAllUsers = async (): Promise<any[]> => {
  try {
    return await User.find(); // Fetch all users
  } catch (error) {
    throw new Error('Error fetching users');
  }
};

export { getAllUsers };
