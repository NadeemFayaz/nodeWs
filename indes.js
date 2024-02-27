const fs = require("fs");
const http = require("http");
const { type } = require("os");
const path = require("path");

// Read template files synchronously at server startup
const tempOverview = fs.readFileSync(path.join(__dirname,'1-node-farm', 'templates', 'template-overview.html'), 'utf8');
const tempCard = fs.readFileSync(path.join(__dirname, '1-node-farm','templates', 'template-card.html'), 'utf8');
const tempProduct = fs.readFileSync(path.join(__dirname,'1-node-farm', 'templates', 'product.html'), 'utf8');
const productData = fs.readFileSync(path.join(__dirname, '1-node-farm', 'starter', 'dev-data',  'data.json'), 'utf8', (err, data) => {
  if (err) {
    const errMsg = err.message
    return errMsg
  }
  return data;
});

const replaceTemplate = (card ,data)=>{
  let output = card.replace(/{%PRODUCTNAME%}/g, data.productName);
  output = output.replace(/{%IMAGE%}/g,data.image);
  output = output.replace(/{%PRICE%}/g,data.price);
  output = output.replace(/{%NUTRIENTS%}/g,data.nutrients);
  output = output.replace(/{%QUANTITY%}/g,data.quantity);
  output = output.replace(/{%DESCRIPTION%}/g,data.description);
  output = output.replace(/{%ID%}/g,data.id);

  if(!data.organic)
  output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
  return output
}
const server = http.createServer((req, res) => {
  //const{query,pathname}=url.parse(req.url,true);
  console.log(pathname);

  // Route for overview or root
  if (pathname === "/overview" ||pathname === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    const newdata = JSON.parse(productData)

    const cardsHtml = newdata.map(productdata => replaceTemplate(tempCard, productdata))
    const tempOverviewNew = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml)
    res.end(tempOverviewNew)
  } 
  // Route for products
  else if (pathname === "/products") {
    res.writeHead(200, { "Content-Type": "text/html" });

    res.end("these area products"); // Placeholder response
  } 
  // Route for API to serve JSON data
  else if (pathname === "/api") {
   res.writeHead(200, { "Content-Type": "text/html" });
   res.end(JSON.parse(productData));
  } 
  // Handle unknown routes
  else {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end("<h1>404 Not Found</h1>");
  }
});

// Start listening on port 8000
server.listen(8000, "127.0.0.1", () => {
  console.log("Listening on port 8000");
});
