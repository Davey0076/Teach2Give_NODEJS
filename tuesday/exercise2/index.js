const logEvents = require('./LogEvents')
const EventEmitter = require('events')
const eventEmitter = new EventEmitter()

eventEmitter.on('log', (message) =>{
    logEvents(message)
})

setTimeout(() => {
    eventEmitter.emit('log', 'New log event triggered')
}, 2000)