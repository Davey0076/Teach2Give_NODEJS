const { v4: uuidv4 } = require('uuid') // For generating unique identifiers
const { format } = require('date-fns') // For date formatting
const fs = require('fs').promises
const path = require('path')

const logEvents = async (message) => {
    const getDate = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}` // Correct date formatting
    const logItems = `${getDate}\t${uuidv4()}\t${message}\n`

    try {
        const dir = path.join(__dirname, "Logs")

        // Check if directory exists, if not create it
        try {
            await fs.access(dir)
        } catch (error) {
            await fs.mkdir(dir);
        }

        await fs.appendFile(path.join(dir, 'eventsLog.txt'), logItems)
        console.log('Log event saved: ', logItems)
    } catch (error) {
        console.log(error)
    }
}

module.exports = logEvents
