# 🚀 Skilllink

## 📌 Tổng quan

**Đồ án môn học:** Lập trình ứng dụng web - NT208.P23.ANTT

**Giảng viên hướng dẫn:** Trần Tuấn Dũng

**👨‍💻 Thành viên nhóm 11:**
* Nhóm trưởng: **Ngô Thái Vinh** - MSSV: **23521791** - Github: https://github.com/Vi-Alviss

* Thành viên 1: **Phạm Thanh Sơn** - MSSV: **21522556** - Github: https://github.com/PhamSonUIT

* Thành viên 2: **Lê Quốc Huy** - MSSV: **23520615** - Github: https://github.com/LQHtmt 

* Thành viên 3: **Lê Phương Uyên** - MSSV: **23521761** - Github: https://github.com/PUynn

* Thành viên 4: **Lê Thị Tường Vy** - MSSV: **23521828** - Github: https://github.com/yvtg

## 📝 Giới thiệu sơ lược

**Skillink** là website kết nối freelancer với các dự án do các cá nhân hoặc công ty tuyển dụng sử dụng AI, giúp freelancer tìm việc và nhà tuyển dụng tìm nhân lực nhanh chóng.

* Hỗ trợ đăng ký với nhiều phương thức, tạo hồ sơ nhanh chóng.

* Dễ dàng tìm kiếm công việc với sự đề xuất từ AI.

* Chat trực tiếp giữa freelancer và nhà tuyển dụng, gửi file, tài liệu.

* Hỗ trợ thanh toán, giao dịch đảm bảo an toàn.

* Hệ thống đánh giá và đề xuất cho cả phía freelancer và nhà tuyển dụng.

* AI Chatbot hỗ trợ 24/7.

## 🛠 Công nghệ sử dụng
* Express js
* React js
* Firebase
* <a href="https://dbdiagram.io/d/67d92f3375d75cc8447cfbf7">Database</a>

## Configuration
Config .env 
```
DB_HOST=localhost
DB_PORT=PORT # change PORT to your port  
DB_USER=YOUR_USERNAME # change to your username
DB_PASSWORD=YOUR_PASSWORD # change YOUR_PASSWORD to your password
DB_NAME=YOUR_DB_NAME # change YOUR_DB_NAME to your database name

SERVER_PORT=YOUR_SERVER_PORT
FRONTEND_PORT=YOUR_FRONTEND_PORT
SOCKET_PORT=YOUR_SOCKET_PORT

SECRET_KEY=YOUR_SECRET_KEY

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=


GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

JWT_EXPIRES_IN=24h
JWT_SECRET=

CALLBACK_URL=http://localhost:3000

```
## Usages

run database
```sh
docker compose up
docker exec -it my-mysql mysql -u root -p
```

run backend server
```sh
cd backend
npm install
npm run start
```

run frontend
```sh
cd frontend/web
npm install
npm run start
```

