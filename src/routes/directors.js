const express = require('express');
const fs = require('fs');
const path = require('node:path');

const router = express.Router();
const dataBase = path.join(__dirname, "../../server/db.json");

//Read anime data from the archive
const readsDataBase = () => {
    try {
        const data = fs.readFileSync(dataBase, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error al leer la base de datos: ${error.message}`);
    }
};

const writeData = (data) =>{
    fs.writeFileSync(dataBase, JSON.stringify(data, null, 2), "utf-8");
}

//Create new director
router.post('/', (req, res) =>{
    const dataBase = readsDataBase();
    const newDirector = {
        id: dataBase.directors.length + 1,
        name: req.body.name,
    };
    dataBase.directors.push(newDirector);
    writeData(dataBase);
    res.status(201).json({ message: "Director creada exitosamente", anime: newDirector});
});

//Get all Director GET

router.get('/', (req, res) =>{
    const dataBase = readsDataBase();
    res.json(dataBase.directors)
})

//Get Director by id GET
router.get('/:id', (req, res) =>{
    const dataBase = readsDataBase();
    const foundDirector = dataBase.directors.find( director => director.id === parseInt(req.params.id));

    if(!foundDirector){
        return res.status(404).json({ message : "Director no encontrado"})
    }

    res.json(foundDirector)
})

//Update Director PUT
router.put('/:id', (req, res) =>{
    const dataBase = readsDataBase();
    const directorIndex = dataBase.directors.findIndex( director => director.id === parseInt(req.params.id))

    if(!directorIndex){
        return res.status(404).json({ message : "Director no encontrado"})
    }

    const updateDirectors = {
        ...dataBase.directors[directorIndex],
        name: req.body.name
    }

    dataBase.directors[directorIndex] = updateDirectors
    writeData(dataBase);
    res.json({ message: "Director actualizado correctamente", studio: updateDirectors})
})

//Delete director DELETE
router.delete('/:id', (req, res) =>{
    const dataBase = readsDataBase();
    const newListDirectors = dataBase.directors.filter( director => director.id !== parseInt(req.params.id));

    if(dataBase.length === newListDirectors.length){
        return res.status(404).json({ message : "Director no encontrado"})
    }

    dataBase.directors = newListDirectors;
    writeData(dataBase)

    res.json({ message: "Director eliminado correctamente"})
})

module.exports = router