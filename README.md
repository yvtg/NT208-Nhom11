# NT208-Nhom11


# Database Schema

## Users (Collection)
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
---

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

---

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

---

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

---

## Payments (Collection)
  Handles salary payments between users.

  ### Payment Document Structure
  - **SenderID**: Reference to the payer.
  - **ReceiverID**: Reference to the payee.
  - **Amount**: Amount paid.
  - **PaymentMethod**: Payment service used.
  - **TransactionStatus**: "pending", "falied", "completed", etc.
  - **PaymentDate**: Timestamp of transaction.

📦 **Database**
├── 📁 **Users**
│   ├── 📄 `Username`: string 🟊 **Unique**
│   ├── 📄 `Email`: string 🟊 **Unique**
│   ├── 📄 `Password`: string
│   ├── 📄 `PhoneNumber`: string
│   ├── 📄 `AvatarURL`: string
│   ├── 📄 `Skill`: array of string
│   ├── 📄 `CreatedDate`: timestamp
│   ├── 📄 `Experience`: number
│   ├── 📄 `CV_URL`: string
│   ├── 📄 `AverageRating`: number
│   ├── 📁 **RatingsReceived**
│   │   ├── 📄 `RaterID`: reference to user
│   │   ├── 📄 `Score`: number
│   │   ├── 📄 `Comment`: string
│   │   └── 📄 `RatingDate`: timestamp
│   ├── 📁 **Projects**
│   │   ├── 📄 `ProjectsID`: reference to project
│   │   ├── 📄 `IsSucceed`: boolean
│   │   ├── 📄 `IsOwned`: boolean
│   │   ├── 📄 `AppliedDate`: timestamp
│   │   └── 📄 `ExpiredDate`: timestamp
│   └── 📁 **Rooms**
│       ├── 📄 `RoomID`: string 🟊 **Unique**
│       ├── 📄 `Participants`: array of string of users ID
│       └── 📁 **Messages**
│           ├── 📄 `SenderID`: reference to user
│           ├── 📄 `MessageText`: string
│           ├── 📄 `SentDate`: timestamp
│           └── 📁 **Attachments**
│               ├── 📄 `FileURL`: string
│               ├── 📄 `FileType`: string
│               └── 📄 `SentDate`: timestamp
├── 📁 **Companies**
│   ├── 📄 `Name`: string 🟊 **Unique**
│   ├── 📄 `Address`: string
│   ├── 📄 `AvatarURL`: string
│   ├── 📄 `AverageRating`: number
│   ├── 📄 `OwnerID`: reference
│   ├── 📄 `Description`: string
│   └── 📁 **RatingsReceived**
│       ├── 📄 `RaterID`: reference to user
│       ├── 📄 `Score`: number
│       ├── 📄 `Comment`: string
│       └── 📄 `RatingDate`: timestamp
├── 📁 **Projects**
│   ├── 📄 `ProjectName`: string 
│   ├── 📄 `UploadedDate`: timestamp
│   ├── 📄 `ExpiredDate`: timestamp
│   ├── 📄 `MinSalary`: number
|   ├── 📄 `MaxSalary`: number
│   ├── 📄 `OwnerID`: reference to user
│   ├── 📄 `Description`: string
│   ├── 📄 `WorkingType`: string
│   ├── 📄 `WorkingPlace`: string
│   ├── 📄 `Field`: string
│   ├── 📄 `Status`: string
│   ├── 📄 `AverageRating`: number
│   ├── 📁 **Applicants**
│   │   ├── 📄 `AppliedDate`: timestamp
│   │   └── 📄 `Status`: string
│   └── 📁 **RatingsReceived**
│       ├── 📄 `RaterID`: reference to user
│       ├── 📄 `Score`: number
│       ├── 📄 `Comment`: string
│       └── 📄 `RatingDate`: timestamp
├── 📁 **Messages**
│   ├── 📄 `SenderID`: reference to user
│   ├── 📄 `ReceiverID`: reference to user
│   ├── 📄 `MessageText`: string
│   ├── 📄 `SentDate`: timestamp
│   └── 📁 **Attachments**
│       ├── 📄 `FileURL`: string
│       ├── 📄 `FileType`: string
│       └── 📄 `SentDate`: timestamp
└── 📁 **Payments**
    ├── 📄 `SenderID`: reference to user
    ├── 📄 `ReceiverID`: reference to user
    ├── 📄 `Amount`: number
    ├── 📄 `PaymentMethod`: string
    ├── 📄 `TransactionStatus`: string
    └── 📄 `PaymentDate`: timestamp