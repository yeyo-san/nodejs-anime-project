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

//Create new Character
router.post('/', (req, res) =>{
    const dataBase = readsDataBase();
    const newCharacter = {
        id: dataBase.characters.length + 1,
        name: req.body.name,
    };
    dataBase.characters.push(newCharacter);
    writeData(dataBase);
    res.status(201).json({ message: "Personaje creado exitosamente", anime: newCharacter});
});

//Get all Character GET

router.get('/', (req, res) =>{
    const dataBase = readsDataBase();
    res.json(dataBase.characters)
})

//Get Character by id GET
router.get('/:id', (req, res) =>{
    const dataBase = readsDataBase();
    const foundCharacter = dataBase.characters.find( character => character.id === parseInt(req.params.id));

    if(!foundCharacter){
        return res.status(404).json({ message : "Personaje no encontrado"})
    }

    res.json(foundCharacter)
})

//Update character PUT
router.put('/:id', (req, res) =>{
    const dataBase = readsDataBase();
    const characterIndex = dataBase.characters.findIndex( character => character.id === parseInt(req.params.id))

    if(!characterIndex){
        return res.status(404).json({ message : "Personaje no encontrado"})
    }

    const updateCharacter = {
        ...dataBase.characters[characterIndex],
        name: req.body.name
    }

    dataBase.characters[characterIndex] = updateCharacter
    writeData(dataBase);
    res.json({ message: "Personaje actualizado correctamente", studio: updateCharacter})
})

//Delete character DELETE
router.delete('/:id', (req, res) =>{
    const dataBase = readsDataBase();
    const newListCharacteres = dataBase.characters.filter( characteres => characteres.id !== parseInt(req.params.id));

    if(dataBase.length === newListCharacteres.length){
        return res.status(404).json({ message : "Personaje no encontrado"})
    }

    dataBase.characters = newListCharacteres;
    writeData(dataBase)

    res.json({ message: "Personaje eliminado correctamente"})
})
module.exports = router