## 📦 Database Schema
 
 <details><summary><strong>Users (Collection)</strong></summary><br>

 Each user document contains personal details, skills, experience, and interactions.
   
  ### User Document Structure
  - **Username**: Unique identifier for the user.
  - **Email**: Unique email address.
  - **Password**: Hashed password for security.
  - **PhoneNumber**: Contact number.
  - **AvatarURL**: Link to profile picture.
  - **Skill**: List of skills.
  - **CreatedDate**: Timestamp of account creation.
  - **Experience**: Number of years of experience.
  - **CV_URL**: Link to resume.
  - **AverageRating**: Calculated from received ratings.
  
    #### RatingsReceived (Subcollection)
    - **RaterID**: Reference to the rating user.
    - **Score**: Rating score.
    - **Comment**: Feedback from the rater.
    - **RatingDate**: Timestamp.

    #### Projects (Subcollection)
    - **ProjectsID**: Reference to the project in the projects collection
    - **IsSucceed**: True || False (True mean the project is completed | False mean the user failed to deliver the project)
    - **IsOwned**: True || False (True mean this projects is owned/posted by this user | false mean this user is a participant) (if IsOwned = True, IsSucceed can not be False)
    - **AppliedDate**: Timestamp of application.
    - **ExpiredDate**: Deadline for project involvement. ( If the product have not been deliver after this date, it will be consider failed)

    #### Rooms (Subcollection)
    - **RoomID**: Unique identifier for the chat room.
    - **Participants**: List of UserIDs in the chat room.
      
      ##### Messages (Subcollection within Rooms)
      - **SenderID**: Link to the file.
      - **MessageText**: Content of the message.
      - **SentDate**: Timestamp.

         ##### Attachments (Subcollection within Messages)
         - **FileURL**: Link to the file. 
         - **FileType**: Type of the file.
         - **SentDate**: Timestamp.
  </details>
  
  <details><summary><strong>Companies (Collection)</strong></summary><br>
   
  Each company document contains information about a company.

  ### Company Document Structure
  - **Name**: Company name.
  - **Address**: Company location.
  - **AvatarURL**: Link to company profile image.
  - **AverageRating**: Computed from received ratings.
  - **OwnerID**: Reference to the owner user.
  - **Description**: Company bio.
    
    #### RatingsReceived (Subcollection)
    - **RaterID**: Reference to the rating user.
    - **Score**: Rating score.
    - **Comment**: Feedback from the rater.
    - **RatingDate**: Timestamp.
  </details>

  <details><summary><strong>Projects (Collection)</strong></summary><br>
   
  Each project document represents a posted job opportunity.

  ### Project Document Structure
  - **ProjectName**: Name of the project.
  - **UploadedDate**: Timestamp of posting.
  - **ExpiredDate**: Deadline for applications.
  - **MinSalary**: Financial estimate for the project.
  - **MaxSalary**: Financial estimate for the project.
  - **OwnerID**: Reference to the project owner.
  - **Description**: Details of the project.
  - **WorkingType**: Remote or on-site.
  - **WorkingPlace**: Location or online.
  - **Field**: Project category.
  - **Status**: Current state of the project.
  - **AverageRating**: Computed from received ratings.
    
    #### Applicants (Subcollection)
    - **AppliedDate**: Timestamp of application.
    - **Status**: "pending", "accepted", or "rejected".

    #### RatingsReceived (Subcollection)
    - **RaterID**: Reference to the rating user.
    - **Score**: Rating score.
    - **Comment**: Feedback from the rater.
    - **RatingDate**: Timestamp.
  </details>

  <details><summary><strong>Messages (Collection)</strong></summary><br>

  Global storage for messages between users.

  ### Message Document Structure
  - **SenderID**: Reference to sender.
  - **ReceiverID**: Reference to receiver.
  - **MessageText**: Content of the message.
  - **SentDate**: Timestamp.
    
    #### Attachments (Subcollection)
    - **FileURL**: Link to the file.
    - **FileType**: Type of the file.
    - **SentDate**: Timestamp.
  </details>
  
  <details><summary><strong>Payments (Collection)</strong></summary><br>
   
  Handles salary payments between users.

  ### Payment Document Structure
  - **SenderID**: Reference to the payer.
  - **ReceiverID**: Reference to the payee.
  - **Amount**: Amount paid.
  - **PaymentMethod**: Payment service used.
  - **TransactionStatus**: "pending", "falied", "completed", etc.
  - **PaymentDate**: Timestamp of transaction.
  </details>
  
</details>

## 📦 Database Tree
  <pre><code>
