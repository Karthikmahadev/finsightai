import User from "../models/User";


export const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
  
    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
  
    if (!isMatch)
      return res.status(400).json({ message: "Wrong old password" });
  
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
  
    res.json({ message: "Password changed successfully" });
  };
  