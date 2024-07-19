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

//Operations CRUD

//Funcion for get all animes GET
router.get('/', (req, res) =>{
    const data = readsDataBase();
    res.json(data.animes)
})

//GET anime by Id 
router.get('/:id', (req, res) =>{
    const data = readsDataBase();
    const anime = data.animes.find(anime => anime.id === parseInt(req.params.id));

    if(!anime){
        res.status(404).json({message: "Anime not found"});
    }
    res.json(anime)
})


//Update anime PUT
router.put('/:id', (req, res) =>{
    const data = readsDataBase();
    const dataIndex = data.animes.findIndex(anime => anime.id === parseInt(req.params.id))
    
    if(!dataIndex){
        return res.status(404).json({ message: "Anime no encontrado"})
    }

    const updateAnime = {
        ...data.animes[dataIndex],
        title: req.body.title,
        genere: req.body.genere,
        studioId: req.body.studioId
    }

    data.animes[dataIndex] = updateAnime;
    writeData(data);
    res.json({ message: "Anime actualizado correctamente.", anime: updateAnime });
})

//Funcion for create a new anime POST
router.post('/', (req, res) =>{
    const dataBase = readsDataBase();
    const newAnime = {
        id: dataBase.animes.length + 1,
        title: req.body.title,
        genere: req.body.genere,
        studioId : foundAnimes.id
    };
    dataBase.animes.push(newAnime);
    writeData(dataBase);
    res.status(201).json({ message: "Anime creado exitosamente", anime: newAnime, additionalMessage: `Estudio de anime: ${foundAnimes.name}`});
});


//Delete anime DELETE
router.delete('/:id', (req, res) =>{
    const dataBase = readsDataBase();
    const dataIndex = dataBase.animes.filter(anime => anime.id !== parseInt(req.params.id, 10));

    if(dataBase.length === dataIndex.length ){
        return res.status(404).json({ message: "Anime no encontrado"})
    }

    dataBase.animes = dataIndex
    writeData(dataBase);
    res.json({ message: "Anime eliminado exitosamente papo", anime: dataIndex})
})



module.exports = router;