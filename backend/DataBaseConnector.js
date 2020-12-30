

try {
    require('./config/neo4jDriver');  
  
    console.log(`Connected to Neo4J.`)
    const port = process.env.PORT || 5000
    app.listen(port, () => {
      console.log(`API server listening at http://localhost:${port}`);
    });
  } catch(ex) {
    console.error('Error connecting to Neo4J', ex);
  
};