// O módulo FS permite interações com o FILE SYSTEM
const fs = require('fs')
const http = require('http')
const url = require('url')

// o slugify troca o ID da url no site por algo mais bonito, tipo o nome do produto ou oque eu quiser botar
const slugify = require('slugify')

const replaceTemplate = require('./modules/replaceTemplate')

// para iniciar um projeto com node e utilizar os módulos npm, basta chamar NPM INIT no console
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

// Templates, carregar eles sincronamente para não ter que ficar recarregando toda vez que fizer uma requisição
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8')

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data)


const slugs = dataObj.map(el => slugify(el.productName, {lower: true}))
// console.log(slugs)

const server = http.createServer((req, res) => {
    // console.log(req.url) //Para pegar os parâmetros da request da url em que estou tentando acessar
    // console.log(url.parse(req.url, true)) //Parse pega a URL e transforma num OBJETO com vários parâmetros da URL, usarei isso para pegar a QUERY (que é o ID) e o pathname (Que é o que vem entre o localhost e o id, no caso pathname aqui seria 'product')

    const {query, pathname} = url.parse(req.url, true) //Aqui eu criei duas váriaveis desustruturando o objeto criado com o parse, essas váriaveis já tem valores dentro do objeto e eu posso simplesmente usar esses valores individualmente

// OVERVIEW
    if(pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {'Content-type': 'text/html'})

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('')

        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)

        res.end(output)

// PRODUCT PAGE
    } else if (pathname ==='/product') {
        res.writeHead(200, {'Content-type': 'text/html'})
        const product = dataObj[query.id]
        const output = replaceTemplate(tempProduct, product)

        res.end(output)
        
// API
    } else if (pathname ==='/api') {
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
