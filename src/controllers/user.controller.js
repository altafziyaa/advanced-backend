import userService from "../service/user.service.js";
import customError from "../utils/ErrorHandling.js";

class UserController {
  async createUser(req, res, next) {
    try {
      const { name, email, password, age, role } = req.body;

      if (!name || !email || !password) {
        return next(new customError("Name, Email & Password required", 400));
      }
      const makeUser = await userService.createUser(
        name,
        email,
        password,
        age,
        role
      );

      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: makeUser,
      });
    } catch (error) {
      next(error);
    }
  }

  async logIn(req, res, next) {
    try {
      const { email, password } = req.body;
      const loginUsers = await userService.login(email, password);
      res.status(200).json({
        success: true,
        message: "login successfully",
        data: loginUsers,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUser(req, res, next) {
    try {
      const { userId } = req.params;

      const getProfile = await userService.getUser(userId);
      res.status(200).json({
        success: true,
        message: "get profile successfully",
        data: getProfile,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllUser(req, res, next) {
    try {
      const getAll = await userService.getAllUsers();
      res.status(200).json({
        success: true,
        message: "All get Successfully",
        data: getAll,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { userId } = req.params;
      if (!userId) throw new Error("User ID required for remove user");

      const delUser = await userService.deleteUser(userId);

      res.status(200).json({
        success: true,
        message: "deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async updUser(req, res, next) {
    try {
      const { userId } = req.params;
      const userData = req.body;
      const updatedUser = await userService.updateUser(userId, userData);
      res.status(201).json({
        success: true,
        message: "updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
