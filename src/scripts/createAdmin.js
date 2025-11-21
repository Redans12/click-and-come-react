const bcrypt = require('bcryptjs');
const { supabase } = require('../config/supabaseClient');

async function createAdmin() {
  try {
    // 1. Datos del admin
    const adminData = {
      nombre: 'Administrador',
      email: 'admin@clickandcome.com',
      password: 'Admin123!', // Cambia esto por la contraseña que quieras
      telefono: '4431234567',
      rol: 'admin',
    };

    // 2. Hashear la contraseña
    console.log('🔐 Hasheando contraseña...');
    const passwordHash = await bcrypt.hash(adminData.password, 10);

    // 3. Insertar usuario
    console.log('👤 Creando usuario administrador...');
    const { data, error } = await supabase
      .from('usuarios')
      .insert([
        {
          nombre: adminData.nombre,
          email: adminData.email,
          password_hash: passwordHash,
          telefono: adminData.telefono,
          rol: adminData.rol,
          esta_bloqueado: false,
        },
      ])
      .select();

    if (error) {
      console.error('❌ Error creando admin:', error);
      return;
    }

    console.log('\n✅ ¡Usuario administrador creado exitosamente!\n');
    console.log('📧 Email:', adminData.email);
    console.log('🔑 Contraseña:', adminData.password);
    console.log('👤 Rol:', adminData.rol);
    console.log('\n🎯 Ahora puedes iniciar sesión en: http://localhost:3000/login\n');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createAdmin();