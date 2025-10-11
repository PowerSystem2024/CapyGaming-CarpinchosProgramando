import pool from './bd/pool.js';

console.log('Intentando conectar a la base de datos...');

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error al conectar:', err);
    } else {
        console.log('Conexión exitosa! Hora del servidor:', res.rows[0].now);
    }
    pool.end();
});