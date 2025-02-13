import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Base de datos conectada');
    } catch (err) {
        console.error('Error conectando a la BD:', err);
        process.exit(1);
    }
};

export default connectDB;