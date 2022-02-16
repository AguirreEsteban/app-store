const { Schema, model } = require('mongoose')
const bcrypt = require('bcryptjs')
const mongoosePaginate = require('mongoose-paginate-v2');


const User = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String
    },
    curriculum: {
        type: String,
        required: true
    },
    store: {
        type: Schema.Types.ObjectId,
        ref: 'Store'
    },
    state: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['admin', 'seller', 'client']
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    dni: {
        number: {
            type: String
        },
        type: {
            type: String,
            enum: ['C.C', 'T.E', 'P.P']
        }
    },
    description: {
        type: String
    },
    address: {
        country: {
            type: String
        },
        city: {
            Type: String
        },
        streetAddress: {
            type: String
        }
    },
    phone: {
        type: String
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})



User.pre('save', function save(next) {
    try {
        const rounds = process.env.NODE_ENV === 'development' ? 1 : 10;
        const hash = bcrypt.hashSync(this.password, bcrypt.genSaltSync(rounds))
        this.password = hash;

        return next();
    } catch (error) {
        return next(error);
    }
})

User.methods = {

    passwordMatches(password) {
        return bcrypt.compare(password, this.password);
    }
}

User.statics = {
    async validaterUser(options) {
        const { email, password } = options;
        if (!email) return null;

        const user = await this.findOne({ email }).exec();
        const err = {
            success: false
        };
        if (user.state == false) {
            err.info = 'Su usuario no esta activo'
            return err;
        }
        if (password) {
            if (user && await user.passwordMatches(password)) {
                return { success: true, user };
            }
            err.info = 'Correo o contraseña incorrecta';
        }
        return err;
    }
}

User.plugin(mongoosePaginate);
module.exports = model('User', User)