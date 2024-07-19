const express = require('express');
const animeRoutes = require ('./routes/anime')
const studiosRoutes = require('./routes/studios')
const directorRoutes = require('./routes/directors')
const charactersRoutes = require('./routes/characteres')
const errorHandler = require('./middlewares/errorHandler')

const app = express()
const PORT = 3000

app.use(express.json());
app.use("/anime", animeRoutes);
app.use("/studios", studiosRoutes);
app.use("/directors", directorRoutes);
app.use("/characters", charactersRoutes);
app.use(errorHandler)

app.listen(PORT, () =>{
    console.log(`Server running at http://localhost:${PORT}/`)
})