├── 📁 <strong>Users</strong><br>
│   ├── 📄 <code>Username</code>: string 🟊 <strong>Unique</strong><br>
│   ├── 📄 <code>Email</code>: string 🟊 <strong>Unique</strong><br>
│   ├── 📄 <code>Password</code>: string <br>
│   ├── 📄 <code>PhoneNumber</code>: string<br>
│   ├── 📄 <code>AvatarURL</code>: string<br>
│   ├── 📄 <code>Skill</code>: array of string<br>
│   ├── 📄 <code>CreatedDate</code>: timestamp<br>
│   ├── 📄 <code>Experience</code>: number<br>
│   ├── 📄 <code>CV_URL</code>: string<br>
│   ├── 📄 <code>AverageRating</code>: number<br>
│   ├── 📁 <strong>RatingsReceived</strong><br>
│   │   ├── 📄 <code>RaterID</code>: reference to user<br>
│   │   ├── 📄 <code>Score</code>: number<br>
│   │   ├── 📄 <code>Comment</code>: string<br>
│   │   └── 📄 <code>RatingDate</code>: timestamp<br>
│   ├── 📁 <strong>Projects</strong><br>
│   │   ├── 📄 <code>ProjectsID</code>: reference to project<br>
│   │   ├── 📄 <code>IsSucceed</code>: boolean<br>
│   │   ├── 📄 <code>IsOwned</code>: boolean<br>
│   │   ├── 📄 <code>AppliedDate</code>: timestamp<br>
│   │   └── 📄 <code>ExpiredDate</code>: timestamp<br>
│   └── 📁 <strong>Rooms</strong><br>
│       ├── 📄 <code>RoomID</code>: string 🟊 <strong>Unique</strong><br>
│       ├── 📄 <code>Participants</code>: array of string of users ID<br>
│       └── 📁 <strong>Messages</strong><br>
│           ├── 📄 <code>SenderID</code>: reference to user<br>
│           ├── 📄 <code>MessageText</code>: string<br>
│           ├── 📄 <code>SentDate</code>: timestamp<br>
│           └── 📁 <strong>Attachments</strong><br>
│               ├── 📄 <code>FileURL</code>: string<br>
│               ├── 📄 <code>FileType</code>: string<br>
│               └── 📄 <code>SentDate</code>: timestamp<br>
│ 
├── 📁 <strong>Companies</strong><br>
│   ├── 📄 <code>Name</code>: string 🟊 <strong>Unique</strong><br>
│   ├── 📄 <code>Address</code>: string<br>
│   ├── 📄 <code>AvatarURL</code>: string<br>
│   ├── 📄 <code>AverageRating</code>: number<br>
│   ├── 📄 <code>OwnerID</code>: reference<br>
│   ├── 📄 <code>Description</code>: string<br>
│   └── 📁 <strong>RatingsReceived</strong><br>
│       ├── 📄 <code>RaterID</code>: reference to user<br>
│       ├── 📄 <code>Score</code>: number<br>
│       ├── 📄 <code>Comment</code>: string<br>
│       └── 📄 <code>RatingDate</code>: timestamp<br>
│
├── 📁 <strong>Projects</strong><br>
│   ├── 📄 <code>ProjectName</code>: string <br>
│   ├── 📄 <code>UploadedDate</code>: timestamp<br>
│   ├── 📄 <code>ExpiredDate</code>: timestamp<br>
│   ├── 📄 <code>MinSalary</code>: number<br>
│   ├── 📄 <code>MaxSalary</code>: number<br>
│   ├── 📄 <code>OwnerID</code>: reference to user<br>
│   ├── 📄 <code>Description</code>: string<br>
│   ├── 📄 <code>WorkingType</code>: string<br>
│   ├── 📄 <code>WorkingPlace</code>: string<br>
│   ├── 📄 <code>Field</code>: string<br>
│   ├── 📄 <code>Status</code>: string<br>
│   ├── 📄 <code>AverageRating</code>: number<br>
│   ├── 📁 <strong>Applicants</strong><br>
│   │   ├── 📄 <code>AppliedDate</code>: timestamp<br>
│   │   └── 📄 <code>Status</code>: string<br>
│   └── 📁 <strong>RatingsReceived</strong><br>
│       ├── 📄 <code>RaterID</code>: reference to user<br>
│       ├── 📄 <code>Score</code>: number<br>
│       ├── 📄 <code>Comment</code>: string<br>
│       └── 📄 <code>RatingDate</code>: timestamp<br>
│
├── 📁 <strong>Messages</strong><br>
│   ├── 📄 <code>SenderID</code>: reference to user<br>
│   ├── 📄 <code>ReceiverID</code>: reference to user<br>
│   ├── 📄 <code>MessageText</code>: string<br>
│   ├── 📄 <code>SentDate</code>: timestamp<br>
│   └── 📁 <strong>Attachments</strong><br>
│       ├── 📄 <code>FileURL</code>: string<br>
│       ├── 📄 <code>FileType</code>: string<br>
│       └── 📄 <code>SentDate</code>: timestamp<br>
│
└── 📁 <strong>Payments</strong><br>
    ├── 📄 <code>SenderID</code>: reference to user<br>
    ├── 📄 <code>ReceiverID</code>: reference to user<br>
    ├── 📄 <code>Amount</code>: number<br>
    ├── 📄 <code>PaymentMethod</code>: string<br>
    ├── 📄 <code>TransactionStatus</code>: string<br>
    └── 📄 <code>PaymentDate</code>: timestamp<br>
    </code></pre>
</details>
