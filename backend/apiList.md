# Dev Tinder APIs

## AuthRounter-> Done!
POST - / signup 
POST - /login
POST - /logout

## ProfileRouter-> Done!
GET - /profile/view
PATCH- /profile/edit
PATCH- /profile/password

## ConnectionRequestRouter->
POST - /request/send/interested/:userId
POST - /request/send/ingored/:userId

POST - /request/send/status/:userId --- for both api me make staus dynamic
POST - /request/review/status/:requestId -- for review

POST - /request/review/accepeted/:requestId
POST - /request/review/rejected/:requestId

## UserRouter->
GET - /user/connections
GET - /user/requests/recieved
GET - /user/feed    ->Gets the profile of other users on flatform


status-> ignore , interested , accepeted , rejected



