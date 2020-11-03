const config={
    production :{
        SECRET: process.env.SECRET,
        DATABASE: process.env.MONGODB_URI
    },
    default : {
        SECRET: 'mysecretkey',
        DATABASE: 'mongodb+srv://davidbiton2:123456789ddd333@cluster33.emxbm.mongodb.net/Ajami'
    }
}


exports.get = function get(env){
    return config[env] || config.default
}