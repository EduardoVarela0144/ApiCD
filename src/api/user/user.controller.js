const User = require("./User");
const bcrypt = require("bcryptjs");
const axios = require("axios");

exports.createUser = async (req, res) => {
  try {
    const { rol, name, lastName, img, linkedinURL, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "El ususrio ya existe" });
    }

    const newUser = new User({
      rol,
      name,
      lastName,
      img,
      linkedinURL,
      email,
      password,
    });

    await newUser.save();


    const user = await User.findById(newUser._id).populate("rol");

    res.status(201).json({ user });

  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.editUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, lastName, img, linkedinURL, email } = req.body;

    console.log(name);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        lastName,
        img,
        linkedinURL,
        email,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error("Error editando usuario:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { password } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    user.password = password;
    await user.save();

    res.status(200).json({ message: "Contraseña cambiada con éxito" });
  } catch (error) {
    console.error("Error cambiando contraseña:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const query = req.query.q;
    const page = parseInt(req.query.page) || 1;
    const perPage = 5;
    const startIndex = (page - 1) * perPage;
    const endIndex = page * perPage;

    const filter = {};

    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } }, // Búsqueda insensible a mayúsculas y minúsculas en el nombre
        { email: { $regex: query, $options: "i" } }, // Búsqueda insensible a mayúsculas y minúsculas en el correo
      ];
    }

    const users = await User.find(filter).skip(startIndex).limit(perPage);

    const hasNextPage = endIndex < (await User.countDocuments(filter));

    res.status(200).json({
      users,
      currentPage: page,
      hasNextPage,
    });
  } catch (error) {
    console.error("Error obteniendo la lista de usuarios:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error obteniendo usuario por ID:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const deletedUser = await User.findByIdAndRemove(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ message: "Usuario eliminado con éxito" });
  } catch (error) {
    console.error("Error eliminando usuario:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).populate("rol");
    if (!user) {
      return res
        .status(404)
        .json({ message: "Correo y contraseña incorrectos" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error de inicio de sesión:", error);
    res.status(500).json({ message: "Error de servidor" });
  }
};

exports.getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error obteniendo usuario por email:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

exports.linkedinLogin = async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ error: 'Falta el parámetro "code".' });
  }

  console.log(process.env.CLIENTID);
  const clientID = process.env.CLIENTID;
  const clientSecret = process.env.CLIENTSECRET;

  try {
    const tokenResponse = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      null,
      {
        params: {
          grant_type: "authorization_code",
          code,
          redirect_uri: process.env.REDIRECT_URI,
          client_id: clientID,
          client_secret: clientSecret,
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    const profileResponse = await axios.get(
      "https://api.linkedin.com/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const linkedinData = profileResponse.data;

    res.status(200).json(linkedinData);
  } catch (error) {
    console.error("Error al obtener datos de LinkedIn:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
