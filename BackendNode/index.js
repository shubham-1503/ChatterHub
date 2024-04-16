const express = require("express");
const app = express();
const mysql = require("mysql");
const http = require("http").Server(app);
const cors = require("cors");

app.use(cors());
require("dotenv").config();

//the back seerver will be running on port 4000
const PORT = process.env.PORT || 4000;

//Connecting DB
const connection = mysql.createConnection({
  host: process.env.HOST_DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.SCHEMA_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database: ", err);
    return;
  }
  console.log("Connected to RDS");

  const createTableQuery =
    "CREATE TABLE IF NOT EXISTS messages (id INT PRIMARY KEY AUTO_INCREMENT, roomId VARCHAR(10) NOT NULL, content VARCHAR(1000) NOT NULL, senderName VARCHAR(100) NOT NULL, senderEmail VARCHAR(100) NOT NULL, createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP )";
  connection.query(createTableQuery, (err, results) => {
    if (err) {
      console.error("Error creating table: ", err);
      return;
    }
    console.log("Table messages created successfully");
  });
});

http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//the server will accept requests from any origin
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

const chatRoomsSocketsMap = new Map();
// const chatRoomsSocketsMap = new Map();

function fetchPreviousMessages(roomId) {
  return new Promise((resolve, reject) => {
    // Construct the SQL query to fetch messages for the given roomId
    const query = `SELECT senderName, senderEmail, content, createdAt 
                     FROM messages 
                     WHERE roomId = ? 
                     ORDER BY createdAt ASC`;

    // Execute the query
    connection.query(query, [roomId], (error, results) => {
      if (error) {
        console.error("Error fetching previous messages:", error);
        reject(error);
      } else {
        // Resolve with the fetched messages
        resolve(results);
      }
    });
  });
}

io.on("connection", (socket) => {
  console.log("New WebSocket connection:", socket.id);

  //Receiving message from the socket that has made a connection which has an emit event called joinRoom
  socket.on("joinRoom", async (data) => {
    const roomId = data.roomId;
    const userName = data.userName;
    const userEmail = data.userEmail;

    const userAndSocketData = {
      socketData: socket,
      ...data,
    };

    // Ensure the chatRoomsSocketsMap has an entry for the roomId
    if (!chatRoomsSocketsMap.has(roomId)) {
      chatRoomsSocketsMap.set(roomId, new Set());
    }

    chatRoomsSocketsMap.get(roomId).add(userAndSocketData);
    const socketsInChatRoom = chatRoomsSocketsMap.get(roomId);

    const users = Array.from(socketsInChatRoom).map((userAndSocketData) => {
      return {
        userName: userAndSocketData.userName,
        userEmail: userAndSocketData.userEmail,
      };
    });

    // Emit the user list to all sockets in the same room
    // io.to(roomId).emit("updateUserList", { userslist: users });

    if (socketsInChatRoom) {
      for (const eachSocket of socketsInChatRoom) {
        if (eachSocket.id !== socket.id) {
          eachSocket.socketData.emit("updateUserList", { userslist: users });
        }
      }
    }

    // Fetch previous messages from the database
    const previousMessages = await fetchPreviousMessages(roomId);

    // Format messages with required fields
    const formattedMessages = previousMessages.map((message) => {
      const sentAt = new Date(message.createdAt);

      // Subtract 6 hours from the timestamp
      sentAt.setTime(sentAt.getTime() - 3 * 60 * 60 * 1000);
      return {
        userName: message.senderName,
        userEmail: message.senderEmail,
        content: message.content,
        sentAt: sentAt.toISOString(),
      };
    });
    // console.log(formattedMessages);
    // Emit previous messages to the user who just joined
    socket.emit("previousMessages", { messages: formattedMessages });
  });

  socket.on("sendMessage", (data) => {
    // Broadcast the message to all sockets in the same room
    const roomId = data.roomId;
    const userName = data.userName;
    const userEmail = data.userEmail;
    const content = data.content;
    const sentAt = data.sentAt;
    const socketsInChatRoom = chatRoomsSocketsMap.get(roomId);

    // Emit the message to all sockets in the same room
    if (socketsInChatRoom) {
      for (const eachSocket of socketsInChatRoom) {
        if (eachSocket.socketData.id !== socket.id) {
          eachSocket.socketData.emit("messageUpdate", {
            userName,
            userEmail,
            content,
            sentAt,
          });
        }
      }
    }

    // Emit the message back to the sender's socket
    socket.emit("messageUpdate", {
      userName,
      userEmail,
      content,
      sentAt,
    });

    const insertQuery =
      "INSERT INTO messages (roomId, content, senderName, senderEmail, createdAt) VALUES (?, ?, ?, ?, ?)";

    connection.query(
      insertQuery,
      [roomId, content, userName, userEmail, sentAt],
      (err, results) => {
        if (err) {
          console.error("Error inserting data in database:", err);
          return;
        }
        // console.log("Message data inserted into Database:", results);
      }
    );
  });

  socket.on("leaveRoom", (data) => {
    const roomId = data.roomId;
    const userName = data.userName;
    const userEmail = data.userEmail;

    // Retrieve the set of sockets (users) in the chat room
    const socketsInChatRoom = chatRoomsSocketsMap.get(roomId);

    if (socketsInChatRoom) {
      // Remove the user from the set
      socketsInChatRoom.forEach((userAndSocketData) => {
        if (
          userAndSocketData.userName === userName &&
          userAndSocketData.userEmail === userEmail
        ) {
          socketsInChatRoom.delete(userAndSocketData);

          const users = Array.from(socketsInChatRoom).map((user) => {
            return { userName: userName, userEmail: userEmail };
          });

          // Inform other users about the departure of this user
          socketsInChatRoom.forEach((eachSocket) => {
            eachSocket.socketData.emit("updateUserList", { userslist: users });
          });
          return;
        }
      });
    }

    // Emit the user list to all sockets in the same room
    // io.to(roomId).emit("updateUserList", { userslist: users });

    if (socketsInChatRoom) {
      for (const eachSocket of socketsInChatRoom) {
        if (eachSocket.id !== socket.id) {
          eachSocket.socketData.emit("updateUserList", { userslist: users });
        }
      }
    }
  });

  //Receiving message from the socket that has made a connection which has an emit event called
  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });


});

app.get('/', (req, res) => {
  res.status(200).send('Server is listning on port 4000.');
});
