import User from "../../models/User";

const deleteUser = async (userId: string): Promise<string> => {
  try {
    const deletedUser = await User.findByIdAndDelete(userId); // Delete user by ID
    if (!deletedUser) {
      throw new Error('User not found');
    }
    return 'User deleted successfully';
  } catch (error) {
    throw error;
  }
};

export default deleteUser;
