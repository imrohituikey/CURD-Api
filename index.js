const express = require('express');
const users = require('./MOCK_DATA.json');
const fs = require('fs');
const { stringify } = require('querystring');
const { join } = require('path');

const app = express();
const PORT = 8000;

//plugins for server
app.use(express.json());
app.use(express.urlencoded({urlencoded : true}));

//routes for app
app.get('/users', (req,res) =>{
    const html = `
    <ul>
        ${users.map(user=>`<ul>${user.first_name}</ul>`).join("")}
    </ul>`
    res.send(html);
});

app.get('/users/:id',(req,res)=>{
    const id = Number(req.params.id);
    const user = users.find(user => user.id===id);
    const html = `  <ul>
                        <li>User Id :  ${user.id}</li>
                        <li>First Name :  ${user.first_name}</li>
                        <li>Last Name :  ${user.last_name}</li>
                        <li>Gender :  ${user.gender}</li>
                        <li>Email :  ${user.email}</li>
                        <li>Job-Title :  ${user.job_title}</li>
                    </ul>`
    res.send(html)
});

//REST API endpoints
app.get('/api/users', (req,res) =>{
   return res.status(200).json(users);
});

app.get('/api/users/:id', (req,res) =>{
    const id = Number(req.params.id);
    const user = users.find(user => user.id===id);
    return res.send(user)
});

app.post('/api/addusers',(req,res)=>{
    const body = req.body;
    users.push({...body , id : users.length+1});
    fs.writeFile("./MOCK_DATA.json",JSON.stringify(users), (err,data)=>{
        return res.json({status : "success", id : users.length});
    })
});

app.delete('/api/deleteuser/:id',(req,res)=>{
    const id = Number(req.params.id);
    const deletedUser = users.splice(id,1)[Object];
    
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data)=>{
        return res.send(deletedUser);
    });    
});

app.patch('/api/updateuser',(req,res)=>{
    const id = Number(req.body.id);
    const user = users.find(user => user.id===id);
    user.first_name = req.body.first_name;
    user.last_name = req.body.last_name;
    user.email = req.body.email;
    user.gender = req.body.gender;
    user.job_title = req.body.job_title;

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err,data)=>{
        return res.send('User is Updated')
    })
});

//starting the server
app.listen(PORT, ()=>{
    console.log(`Server is Running at PORT ${PORT}`);
});