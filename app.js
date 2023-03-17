const express = require('express')
const conn = require('./database')
const cors = require('cors')
const bodyParser = require('body-parser');




const app = express()


app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
app.use(express.json());

//Question 1
app.get('/polling-unit/:id', (req, res) => {
    const id = req.params.id;
    const query = `SELECT * FROM bincom_test.announced_pu_results WHERE polling_unit_uniqueid = ${id}`;
    conn.query(query, (err, results) => {
        if (err) throw err;

        return res.json({ results });
    });
});

// Question 2
app.get('/lgas', (req, res) => {
    const query = 'SELECT * FROM bincom_test.lga';
    conn.query(query, (err, results) => {
        if (err) throw err;

        return res.json(results);
    });
});

app.get('/total/:lgaId', (req, res) => {
    const lgaId = req.params.lgaId;
    const query = `SELECT SUM(party_score) AS total FROM bincom_test.announced_pu_results WHERE polling_unit_uniqueid IN (SELECT polling_unit_id FROM polling_unit WHERE lga_id = ${lgaId})`;
    conn.query(query, (err, results) => {
        if (err) throw err;

        const total = results[0].total;
        return res.json({ total });
    });
});







////////// Questio3
app.post('/polling-units', (req, res) => {
    const { wardId, lgaId, stateId, pdp, dpp, acn, ppa, cdc, jp } = req.body;
    const uniqueId = Math.floor(Math.random() * 10);
    const name = 'databases'
    const lat = '';
    const long = ''


    const sql = 'INSERT INTO polling_unit (ward_id, lga_id, name, lat, long) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [wardId, lgaId, uniqueId, name, lat, long];

    conn.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error creating polling unit');
            return;
        }

        const pollingUnitId = result.insertId;

        const resultsSql = 'INSERT INTO announced_pu_results (polling_unit_uniqueid, party_abbreviation, party_score) VALUES (?, ?, ?)';
        const resultsValues = [
            pollingUnitId,
            ['PDP', 'DPP', 'ACN', 'PPA', 'CDC', 'JP'],
            [pdp, dpp, acn, ppa, cdc, jp]
        ];

        conn.query(resultsSql, resultsValues, (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error saving results');
                return;
            }

            res.status(200).send('Polling unit and results created successfully');
        });
    });
});


const Port = 3200
app.listen(Port, () => {
    console.log('Server on at port 3200')
})
