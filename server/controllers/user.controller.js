import User from "../models/user.model.js";

const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ _id: id }).populate("listings");

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Funkcja pobierania wszystkich użytkowników z paginacją (dla admina)
const getAllUsers = async (req, res) => {
  try {
    const { username, email, page = 1, limit = 10 } = req.query;

    const query = {};

    if (username) {
      query.username = { $regex: username, $options: "i" };
    }

    if (email) {
      query.email = { $regex: email, $options: "i" };
    }

    // Paginacja
    const usersCount = await User.countDocuments(query);
    const totalPages = Math.ceil(usersCount / limit);
    const users = await User.find(query)
      .select("-password") // Wykluczenie hasła z wyników
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      users,
      totalPages,
      currentPage: parseInt(page),
      totalUsers: usersCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const dbUser = await User.findById(id);

    if (!dbUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Sprawdzenie, czy aktualizujący użytkownik jest właścicielem konta
    if (req.user._id !== dbUser._id.toString()) {
      return res.status(401).json({ message: "You can't update user" });
    }

    // Destrukturyzacja danych z ciała żądania
    const {
      email,
      firstName,
      lastName,
      companyName,
      address,
      avatar,
      telephone,
      password,
    } = req.body;

    const errors = {}; // Inicjalizacja obiektu do zbierania błędów

    if (email && email !== dbUser.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        errors.email = "Email jest już zarejestrowany";
      }
    }

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (companyName) updateData.companyName = companyName;
    if (address) updateData.address = address;
    if (telephone) updateData.telephone = telephone;

    const tempUser = new User(updateData);
    const validationError = tempUser.validateSync();
    if (validationError) {
      Object.keys(validationError.errors).forEach((key) => {
        errors[key] = validationError.errors[key].message;
      });
    }

    if (errors["password"]) delete errors["password"];
    if (errors["username"]) delete errors["username"];
    if (errors["email"]) delete errors["email"];

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    if (password) {
      const hashedPassword = bcryptjs.hashSync(password, 10);
      updateData.password = hashedPassword;
    }

    if (req.file) {
      const avatarImg = `/img/avatars/${req.file.filename}`;
      updateData.avatar = avatarImg;
    }

    const updatedUserData = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).select("-password");

    const { password: pw, ...restData } = updatedUserData._doc;

    res.status(200).json(restData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getUser, getAllUsers, updateUser };
