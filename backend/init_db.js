const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function importDb() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    multipleStatements: true
  });

  try {
    console.log('Connected to MySQL successfully.');

    const [tables] = await connection.query("SHOW TABLES LIKE 'Users'");
    if (tables.length > 0) {
      console.log('Database already initialized. Skipping.');
      return;
    }

    // 1. schema.sql
    console.log('Importing schema...');
    let sql = fs.readFileSync(path.join(__dirname, '..', 'database', 'schema.sql'), 'utf8');
    await connection.query(sql.replace(/USE CivicConnectDB;/ig, ''));

    // 2. sample_data.sql
    console.log('Importing sample data...');
    sql = fs.readFileSync(path.join(__dirname, '..', 'database', 'sample_data.sql'), 'utf8');
    await connection.query(sql.replace(/USE CivicConnectDB;/ig, ''));

    // 3. views.sql
    console.log('Importing views...');
    sql = fs.readFileSync(path.join(__dirname, '..', 'database', 'views.sql'), 'utf8');
    await connection.query(sql.replace(/USE CivicConnectDB;/ig, ''));

    // 4. procedures.sql
    console.log('Importing procedures...');
    sql = fs.readFileSync(path.join(__dirname, '..', 'database', 'procedures.sql'), 'utf8');
    sql = sql.replace(/DELIMITER \/\//g, '').replace(/DELIMITER ;/g, '').trim();
    sql = sql.replace(/USE CivicConnectDB;/ig, '');
    
    const procMatch = sql.match(/CREATE PROCEDURE[\s\S]*END \/\//i);
    if(procMatch) {
      const procSql = procMatch[0].replace(/END \/\//i, 'END');
      await connection.query(procSql);
    } else {
      console.log('Could not parse procedure.');
    }

    // 5. triggers.sql
    console.log('Importing triggers...');
    sql = fs.readFileSync(path.join(__dirname, '..', 'database', 'triggers.sql'), 'utf8');
    sql = sql.replace(/USE CivicConnectDB;/ig, '');
    const triggerMatch = sql.match(/CREATE TRIGGER[\s\S]*END \/\//i);
    if(triggerMatch) {
      const triggerSql = triggerMatch[0].replace(/END \/\//i, 'END');
      await connection.query(triggerSql);
    } else {
      console.log('Could not parse trigger.');
    }

    console.log('Database initialization completed.');

    const [tables] = await connection.query('SHOW TABLES;');
    console.log('Tables:', tables);

  } catch (err) {
    console.error('Error during import:', err);
  } finally {
    await connection.end();
  }
}

importDb();
