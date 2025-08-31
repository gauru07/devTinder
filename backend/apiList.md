# Dev Tinder APIs

## Health Check
GET - /health -> Health check endpoint

## AuthRouter -> Done!
POST - /signup 
POST - /login
POST - /logout
GET - /check-auth

## ProfileRouter -> Done!
GET - /profile/view
PATCH - /profile/edit
PUT - /profile/update (Frontend compatibility)
PATCH - /profile/password
POST - /profile/upload-photos (Upload multiple photos)
DELETE - /profile/delete-photo/:photoIndex (Delete specific photo)
PUT - /profile/set-main-photo (Set main profile photo)

## ConnectionRequestRouter -> Done!
POST - /request/send/interested/:userId
POST - /request/send/ignored/:userId
POST - /request/send/status/:userId (Dynamic status for both APIs)
POST - /request/review/status/:requestId (Review requests)
POST - /request/review/accepted/:requestId
POST - /request/review/rejected/:requestId

## UserRouter -> Done!
GET - /user/connections
GET - /user/request/received
GET - /feed (Gets profiles of other users on platform)

## ChatRouter -> Done!
GET - /chat/conversations (Get all conversations for logged-in user)
GET - /chat/messages/:otherUserId (Get messages between two users)
POST - /chat/send (Send a message)
PATCH - /chat/read/:senderId (Mark messages as read)
GET - /chat/unread-count (Get unread message count)
GET - /user/:userId (Get user by ID for chat)

## Socket.IO Events -> Done!
Connection: Real-time messaging
Events: 
- sendMessage (Send a message)
- typing (Typing indicators)
- markAsRead (Mark messages as read)
- newMessage (Receive new message)
- messageSent (Message sent confirmation)
- userTyping (User typing notification)
- messagesRead (Messages read notification)

## File Uploads -> Done!
- Support for image uploads (JPEG, PNG, etc.)
- File size limit: 5MB
- Maximum 5 photos per user
- Static file serving at /uploads/

## Response Structures -> Fixed!

### Feed Response (GET /feed):
```json
{
  "data": [
    {
      "_id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "age": 25,
      "gender": "male",
      "photoUrl": "/uploads/photo.jpg",
      "photos": ["/uploads/photo1.jpg", "/uploads/photo2.jpg"],
      "about": "About me...",
      "bio": "My bio...",
      "skills": ["skill1", "skill2"],
      "relationshipType": "serious",
      "location": "City, State",
      "education": "Degree",
      "jobTitle": "Job Title",
      "company": "Company Name",
      "religion": "Religion",
      "ethnicity": "Ethnicity",
      "languagesSpoken": ["English", "Spanish"],
      "drinking": "occasionally",
      "smoking": "never",
      "prompts": "My perfect weekend is...",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Connections Response (GET /user/connections):
```json
{
  "data": [
    {
      "_id": "user_id",
      "firstName": "Jane",
      "lastName": "Smith",
      // ... same user fields as above
    }
  ]
}
```

### Received Requests Response (GET /user/request/received):
```json
{
  "message": "data fetch successfully",
  "data": [
    {
      "requestId": "request_id",
      "user": {
        "_id": "user_id",
        "firstName": "Jane",
        "lastName": "Smith",
        // ... same user fields as above
      },
      "status": "interested",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Profile Response (GET /profile/view):
```json
{
  "_id": "user_id",
  "firstName": "John",
  "lastName": "Doe",
  "emailId": "john@example.com",
  "age": 25,
  "gender": "male",
  "photoUrl": "/uploads/main-photo.jpg",
  "photos": ["/uploads/photo1.jpg", "/uploads/photo2.jpg", "/uploads/photo3.jpg"],
  "about": "About me...",
  "bio": "My bio...",
  "skills": ["skill1", "skill2"],
  "relationshipType": "serious",
  "location": "City, State",
  "education": "Degree",
  "jobTitle": "Job Title",
  "company": "Company Name",
  "religion": "Religion",
  "ethnicity": "Ethnicity",
  "languagesSpoken": ["English", "Spanish"],
  "drinking": "occasionally",
  "smoking": "never",
  "prompts": "My perfect weekend is...",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Photo Upload Response (POST /profile/upload-photos):
```json
{
  "success": true,
  "message": "Photos uploaded successfully",
  "photos": ["/uploads/photo1.jpg", "/uploads/photo2.jpg"]
}
```

### Photo Delete Response (DELETE /profile/delete-photo/:photoIndex):
```json
{
  "success": true,
  "message": "Photo deleted successfully",
  "photos": ["/uploads/photo1.jpg", "/uploads/photo2.jpg"]
}
```

### Set Main Photo Response (PUT /profile/set-main-photo):
```json
{
  "success": true,
  "message": "Main photo updated successfully",
  "photoUrl": "/uploads/new-main-photo.jpg"
}
```

### Request Review Response (POST /request/review/accepted/:requestId):
```json
{
  "message": "connection request accepted",
  "data": {
    "_id": "request_id",
    "fromUserId": "user_id",
    "toUserId": "current_user_id",
    "status": "accepted",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Status Values:
- ignore
- interested  
- accepted
- rejected

## Error Response Format:
All endpoints return consistent JSON error responses:
```json
{
  "error": "Error message description"
}
```

## Frontend Compatibility -> ✅ 100% Ready!
All endpoints now return the exact response structures expected by the frontend:
- ✅ Proper `data` wrapper for arrays
- ✅ Correct `requestId` format for requests
- ✅ Consistent JSON error responses
- ✅ All required fields included in responses
- ✅ Complete photo management system



