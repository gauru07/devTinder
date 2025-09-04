const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || "mongodb+srv://gaurav07:V62wwa0TymQGMzjq@project1.jr3ma.mongodb.net/devTinder";
        
        console.log('🔍 Attempting to connect to MongoDB...');
        console.log('📍 Connection string:', mongoURI.replace(/\/\/.*@/, '//***:***@'));
        
        await mongoose.connect(mongoURI);
        
        console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
        console.log(`📊 Database: ${mongoose.connection.name}`);
    } catch (error) {
        console.error('❌ Database connection error:', error.message);
        
        if (error.code === 8000) {
            console.error('🔐 Authentication failed - Check username/password');
        } else if (error.code === 'ENOTFOUND') {
            console.error('🌐 Network error - Check internet connection');
        } else if (error.code === 'ETIMEDOUT') {
            console.error('⏰ Connection timeout - Check MongoDB Atlas status');
        }
        
        console.log('⚠️  Continuing without database connection...');
        console.log('💡 API endpoints will not work until database is connected');
    }
};

module.exports = connectDB;


