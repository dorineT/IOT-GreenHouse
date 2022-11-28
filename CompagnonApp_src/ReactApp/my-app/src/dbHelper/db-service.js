import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase('database.db')

export function createTable(){
    // create table if not exists

    return new Promise((resolve, reject)=>{
      db.transaction(
        function(tx){
          tx.executeSql("CREATE TABLE IF NOT EXISTS plante (plante_id INTEGER PRIMARY KEY AUTOINCREMENT,nom TEXT NOT NULL,type_plante TEXT NOT NULL,plantation TEXT NOT NULL,recolte TEXT NOT NULL,terre TEXT NOT NULL,eau TEXT NOT NULL,ph TEXT,humidite TEXT NOT NULL,temperature_min REAL  NOT NULL,temperature_max REAL NOT NULL,description TEXT NOT NULL,image TEXT NOT NULL,lien TEXT);");
          tx.executeSql("CREATE TABLE IF NOT EXISTS serre (id_serre INTEGER PRIMARY KEY AUTOINCREMENT,arrosage TEXT default null,c_humidite INTEGER default null,c_luminosite INTEGER default null, c_temperature REAL default null,c_ph INTEGER default null,c_co2 INTEGER default null,moment datetime default current_timestamp);");
          tx.executeSql("CREATE TABLE IF NOT EXISTS emplacement (label INTEGER PRIMARY KEY,plante_id  INTEGER,FOREIGN KEY (plante_id) REFERENCES plante (plante_id) );");
          tx.executeSql("INSERT INTO plante (nom,type_plante,plantation,recolte,terre,eau,ph,humidite,temperature_min,temperature_max ,image, description) "
          + "VALUES "
          +"('Basilic','Comestible, aromatique','février - juillet','juin-novembre','pleine terre, bac','quotidien','neutre','drainé',10,21,'https://www.tomatopiu.com/wp-content/uploads/2016/08/BASILICO-GRECOsmall.png','Le basilic est une plante aromatique facile à cultiver en extérieur ou en intérieur, en pot ou en pleine terre. Très apprécié pour sa fraîcheur et sa saveur, il relève les plats de l''été. C''est un réel plaisir de le cueillir selon ses besoins.'), "
          +"('Thym','Comestible, aromatique','février - juillet','juin-novembre','pleine terre, bac','quotidien','neutre','drainé',10,30,'https://www.tomatopiu.com/wp-content/uploads/2016/08/BASILICO-GRECOsmall.png','Le basilic est une plante aromatique facile à cultiver en extérieur ou en intérieur, en pot ou en pleine terre. Très apprécié pour sa fraîcheur et sa saveur, il relève les plats de l''été. C''est un réel plaisir de le cueillir selon ses besoins.'), "
          +"('Paquerette','Comestible, aromatique','février - juillet','juin-novembre','pleine terre, bac','quotidien',null ,'drainé',10,30,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxaRQ_b37aFTSkwh8OKmhTqf6zlJHHMbG4GByIG-VYzg&s','Le basilic est une plante aromatique facile à cultiver en extérieur ou en intérieur, en pot ou en pleine terre. Très apprécié pour sa fraîcheur et sa saveur, il relève les plats de l''été. C''est un réel plaisir de le cueillir selon ses besoins.')," 
          +"('Fleur','Comestible, aromatique','février - juillet','juin-novembre','pleine terre, bac','quotidien','neutre','drainé',10,30,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxaRQ_b37aFTSkwh8OKmhTqf6zlJHHMbG4GByIG-VYzg&s','Le basilic est une plante aromatique facile à cultiver en extérieur ou en intérieur, en pot ou en pleine terre. Très apprécié pour sa fraîcheur et sa saveur, il relève les plats de l''été. C''est un réel plaisir de le cueillir selon ses besoins.');");
          tx.executeSql("insert into emplacement (label) values (1),(2),(3),(4),(5),(6);");
          tx.executeSql("insert into serre (id_serre) values (1);");
          tx.executeSql("UPDATE emplacement set plante_id = 1 where label = 1;");
        },
        function(error){
          reject(error)
        },
        function(){
          resolve(true)
        });}
      );
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

export function getPlants(){
  return new Promise((resolve, reject)=>{
    db.transaction((tx) => {
      tx.executeSql(
        `select * from plante;`, null, 
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

export function updateLastWaterTime(time){   
  return new Promise((resolve, reject) =>{
    db.transaction(tx => {     
      tx.executeSql('UPDATE serre SET '        
        + 'arrosage = ? '
        +' where id_serre = ? ;', 
        [time,1],
      (txObj, resultSet) => resolve(resultSet.rowsAffected),
      (txObj, error) => reject(error))      
    })
  })
}

export function loadDataGreenHouse(){
  return new Promise((resolve, reject)=>{
    db.transaction((tx) => {
      tx.executeSql(
        `select * from serre where id_serre = ? ;`, [1], 
        (_, result) => resolve(result.rows._array),
        (_, error) => reject(error)
      );
    });
  })
}
