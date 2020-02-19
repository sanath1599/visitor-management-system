const Pool = require('pg').Pool
const keys = require('../keys.json')


const pool = new Pool({
  user: keys.postgres.username,
  host: keys.postgres.host,
  database: keys.postgres.database,
  password: keys.postgres.password,
  port: keys.postgres.host,
})

exports.login = function (req, res) {

  const {username,password} = request.body

    pool.query('SELECT * FROM users WHERE username = $1 && password =$2', [username,password], (error, results) => {
      if (error) {
        throw error
        console.log("Error logging in Check password")
      }
      response.status(200).json({
              status:"approved"
              code:"200"
            })
    })
  }

}

exports.signup= function (req, res) {

  const { username, email,password } = request.body

  pool.query('INSERT INTO users (username, email , password) VALUES ($1, $2, $3)', [username, email, password], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`User added with ID: ${result.insertId}`)
  })
}



}
