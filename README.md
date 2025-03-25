# NT208-Nhom11

## Thông tin giới thiệu
Giảng viên hướng dẫn: Thày Trần Tuấn Dũng

## Thành viên nhóm

<h2>📦 Database Schema</h2>
<details> <summary>(click to expand)</summary>
 <br>
 <details> <summary><strong>Users (Collection)</strong></summary>
  
 <h2> Users (Collection) </h2>
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
  
  <details><summary><strong>Companies (Collection)</strong></summary>
   
## Companies (Collection)
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

  <details><summary><strong>Projects (Collection)</strong></summary>
   
## Projects (Collection)
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

  <details><summary><strong>Messages (Collection)</strong></summary>
   
## Messages (Collection)
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
  
  <details><summary><strong>Payments (Collection)</strong></summary>
   
## Payments (Collection)
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
<h2>📦 Database Tree</h2>
<details> <summary>(click to expand)</summary>
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
