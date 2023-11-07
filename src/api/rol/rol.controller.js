const Rol = require("./Rol");

exports.createRol = async (req, res) => {
  try {
    const { name } = req.body;

    const newRol = new Rol({ name });

    await newRol.save();

    res.status(201).json({ rol: newRol });
  } catch (error) {
    console.error("Error creating rol:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

exports.editRol = async (req, res) => {
  try {
    const { rolId } = req.params;
    const { name } = req.body;

    const updatedRol = await Rol.findByIdAndUpdate(
      rolId,
      { name },
      { new: true }
    );

    if (!updatedRol) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }

    res.status(200).json({ rol: updatedRol });
  } catch (error) {
    console.error("Error editing rol:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

exports.deleteRol = async (req, res) => {
  try {
    const { rolId } = req.params;

    const deletedRol = await Rol.findByIdAndRemove(rolId);

    if (!deletedRol) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }

    res.status(200).json({ message: "Rol eliminado exitosamente" });
  } catch (error) {
    console.error("Error deleting rol:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

exports.getRolById = async (req, res) => {
  try {
    const { rolId } = req.params;

    const rol = await Rol.findById(rolId);

    if (!rol) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }

    res.status(200).json({ rol });
  } catch (error) {
    console.error("Error getting rol by ID:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

exports.listRoles = async (req, res) => {
  try {
    const roles = await Rol.find();

    res.status(200).json({ roles });
  } catch (error) {
    console.error("Error listing roles:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

exports.getRolByName = async (req, res) => {
  try {
    const { name } = req.params;

    const rol = await Rol.findOne({ name });

    if (!rol) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }

    res.status(200).json({ rol });
  } catch (error) {
    console.error("Error getting rol by name:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
