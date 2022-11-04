// O módulo FS permite interações com o FILE SYSTEM
const fs = require('fs')
// const { fstat } = require('fs')
const http = require('http')
const url = require('url')

////////////////////////////////////// 
// FILES

// Esse é o modo SÍNCRONO, que bloqueia o processamento de minhas outras requisições 
// // Leitura dos dados de um Arquivo txt

// const textInput = fs.readFileSync('./txt/input.txt', 'utf-8')
// // console.log(textInput)

// // Criação de um arquivo a partir da leitura de um dado
// const textOut = `This is what we know about the avocado: ${textInput}. /nCreated on ${Date.now()}`
// fs.writeFileSync('./txt/output.txt', textOut)
// console.log('file written')

// Modo Asíncrono

// fs.readFile('./txt/start.txt',  'utf8',(err, data1) => {
//     if(err) return console.log('ERROR!')
//     fs.readFile(`./txt/${data1}.txt`,  'utf8',(err, data2) => {
//         fs.readFile('./txt/append.txt',  'utf8',(err, data3) => {
//             fs.writeFile('./txt/final.txt',`${data2}\n${data3}` ,'utf-8', err => {
//                 console.log('file written!')
//             })
//         })
//     })
// })

// console.log('Will read file!')

////////////////////////////////////// 
// SERvER
// Essa função vai manipular o conteúdo do JSON e substituir os placeholders do nosso template pelo conteúdo do JSON
const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName)
    // Manipulando OUTPUT ao invés de TEMP pois manipular o argumento da função não é uma boa prática
    output = output.replace(/{%IMAGE%}/g, product.image)
    output = output.replace(/{%PRICE%}/g, product.price)
    output = output.replace(/{%FROM%}/g, product.from)
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients)
    output = output.replace(/{%QUANTITY%}/g, product.quantity)
    output = output.replace(/{%DESCRIPTION%}/g, product.description)
    output = output.replace(/{%ID%}/g, product.id)


    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic')
    return output
}
// Templates, carregar eles sincronamente para não ter que ficar recarregando toda vez que fizer uma requisição
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8')

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data)
   


const server = http.createServer((req, res) => {
    const pathName = req.url
// OVERVIEW
    if(pathName === '/' || pathName === '/overview') {
        res.writeHead(200, {'Content-type': 'text/html'})

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('')

        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)

        res.end(output)

// PRODUCT PAGE
    } else if (pathName ==='/product') {
        res.end('Product')
        
// API
    } else if (pathName ==='/api') {
        res.writeHead(200, {'Content-type': 'application/json'})
        res.end(data)

// NOT FOUND
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html'
        })
        res.end('<h1>Page not found!</h1>')
    }
})

server.listen(8000, () => {
    console.log('Server Started, port 8000')
})
