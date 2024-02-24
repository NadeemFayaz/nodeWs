const fs = require("fs");
const http = require("http");
const path = require("path");

// Read template files synchronously at server startup
const tempOverview = fs.readFileSync(path.join(__dirname,'1-node-farm', 'templates', 'template-overview.html'), 'utf8');
const tempCard = fs.readFileSync(path.join(__dirname, '1-node-farm','templates', 'template-card.html'), 'utf8');
const tempProduct = fs.readFileSync(path.join(__dirname,'1-node-farm', 'templates', 'product.html'), 'utf8');

// Create an HTTP server

const replaceTemplate = (temp,product)=>{
  let output=temp.replace(/{%PRODUCTNAME%}/g,product.productName);
  output = output.replace(/{%IMAGE%}/g,product.image);
  output = output.replace(/{%PRICE%}/g,product.price);
  output = output.replace(/{%NUTRIENTS%}/g,product.nutrients);
  output = output.replace(/{%QUANTITY%}/g,product.qunatity);
  output = output.replace(/{%DESCRIPTION%}/g,product.description);
  output = output.replace(/{%ID%}/g,product.id);

  if(!product.organic)
  output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
  
}
const server = http.createServer((req, res) => {
  const pathName = req.url;

  // Route for overview or root
  if (pathName === "/overview" || pathName === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });

    const cardsHtml = productData.map(el=>replaceTemplate(ele,tempCard))
        res.end(tempOverview); // Placeholder response
  } 
  // Route for products
  else if (pathName === "/products") {
    res.writeHead(200, { "Content-Type": "text/html" });

    res.end("these area products"); // Placeholder response
  } 
  // Route for API to serve JSON data
  else if (pathName === "/api") {
    fs.readFile(path.join(__dirname, 'data', 'data.json'), 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Failed to read data file" }));
        return;
      }
      // Assuming data is JSON string
      const productData = JSON.parse(data);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(productData)); // Send JSON data
    });
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
