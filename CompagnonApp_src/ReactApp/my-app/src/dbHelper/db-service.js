import * as SQLite from "expo-sqlite";

export async function openDatabase() {
    if (Platform.OS === "web") {
      return {
        transaction: () => {
          return {
            executeSql: () => {},
          };
        },
      };
    }
  
    return SQLite.openDatabase("database.db");
}

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


export async function getPlantes(){
    const db = await openDatabase()
    db.transaction(tx => {  
        console.log("coucou")        
        tx.executeSql('SELECT * FROM plante;', null,    
          (_, { rows: { _array } }) => {
            console.log(_array)
            return _array
        },
          (_, error) => console.log('Error ', error)
          )
      })
}