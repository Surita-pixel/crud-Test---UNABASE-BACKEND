import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../src/app';
import Proyecto from '../src/models/Proyecto';
import Movimiento from '../src/models/Movimiento';
import Linea from '../src/models/Linea';
import Usuario from '../src/models/Usuario';
import jwt from 'jsonwebtoken';

describe('API Endpoints', () => {
    let token;
    let userId;

    beforeAll(async () => {
        userId = new mongoose.Types.ObjectId();
        token = jwt.sign({ id: userId }, process.env.JWT_SECRET);
    });

    beforeEach(async () => {
        await Proyecto.deleteMany({});
        await Movimiento.deleteMany({});
        await Linea.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('Proyectos endpoints', () => {
        describe('POST /proyectos', () => {
            it('debería crear un nuevo proyecto', async () => {
                const proyectoData = {
                    nombre: 'Proyecto Test',
                };

                const response = await request(app)
                    .post('/proyectos')
                    .set('Authorization', `Bearer ${token}`)
                    .send(proyectoData);

                expect(response.status).toBe(201);
                expect(response.body.proyecto.nombre).toBe(proyectoData.nombre);
                expect(response.body.proyecto.creator.toString()).toBe(userId.toString());
            });

            it('debería fallar sin token de autorización', async () => {
                const response = await request(app)
                    .post('/proyectos')
                    .send({});

                expect(response.status).toBe(401);
            });
        });

        describe('GET /proyectos', () => {
            it('debería obtener los proyectos del usuario', async () => {
                const proyecto = await Proyecto.create({
                    nombre: 'Proyecto Test',
                    creator: userId
                });

                const response = await request(app)
                    .get('/proyectos')
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(200);
                expect(response.body).toHaveLength(1);
                expect(response.body[0]._id.toString()).toBe(proyecto._id.toString());
            });
        });
        describe('DELETE /proyectos', () => {
            it('debería eliminar un proyecto y sus dependencias', async () => {
                const proyecto = await Proyecto.create({
                    nombre: 'Proyecto Test',
                    creator: userId
                });

                const response = await request(app)
                    .delete(`/proyectos`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ ids: [proyecto._id] });

                expect(response.status).toBe(200);
                expect(await Proyecto.findById(proyecto._id)).toBeNull();
            });
        });

    });
    describe('Movimiento endpoints', () => {

        describe('POST /movimientos', () => {
            let proyectoId;

            beforeEach(async () => {
                const proyecto = await Proyecto.create({
                    nombre: 'Proyecto Test',
                    creator: userId,
                });
                proyectoId = proyecto._id.toString(); // Guardar el id del proyecto
            });

            it('debería crear un nuevo movimiento', async () => {
                const response = await request(app)
                    .post('/movimientos')
                    .set('Authorization', `Bearer ${token}`)
                    .send({ name: 'Movimiento Nuevo', proyecto: proyectoId });

                expect(response.status).toBe(201);
                expect(response.body.movimiento.name).toBe('Movimiento Nuevo');
            });

            it('debería fallar si falta el campo proyecto', async () => {
                const response = await request(app)
                    .post('/movimientos')
                    .set('Authorization', `Bearer ${token}`)
                    .send({ name: 'Movimiento sin Proyecto' });

                expect(response.status).toBe(400);
                expect(response.body.error).toBe('El campo proyecto es obligatorio');
            });
        });

        describe('GET /movimientos/:proyectoId', () => {
            let proyectoId;

            beforeEach(async () => {
                const proyecto = await Proyecto.create({
                    nombre: 'Proyecto Test',
                    creator: userId,
                });
                proyectoId = proyecto._id.toString();
            });

            it('debería obtener los movimientos por proyecto', async () => {
                const response = await request(app)
                    .get(`/movimientos/${proyectoId}`)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(200);
                expect(Array.isArray(response.body)).toBe(true);
            });
        });
        describe('DELETE /movimientos', () => {
            let movimiento;

            beforeEach(async () => {
                const proyecto = await Proyecto.create({
                    nombre: 'Proyecto Test',
                    creator: userId,
                });

                movimiento = await Movimiento.create({
                    name: 'Movimiento Test',
                    proyecto: proyecto._id,
                });
            });

            it('debería eliminar movimientos por ids', async () => {
                const response = await request(app)
                    .delete('/movimientos')
                    .set('Authorization', `Bearer ${token}`)
                    .send({ ids: [movimiento._id] });

                expect(response.status).toBe(200);
                expect(response.body.mensaje).toContain('movimiento(s) eliminado(s) con éxito');
            });

            it('debería fallar si no se envían ids', async () => {
                const response = await request(app)
                    .delete('/movimientos')
                    .set('Authorization', `Bearer ${token}`)
                    .send({ ids: [] });

                expect(response.status).toBe(400);
                expect(response.body.error).toBe('Se requiere un array de IDs para eliminar movimientos');
            });
        });


    })
    describe('Líneas endpoints', () => {
        let linea;
        beforeEach(async () => {
            const movimiento = await Movimiento.create({ name: 'Movimiento Test', proyecto: new mongoose.Types.ObjectId(), numbers: {} });
            linea = await Linea.create({
                name: 'Línea Test',
                movimiento: movimiento._id,
                creator: userId,
                numbers: {
                    sumPrice: { number: 100, value: '$100.00' },
                    sumBudget: { number: 200, value: '$200.00' },
                    budgetUtility: { number: 100, value: '$100.00' },
                    budgetMargin: { number: 50, value: '50.00%' },
                },
            });
        });

        describe('POST /lineas', () => {
            it('debería crear una nueva línea', async () => {
                const lineaData = {
                    name: 'Línea Nueva',
                    movimientoId: linea.movimiento.toString(),
                };

                const response = await request(app)
                    .post('/lineas')
                    .set('Authorization', `Bearer ${token}`)
                    .send(lineaData);

                expect(response.status).toBe(201);
                expect(response.body.linea.name).toBe(lineaData.name);
            });
        });

        describe('PUT /lineas/:id', () => {
            it('debería actualizar una línea correctamente', async () => {
                const updatedLineaData = {
                    sumPrice: 150,
                    sumBudget: 250,
                };

                const response = await request(app)
                    .put(`/lineas/${linea._id}`)
                    .set('Authorization', `Bearer ${token}`)
                    .send(updatedLineaData);

                expect(response.status).toBe(200);
                expect(response.body.mensaje).toBe('Valores de línea y cálculos en movimiento y proyecto actualizados con éxito');

                const retrievedLinea = await Linea.findById(linea._id);
                expect(retrievedLinea.numbers.sumPrice.number).toBe(updatedLineaData.sumPrice);
                expect(retrievedLinea.numbers.sumBudget.number).toBe(updatedLineaData.sumBudget);
            });


            it('debería fallar si la línea no existe', async () => {
                const nonExistentId = new mongoose.Types.ObjectId();

                const response = await request(app)
                    .put(`/lineas/${nonExistentId}`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ sumPrice: 150, sumBudget: 250 });

                expect(response.status).toBe(404);
                expect(response.body.error).toBe('Línea no encontrada');
            });


        });
    });
    

});