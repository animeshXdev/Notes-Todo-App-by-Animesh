import mongoose from 'mongoose'

export const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.Mongo_URI as string)
        console.log('Connected to MongoDB')
    } catch (error) {
        console.error('Error connecting to MongoDB:', error)
    }
}
