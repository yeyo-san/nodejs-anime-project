const express = require('express');
const fs = require('fs');
const path = require('node:path');
const { title } = require('process');

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

//Operations CRUD

//Funcion for create New studio POST
router.post('/', (req, res) =>{
    const dataBase = readsDataBase();
    const newStudioAnime = {
        id: dataBase.studioAnime.length + 1,
        name: req.body.name,
    };
    dataBase.studioAnime.push(newStudioAnime);
    writeData(dataBase);
    res.status(201).json({ message: "Estudio creado exitosamente", anime: newStudioAnime});
});

//Get all studios GET

router.get('/', (req, res) =>{
    const dataBase = readsDataBase();
    res.json(dataBase.studioAnime)
})

//Get studio by id GET
router.get('/:id', (req, res) =>{
    const dataBase = readsDataBase();
    const foundStudio = dataBase.studioAnime.find( studio => studio.id === parseInt(req.params.id));

    if(!foundStudio){
        return res.status(404).json({ message : "Studio no encontrado"})
    }

    res.json(foundStudio)
})

//Update Studio PUT
router.put('/:id', (req, res) =>{
    const dataBase = readsDataBase();
    const studioIndex = dataBase.studioAnime.findIndex( studio => studio.id === parseInt(req.params.id))

    if(!studioIndex){
        return res.status(404).json({ message : "Studio no encontrado"})
    }

    const updateStudio = {
        ...dataBase.studioAnime[studioIndex],
        name: req.body.name
    }

    dataBase.studioAnime[studioIndex] = updateStudio
    writeData(dataBase);
    res.json({ message: "Estudio actualizado correctamente", studio: updateStudio})
})

//Delete Studio DELETE
router.delete('/:id', (req, res) =>{
    const dataBase = readsDataBase();
    const newListStudios = dataBase.studioAnime.filter( studio => studio.id !== parseInt(req.params.id));

    if(dataBase.length === newListStudios.length){
        return res.status(404).json({ message : "Studio no encontrado"})
    }

    dataBase.studioAnime = newListStudios;
    writeData(dataBase)

    res.json({ message: "Estudio eliminado correctamente"})
})
module.exports = router