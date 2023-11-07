const Set  = require('./Set');
const User  = require('../user/User');

exports.createSet = async (req, res) => {
  try {
    const { owner, name, description, status, questions } = req.body;

    const newSet = new Set({
      owner,
      name,
      description,
      status,
      questions,
    });

    await newSet.save();

    res.status(201).json({ set: newSet });
  } catch (error) {
    console.error('Error creando conjunto de preguntas:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.editSetById = async (req, res) => {
  try {
    const { owner, name, description, status, questions } = req.body;
    const { id } = req.params; 

    const updatedSet = {
      owner,
      name,
      description,
      status,
      questions,
    };

    
    const updatedSetDocument = await Set.findByIdAndUpdate(id, updatedSet, {
      new: true, 
    });

    if (!updatedSetDocument) {
      return res.status(404).json({ message: 'Conjunto de preguntas no encontrado' });
    }

    res.status(200).json({ set: updatedSetDocument });
  } catch (error) {
    console.error('Error editando conjunto de preguntas:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.listSets = async (req, res) => {
  try {
    const sets = await Set.find().populate("owner")
      .sort({ date: 'desc' })
      .where('status').equals('active')
      .exec();

    res.status(200).json({ sets });
  } catch (error) {
    console.error('Error al listar los sets:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

exports.listRequest = async (req, res) => {
  try {
    const sets = await Set.find().populate("owner")
      .sort({ date: 'desc'  })
      .where('status').equals('inactive')
      .exec();

    res.status(200).json({ sets });
  } catch (error) {
    console.error('Error al listar los sets:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};


exports.getSetById = async (req, res) => {
  try {
    const { setId } = req.params;
    
    const set = await Set.findById(setId);

    if (!set) {
      return res.status(404).json({ message: 'Set no encontrado' });
    }

    res.status(200).json({ set });
  } catch (error) {
    console.error('Error al obtener el set por ID:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

exports.deleteSetById = async (req, res) => {
  const { setId } = req.params;

  try {
    const deletedSet = await Set.findByIdAndRemove(setId);

    if (!deletedSet) {
      return res.status(404).json({ error: 'Conjunto no encontrado' });
    }

    res.json({ message: 'Conjunto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el conjunto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


exports.searchSets = async (req, res) => {
  try {
    const { filter } = req.params; 
    let query = { status: 'active' }; 

    if (filter) {
      const keywords = filter.split(' ').map((keyword) => ({
        $or: [
          { description: { $regex: keyword, $options: 'i' } }, 
          { 'questions.question': { $regex: keyword, $options: 'i' } }, 
          { 'questions.hint': { $regex: keyword, $options: 'i' } }, 
          { name: { $regex: keyword, $options: 'i' } }, 
        ],
      }));

      query.$or = keywords;
    }

    const sets = await Set.find(query);

    res.json(sets);
  } catch (error) {
    console.error('Error al buscar conjuntos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.searchSetsInactive = async (req, res) => {
  try {
    const { filter } = req.params; 
    let query = { status: 'inactive' }; 

    if (filter) {
      const keywords = filter.split(' ').map((keyword) => ({
        $or: [
          { description: { $regex: keyword, $options: 'i' } }, 
          { 'questions.question': { $regex: keyword, $options: 'i' } }, 
          { 'questions.hint': { $regex: keyword, $options: 'i' } }, 
          { name: { $regex: keyword, $options: 'i' } }, 
        ],
      }));

      query.$or = keywords;
    }

    const sets = await Set.find(query);

    res.json(sets);
  } catch (error) {
    console.error('Error al buscar conjuntos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


exports.changeSetStatus = async (req, res) => {
  try {
    const { setId, accepted } = req.body;

    if (typeof accepted !== 'boolean') {
      return res.status(400).json({ error: 'El valor de "accepted" debe ser un booleano.' });
    }

    const set = await Set.findById(setId);

    if (!set) {
      return res.status(404).json({ error: 'Conjunto de preguntas no encontrado.' });
    }

    set.status = accepted ? 'active' : 'inactive';
    await set.save();

    return res.status(200).json({ message: `El conjunto de preguntas se ha ${accepted ? 'activado' : 'desactivado'} exitosamente.` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Hubo un error al cambiar el estado del conjunto de preguntas.' });
  }
};


