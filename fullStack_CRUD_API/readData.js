import fs from 'fs';

export const readData = () =>{
    const data = fs.readFileSync('./data.json', 'utf-8')
    return JSON.parse(data)
}

export const writeData = (data) => {
    fs.writeFileSync('./data.json', JSON.stringify(data, null, 2), 'utf-8')
}

console.log(readData());