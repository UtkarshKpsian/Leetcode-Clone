const {createClient}=require('redis');

const redisclient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-13546.c14.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 13546
    }
});


module.exports=redisclient;