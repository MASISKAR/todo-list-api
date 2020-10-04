# TodoList REST API

### How to use it

---
## Requirements

You will need install `Node.js`, `npm` and `MongoDB`  in your environement.

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v13.12.0

    $ npm --version
    6.14.2

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

### MongoDB
 Install MongoDb [Guide](https://docs.mongodb.com/manual/administration/install-community/)

## Project installation and usage

    $ git clone https://github.com/MASISKAR/todo-list-api
    $ cd todo-list-api
    $ npm install

Remove `.sample` extension from configuration files located in `/config/env/`
    ```sh
    dev.env.sample -> dev.env
    prod.env.sample -> prod.env
    ```

## Running the project

    $ npm start

## Making requests
### ``By default, the API_HOST is http://localhost:3001``

#### Create a new task
request url `API_HOST/task`

request method `POST`

request body 
`{`
title: `{String}`, (required)
description: `{String}`,
date: `{String}`
`}`  
 
 
#### Get all tasks or search
request url `API_HOST/task`

request method `GET`

##### The following filters and sorting are allowed
`{`

   status: `OneOf['active', 'done']`,

   search: `{searchString}`,
    
   create_lte: `{dateString}`,
    
   create_gte: `{dateString}`,
    
   complete_lte: `{dateString}`,
    
   complete_gte: `{dateString}`,
    
   sort: `OneOf['a-z', 'z-a', 'creation_date_oldest', 'creation_date_newest', 'completion_date_oldest', 'completion_date_newest']`,
   
`}`


#### Get a single task
request url `API_HOST/task/:taskId`
request method `GET`

#### Update a task
request url `API_HOST/task/:taskId`
request method `PUT`
request body 
`{`
title: `{String}`,
description: `{String}`,
date: `{String}`
`}`         
    
#### Mark a task as done/active
request url `API_HOST/task/:taskId`
request method `PUT`
request body 
`{`
status: `OneOf['active', 'done']`,
`}`    
    
#### Delete the task
request url `API_HOST/task/:taskId`
request method `DELETE`

#### Delete batch tasks
request url `API_HOST/task`
request method `PATCH`
request body 
`{`
tasks: `{Array[String{task id}]}`,
`}`  

#### Create a new user (register)
request url `API_HOST/user`

request method `POST`

request body 
`{`
email: `{String}` (required)
password: `{String}` (required)
name: `{String}` (required)
surname: `{String}` (required)
`}`  

#### Sign in
request url `API_HOST/user/sign-in`

request method `POST`

request body 
`{`
email: `{String}` (required)
password: `{String}` (required)
`}`  

#### Sign out
request url `API_HOST/user/sign-out`

request method `POST`

request body 
`{`
jwt: `{JWT string}` (required)
`}`  

#### Get user info
request url `API_HOST/user`

request method `GET`

#### Update user info
request url `API_HOST/user`

request method `PUT`

request body 
`{`
name: `{String}`
surname: `{String}`
`}`  


#### Sending contact form
request url `API_HOST/contact`

request method `POST`

request body 
`{`
name: `{String}`, (required)
email: `{String}`, (required)
message: `{String}`
`}`  
