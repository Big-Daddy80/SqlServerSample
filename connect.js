var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var async = require('async');

// Create connection to database
var config = {
  userName: 'sa', // update me
  password: 'Masterkey1#', // update me
  server: '10.159.48.14',
  options: {
	  instanceName: 'SQLSERVER',
      database: 'ASPartnerSystemKSLiveCopy'
  }
}
var connection = new Connection(config);
var sqlStatement = "select TOP(25) NumberDisplay, BusinessUnitID  from BusinessUnits;";


function getBusinessUnits(callback) {
	var innersqlStatement = "select TOP(25) NumberDisplay, BusinessUnitID from BusinessUnits;";
	
	console.log('Auslesen der BU´s...');
	
	request = new Request((innersqlStatement),function(err, rowCount, rows) {
		if(err) {
			callback(err);
		} else {
			console.log(rowCount + ' Zeilen zurückgeliefert');
			callback(null);
		}});
		
	var result = "";
    request.on('row', function(columns) {
        columns.forEach(function(column) {
            if(column.value!=null) {
                result += column.value + " ";
                console.log(column.value);
            }
            /*
            if (column.value === null) {
                console.log('NULL');
            } else {
                result += column.value + " ";
            }
            */
        });
        /*
        console.log(result);
        */
        result = "";
        
    });

    // Execute SQL statement
    connection.execSql(request);
}


function Complete(err, result) {
    if (err) {
        console.log(err);
    } else {
        connection.close;
        console.log("Done! Closed Connection to DB..");
    }
}

function dummy() {
    // do nothing more
}

// Attempt to connect and execute queries if connection goes through
connection.on('connect', function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Connected');

    // Execute all functions in the array serially
    async.waterfall([getBusinessUnits], Complete);
  
    //async.
    /*
connection.query(sqlStatement,function(err,rows,fields)) {
    if(err) throw err;

    rows.forEach(function(row){
        if(row.value==='null') {
            console.log('Leere Zelle')
        }
        else {
            console.log(row.value + " ");
        }
    })
    }
*/
  }

});

