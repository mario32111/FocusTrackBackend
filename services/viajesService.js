const { db } = require('../fire');

const COLLECTION = 'viajes';
const SUB_COLLECTION = 'eventos_viaje';

// ========================
// VIAJES (CRUD)
// ========================

/**
 * Crear un nuevo viaje
 */
const crearViaje = async (data) => {
    const viajeData = {
        id_conductor: data.id_conductor,
        id_empresa: data.id_empresa,
        fecha: data.fecha || new Date(),
        hora_inicio: data.hora_inicio || new Date(),
        hora_fin: data.hora_fin || null,
        tiempo_estimado: data.tiempo_estimado || null,
        score_final_viaje: data.score_final_viaje || null,
    };

    const docRef = await db.collection(COLLECTION).add(viajeData);
    return { id_viaje: docRef.id, ...viajeData };
};

/**
 * Obtener todos los viajes
 */
const obtenerViajes = async () => {
    const snapshot = await db.collection(COLLECTION).orderBy('fecha', 'desc').get();
    const viajes = [];
    snapshot.forEach((doc) => {
        viajes.push({ id_viaje: doc.id, ...doc.data() });
    });
    return viajes;
};

/**
 * Obtener viajes por conductor
 */
const obtenerViajesPorConductor = async (idConductor) => {
    const snapshot = await db
        .collection(COLLECTION)
        .where('id_conductor', '==', idConductor)
        .orderBy('fecha', 'desc')
        .get();
    const viajes = [];
    snapshot.forEach((doc) => {
        viajes.push({ id_viaje: doc.id, ...doc.data() });
    });
    return viajes;
};

/**
 * Obtener viajes por empresa
 */
const obtenerViajesPorEmpresa = async (idEmpresa) => {
    const snapshot = await db
        .collection(COLLECTION)
        .where('id_empresa', '==', idEmpresa)
        .orderBy('fecha', 'desc')
        .get();
    const viajes = [];
    snapshot.forEach((doc) => {
        viajes.push({ id_viaje: doc.id, ...doc.data() });
    });
    return viajes;
};

/**
 * Obtener un viaje por su ID
 */
const obtenerViajePorId = async (id) => {
    const doc = await db.collection(COLLECTION).doc(id).get();
    if (!doc.exists) return null;
    return { id_viaje: doc.id, ...doc.data() };
};

/**
 * Actualizar un viaje (ej. cerrar sesión con hora_fin y score_final)
 */
const actualizarViaje = async (id, data) => {
    const docRef = db.collection(COLLECTION).doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return null;
    await docRef.update(data);
    return { id_viaje: id, ...doc.data(), ...data };
};

/**
 * Eliminar un viaje
 */
const eliminarViaje = async (id) => {
    const docRef = db.collection(COLLECTION).doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return null;
    await docRef.delete();
    return { id_viaje: id, mensaje: 'Viaje eliminado correctamente' };
};

// ========================
// EVENTOS DE VIAJE (Sub-colección)
// ========================

/**
 * Agregar un evento a un viaje
 */
const crearEventoViaje = async (idViaje, data) => {
    const eventoData = {
        timestamp: data.timestamp || new Date(),
        tipo: data.tipo, // "IMU", "IA", "BPM"
        datos: data.datos, // Mapa dinámico según el tipo
    };

    const docRef = await db
        .collection(COLLECTION)
        .doc(idViaje)
        .collection(SUB_COLLECTION)
        .add(eventoData);

    return { id_evento: docRef.id, id_viaje: idViaje, ...eventoData };
};

/**
 * Obtener todos los eventos de un viaje
 */
const obtenerEventosViaje = async (idViaje) => {
    const snapshot = await db
        .collection(COLLECTION)
        .doc(idViaje)
        .collection(SUB_COLLECTION)
        .orderBy('timestamp', 'asc')
        .get();

    const eventos = [];
    snapshot.forEach((doc) => {
        eventos.push({ id_evento: doc.id, ...doc.data() });
    });
    return eventos;
};

/**
 * Obtener eventos de un viaje filtrados por tipo
 */
const obtenerEventosPorTipo = async (idViaje, tipo) => {
    const snapshot = await db
        .collection(COLLECTION)
        .doc(idViaje)
        .collection(SUB_COLLECTION)
        .where('tipo', '==', tipo)
        .orderBy('timestamp', 'asc')
        .get();

    const eventos = [];
    snapshot.forEach((doc) => {
        eventos.push({ id_evento: doc.id, ...doc.data() });
    });
    return eventos;
};

/**
 * Obtener un evento específico de un viaje
 */
const obtenerEventoPorId = async (idViaje, idEvento) => {
    const doc = await db
        .collection(COLLECTION)
        .doc(idViaje)
        .collection(SUB_COLLECTION)
        .doc(idEvento)
        .get();

    if (!doc.exists) return null;
    return { id_evento: doc.id, id_viaje: idViaje, ...doc.data() };
};

/**
 * Eliminar un evento de un viaje
 */
const eliminarEventoViaje = async (idViaje, idEvento) => {
    const docRef = db
        .collection(COLLECTION)
        .doc(idViaje)
        .collection(SUB_COLLECTION)
        .doc(idEvento);

    const doc = await docRef.get();
    if (!doc.exists) return null;
    await docRef.delete();
    return { id_evento: idEvento, mensaje: 'Evento eliminado correctamente' };
};

module.exports = {
    // Viajes
    crearViaje,
    obtenerViajes,
    obtenerViajesPorConductor,
    obtenerViajesPorEmpresa,
    obtenerViajePorId,
    actualizarViaje,
    eliminarViaje,
    // Eventos de viaje
    crearEventoViaje,
    obtenerEventosViaje,
    obtenerEventosPorTipo,
    obtenerEventoPorId,
    eliminarEventoViaje,
};
