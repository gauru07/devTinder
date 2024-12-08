          DEV TINDER -> FULLSTACK WEBSITE

Server->
      
      Client -> Server

WaterFall Model(SDLC)
 Requirement
 Design
 Development
 Testing
 Deployment
 Maintainace

 Dev Tinder(Microservices)
      1. Frontend -> React
         API Calls
      2. Backend  -> NodeJS
         DataBase

      
 Dev Tinder Features->
    1. Create an acount
    2. Login
    3. Update your profile
    4. Feed Page - Explore 
    5. Send Connection Request or ignor
    6. See our matchs
    7. See the request we've sent/recived
    8.


TECH PLANNING-> 

   High Level Design(HLD)
              2 Microservices
        Frontend              Backend
      React                      NodeJS
                                 MongoDB


   Low Level Design(LLD)
            1. DB Design
                User Collection/Information
                    Name
                    Email
                    Number
                    Age
                    Gender
                Connection Request
                    From UderID
                    ToUserID
                    Status - Pending - Accepted - Rejected - Ignored - Blocked
            2. API Design {Rest API}
                    HTTP method(Get, Post, PUT, Patch, Delete)
                    SignUp API (Post)
                    Login (Post)
                    profile (Get)
                    Profile (Post)
                    Profile (Patch)
                    Profile (Delete)
                    Profile (send Request -> Ignore or Intrested)
                    Review reqest (Post)
                    Request All (Get)
                    Connections (Get)````


Created TinderDev Project
run npm Init -> for careting Project -> packege.json created.
run npm install express -> for creating http Server -> packege.lock.json created and Node Modul file
anything npm packege we install that files download and store in  node Module

Dependacies 
     -> our project is dependent on this packege.

Diff btw packege.json vs packege-lock.json?
     

