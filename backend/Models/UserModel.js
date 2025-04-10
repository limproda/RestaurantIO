import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
      email: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true
      },
      name: {                       
        type: String,
        required: true
      },
      lastName: {                   
        type: String,
        required: true
      },
      role: {                       
        type: String,
        enum: ['Administrador', 'Empleado'],
        default: 'Empleado'
      },
      phone: {                      
        type: String,
        required: true
      },
      bornDate: {            
        type: Date
      },
      createdAt: {       
        type: Date,
        default: Date.now
      },
      employeesNumber: {            
        type: Number,
        default: 0
      },
      hireDate: {          
        type: Date
      },
      paymentDate: {                 
        type: Date
      },
    
      timeRecord: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TimeRecord'
      }],
      
      payRoll: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payroll'
      }]
    });
    
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    return next(err);
  }
});

export default mongoose.model("User", userSchema);