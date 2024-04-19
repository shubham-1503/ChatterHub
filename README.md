## Overview 🌟

Chatterhub is a web application designed for real-time communication via chat rooms. Users can easily create or join rooms to engage in conversations. The app offers a seamless experience, allowing registration via email and username. Its focus is on simplicity and efficiency, aiming to connect users quickly. 
Key features include creating/joining rooms with unique IDs, email notifications, new user has access to all the previos chat messages

## Technical Details🚀
- Built a group chat web application using Socket.io, allowing users to create or join rooms using auto-generated keys to engage in real-time chat conversations with other users.
- Used RDS Aurora to store chat messages enabling new users to access previous chats upon joining a room.
- Implemented SNS using Lambda functions which enabled users to subscribe to a room and receive poke notifications. This was enabled using Spring Boot, stored in S3 bucket which was then referenced in Lambdas.
- Both frontend and backend code were containerized and stored in ECR, and then deployed using ECS.
- VPC was employed for secure communication between services, while 1 API Gateway facilitated an entry point for backend services.
- Additionally ELB was used to efficiently distributed traffic across instances for scalability.
- Lastly, the infrastructure was set up using CloudFormation for streamlined deployment and management.

## Demo Video 📹
Click the link below to watch the demo video

👉 [Watch Demo](https://drive.google.com/file/d/1B6Kv0ucpQSonCPBecaJmkx5jxM33MoeT/view)

## Screenshots 📸
Below are some screenshots which will give you the overall look and feel of the website

### Landing page
![image](https://firebasestorage.googleapis.com/v0/b/webt3-8766f.appspot.com/o/chatterhub%20demo%20images%2FChatterHub%20landing.png?alt=media&token=5cbb0900-be21-4eec-90a7-4e3271173f82)

### Entering your credentials
![image](https://firebasestorage.googleapis.com/v0/b/webt3-8766f.appspot.com/o/chatterhub%20demo%20images%2FChatterHub%20Login.png?alt=media&token=57141f72-6f13-4df3-91dd-a0caddbf262e)

### Create room
![image](https://firebasestorage.googleapis.com/v0/b/webt3-8766f.appspot.com/o/chatterhub%20demo%20images%2FChatterHub%20create%20room.png?alt=media&token=7d675307-81ee-48d8-ac7a-56a5382db61a)

### Join room
![image](https://firebasestorage.googleapis.com/v0/b/webt3-8766f.appspot.com/o/chatterhub%20demo%20images%2FChatterHub%20join%20room.png?alt=media&token=43844b4e-93b9-42ed-a243-4d8d07fa9048)

### Chat Page
![image](https://firebasestorage.googleapis.com/v0/b/webt3-8766f.appspot.com/o/chatterhub%20demo%20images%2Fchatscreen.png?alt=media&token=71f1065b-6f92-48c1-b06a-134522713e7b)
