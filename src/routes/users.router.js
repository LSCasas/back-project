const express = require('express');
const createError = require('http-errors');  // Importa createError
const userUseCase = require('../usecases/users.usecase');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, profilePic, email, password } = req.body;

    // Verificamos si el usuario ya existe
    const existingUser = await userUseCase.getByEmail(email);
    if (existingUser) {
      throw createError(400, 'El correo electrónico ya está en uso');
    }

    const userCreated = await userUseCase.create({ name, profilePic, email, password });
    res.status(201).json({
      success: true,
      data: { user: userCreated },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Ruta para obtener información de un usuario por id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userUseCase.getById(id);
    if (!user) {
      throw createError(404, 'Usuario no encontrado');
    }
    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;



