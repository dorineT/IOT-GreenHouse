import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase('database.db')

export async function createTable(){
    // create table if not exists
    const query1 = `CREATE TABLE IF NOT EXISTS plante (
        plante_id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT NOT NULL,
        type_plante TEXT NOT NULL,
        plantation TEXT NOT NULL,
        recolte TEXT NOT NULL,
        terre TEXT NOT NULL,
        eau TEXT NOT NULL,
        ph TEXT NOT NULL,
        humidite TEXT NOT NULL,
        temperature TEXT NOT NULL,
        description TEXT NOT NULL,
        image TEXT NOT NULL,
        lien TEXT
    );`;

    const query2 = `CREATE TABLE IF NOT EXISTS serre (
        id_serre INTEGER PRIMARY KEY,
        type_action TEXT CHECK( type_action  IN ('arrosage','c_humidite','c_luminosite', 'c_temperature','c_ph') ) NOT NULL,
        moment datetime default current_timestamp
    );`;

    const query3 = `CREATE TABLE IF NOT EXISTS emplacement (
        label INTEGER PRIMARY KEY AUTOINCREMENT,
        plante_id  INTEGER  NOT NULL,
        FOREIGN KEY (plante_id) 
          REFERENCES plante (plante_id) 
    );`;
  

    const query4 = `INSERT INTO plante (nom,type_plante,plantation,recolte,terre,eau,ph,humidite,temperature,image, description)
    VALUES 
    ('Basilic','Comestible, aromatique','février - juillet','juin-novembre','pleine terre, bac','quotidien','neutre','drainé','> 10 degrés c','https://www.tomatopiu.com/wp-content/uploads/2016/08/BASILICO-GRECOsmall.png','Le basilic est une plante aromatique facile à cultiver en extérieur ou en intérieur, en pot ou en pleine terre. Très apprécié pour sa fraicheur et sa saveur, il relève les plats de l''été. C''est un réel plaisir de le cueillir selon ses besoins.'),
    ('Thym','Comestible, aromatique','février - juillet','juin-novembre','pleine terre, bac','quotidien','neutre','drainé','> 10 degrés c','https://www.tomatopiu.com/wp-content/uploads/2016/08/BASILICO-GRECOsmall.png','Le basilic est une plante aromatique facile à cultiver en extérieur ou en intérieur, en pot ou en pleine terre. Très apprécié pour sa fraicheur et sa saveur, il relève les plats de l''été. C''est un réel plaisir de le cueillir selon ses besoins.'),
    ('Fleur','Comestible, aromatique','février - juillet','juin-novembre','pleine terre, bac','quotidien','neutre','drainé','> 10 degrés c','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxaRQ_b37aFTSkwh8OKmhTqf6zlJHHMbG4GByIG-VYzg&s','Le basilic est une plante aromatique facile à cultiver en extérieur ou en intérieur, en pot ou en pleine terre. Très apprécié pour sa fraicheur et sa saveur, il relève les plats de l''été. C''est un réel plaisir de le cueillir selon ses besoins.');
    `;

    const db =  openDatabase()
    db.transaction(tx => {  
        
        tx.executeSql(query1)
        tx.executeSql(query2)
        tx.executeSql(query3)
        tx.executeSql(query4)
    })
    console.log("fin creation")
  };


export function getPlantsNotInHouse(){
  return new Promise((resolve, reject)=>{
    db.transaction((tx) => {
      tx.executeSql(
        `select * from plante p
        where plante_id not in (select plante_id from emplacement e where plante_id is not null);`, null, 
        (_, result) => resolve(result.rows._array),
        (_, error) => reject(error)
      );
    });
  })
}

export function getPlantsInHouse(){
  return new Promise((resolve, reject)=>{
    db.transaction((tx) => {
      tx.executeSql(
        `select distinct p.* from plante p, emplacement e 
        where p.plante_id = e.plante_id ;`, null, 
        (_, result) => resolve(result.rows._array),
        (_, error) => reject(error)
      );
    });
  })
}


export function getEmplacement(){
  return new Promise((resolve, reject)=>{
    db.transaction((tx) => {
      tx.executeSql(
        `select e.*, p.nom from emplacement e
        left join plante p on e.plante_id = p.plante_id;`, null,    
        (_, result) => resolve(result.rows._array),
        (_, error) => reject(error)
      );
    });
  })
}


export function addPlantToHouse(plante_id, labels){
  labels.forEach(element => {
    db.transaction(tx => {     
      tx.executeSql('UPDATE emplacement set plante_id = ? where label = ?;', [plante_id, element.label],
      (txObj, resultSet) => { 
        if(resultSet.rowsAffected > 0){
          console.log('update ok')
        }
      },
      (txObj, error) => console.log('Error ', error))      
    })
  });
}

export function deletePlantFromHouse(plante_id){  
  return new Promise((resolve, reject) =>{
    db.transaction(tx => {     
      tx.executeSql('UPDATE emplacement set plante_id = null where plante_id = ?;', [plante_id],
      (txObj, resultSet) => resolve(resultSet.rowsAffected),
      (txObj, error) => reject(error))      
    })
  })
}


export function updateDataGreenHouse(data, time){ 
  console.log('update data into db') 
  return new Promise((resolve, reject) =>{
    db.transaction(tx => {     
      tx.executeSql('UPDATE serre SET '        
        + 'c_humidite = ?,'
        + ' c_luminosite = ?,'
        + ' c_temperature = ?,'
        + ' c_ph = ?,'
        + ' c_co2 = ?,'
        + ' moment = ?'
        +' where id_serre = ? ;', 
        [data.humidity, data.light ,data.temperature, data.ph, data.co2, time,1],
      (txObj, resultSet) => resolve(resultSet.rowsAffected),
      (txObj, error) => reject(error))      
    })
  })
}

export function loadDataGreenHouse(){
  return new Promise((resolve, reject)=>{
    db.transaction((tx) => {
      tx.executeSql(
        `select * from serre s
        where id_serre = ?;`, [1], 
        (_, result) => resolve(result.rows._array),
        (_, error) => reject(error)
      );
    });
  })
}
