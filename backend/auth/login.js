const Pool = require('pg').Pool
const keys = require('../keys.json')


const pool = new Pool({
  user: keys.postgres.username,
  host: keys.postgres.host,
  database: keys.postgres.database,
  password: keys.postgres.password,
  port: keys.postgres.port,
})

exports.login = function (req, res) {

  const {username,password} = req.body

    pool.query('SELECT * FROM users WHERE username = $1', [username], (error, results) => {
      if (error) {
        throw error
        console.log("Error logging in Check password")
      }
      else {

        if(results.rows.length!=0){
      if(results.rows[0].password==password){
      res.status(200).json({
              status:"approved",
              code:"200"
            })
          }
          else{
            res.status(200).json({
                    status:"rejected",
                    code:"500",
                    reason:" username correct, password wrong"
                  })
          }
          }
          else{
            res.status(200).json({
                    status:"rejected",
                    code:"500",
                    reason:"username incorrect"
                  })
          }
        }
    })
  }



exports.signup= function (req, res) {
  console.log(req.body)
  const { username, email,password } = req.body
const now = new Date()
  pool.query('INSERT INTO users (username, email , password , role , created_on) VALUES ($1, $2, $3, $4, $5 )', [username, email, password, "admin", now], (error, results) => {
    if (error) {
      throw error
    }
    res.status(201).send(`User added with ID: ${results.insertId}`)
  })
}
