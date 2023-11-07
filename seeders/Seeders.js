const Rol = require("../src/api/rol/Rol");

exports.addRoles = async () => {
  try {
    const result = await Rol.create(
      { name: "Admin" },
      { name: "User" },
      { name: "Leader" }
    );
    console.log("Roles add successfully:", result);
  } catch (error) {
    console.error("Error adding roles:", error);
  } finally {
    console.log("Finish");
  }
};
