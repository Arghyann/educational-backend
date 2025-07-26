import mongoose from 'mongoose';
const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subscription name is required'],
        trim: true, 
        minlength: [3, 'Subscription name must be at least 3 characters long'],
        maxlength: [100, 'Subscription name must not exceed 100 characters'],},

        price: {
            type: Number,
            required: [true, 'Subscription price is required'],
            min: [0, 'Subscription price must be positive'],
        },

        currency: {
            type: String,   
            enum: ['USD', 'EUR', 'GBP', 'INR'], // Add more currencies as needed
            required: [true, 'Currency is required'],   
            default: 'INR', // Default currency
        },

        frequency: {
            type: String,
            enum: ['daily', 'weekly','monthly', 'yearly'], // Subscription frequency options
            required: [true, 'Subscription frequency is required'],
        },
        category: {
            type: String,
            enum: ['sports', 'news', 'entertainment','lifestyle'], // Subscription category options
            required: [true, 'Subscription category is required'],
        },

        paymentMethod: {
            type: String,
            trim: true, // Payment method options
            required: [true, 'Payment method is required'],
        },
        status: {
            type: String,
            enum: ['active', 'expired', 'cancelled'], // Subscription status options
            default: 'active', // Default status
        },

        startDate: {
            type: Date,
            required: [true, 'Start date is required'],
            validate: {
                validator: function(value) {
                    return value <= Date.now(); // Start date must be in the past or present
                },
                message: 'Start date must be in the past or present',
            },
        },
        renewalDate: {
            type: Date,
            
            validate: {
                validator: function(value) {
                    return value > this.startDate; // Renewal date must be after start date
                },
                message: 'Renewal date must be after start date',
            },
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model
            required: [true, 'User ID is required'],
            index: true, // Index for faster lookups
        },


    }.options({ timestamps: true })); // Automatically manage createdAt and updatedAt fields
    
;
subscriptionSchema.pre('save', function(next) {
    if (!this.renewalDate) {
        const frequencyMap = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        };
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + frequencyMap[this.frequency]);
    }
    if(this.renewalDate <= new Date()) {
        this.status = 'expired'; // Automatically set status to expired if renewal date is in the past
    }
    next();
});
const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
